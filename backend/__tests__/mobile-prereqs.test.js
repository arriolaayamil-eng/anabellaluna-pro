const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongoServer;
let adminToken;
let adminUsername;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-of-sufficient-length-1234567890';
  process.env.STAGING_ORIGIN = 'https://staging.example.com';
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  app = require('../server');

  adminUsername = `admin${Date.now()}`;
  await request(app).post('/auth/register').send({ username: adminUsername, password: 'secret123', role: 'admin' });
  const res = await request(app).post('/auth/login').send({ username: adminUsername, password: 'secret123' });
  adminToken = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// ── TAREA 1 ──────────────────────────────────────────────────────────────────
describe('TAREA 1 — access token 15min', () => {
  test('login devuelve token con expiración <= 900s', async () => {
    const res = await request(app).post('/auth/login').send({ username: adminUsername, password: 'secret123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    const decoded = jwt.decode(res.body.token);
    expect(decoded.exp - decoded.iat).toBeLessThanOrEqual(900);
  });
});

// ── TAREA 2 ──────────────────────────────────────────────────────────────────
describe('TAREA 2 — refresh tokens con rotación', () => {
  test('login devuelve token, accessToken y refreshToken', async () => {
    const res = await request(app).post('/auth/login').send({ username: adminUsername, password: 'secret123' });
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.token).toBe(res.body.accessToken);
  });

  test('refresh válido devuelve nuevos tokens y rota', async () => {
    const login = await request(app).post('/auth/login').send({ username: adminUsername, password: 'secret123' });
    const rt = login.body.refreshToken;

    const refresh = await request(app).post('/api/v1/auth/refresh').send({ refreshToken: rt });
    expect(refresh.statusCode).toBe(200);
    expect(refresh.body).toHaveProperty('accessToken');
    expect(refresh.body).toHaveProperty('refreshToken');
    expect(refresh.body.refreshToken).not.toBe(rt);

    // Reuso del token viejo (ya rotado) → 401 + compromete familia
    const reuse = await request(app).post('/api/v1/auth/refresh').send({ refreshToken: rt });
    expect(reuse.statusCode).toBe(401);
    expect(reuse.body.error).toMatch(/comprometida/i);

    // El nuevo token también queda revocado al comprometerse la familia
    const after = await request(app).post('/api/v1/auth/refresh').send({ refreshToken: refresh.body.refreshToken });
    expect(after.statusCode).toBe(401);
  });

  test('refresh con token inventado → 401', async () => {
    const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken: 'no-existe-este-token' });
    expect(res.statusCode).toBe(401);
  });

  test('logout revoca el refresh token', async () => {
    const login = await request(app).post('/auth/login').send({ username: adminUsername, password: 'secret123' });
    const rt = login.body.refreshToken;
    const logout = await request(app).post('/api/v1/auth/logout').send({ refreshToken: rt });
    expect(logout.statusCode).toBe(200);
    const refresh = await request(app).post('/api/v1/auth/refresh').send({ refreshToken: rt });
    expect(refresh.statusCode).toBe(401);
  });
});

// ── TAREA 3 ──────────────────────────────────────────────────────────────────
describe('TAREA 3 — CORS whitelist', () => {
  test('Origin capacitor://localhost permitido', async () => {
    const res = await request(app).get('/health').set('Origin', 'capacitor://localhost');
    expect(res.headers['access-control-allow-origin']).toBe('capacitor://localhost');
  });

  test('Origin localhost:5173 (frontend web) permitido', async () => {
    const res = await request(app).get('/health').set('Origin', 'http://localhost:5173');
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  test('Origin random bloqueado (sin allow-origin header)', async () => {
    const res = await request(app).get('/health').set('Origin', 'https://dominio-random.com');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});

// ── TAREA 4 ──────────────────────────────────────────────────────────────────
describe('TAREA 4 — alias /api/v1', () => {
  test('POST /auth/login (legacy) funciona', async () => {
    const res = await request(app).post('/auth/login').send({ username: adminUsername, password: 'secret123' });
    expect(res.statusCode).toBe(200);
  });

  test('POST /api/v1/auth/login funciona', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ username: adminUsername, password: 'secret123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('refreshToken');
  });
});

// ── TAREA 5 ──────────────────────────────────────────────────────────────────
describe('TAREA 5 — push subscribe/unsubscribe con auth', () => {
  const fakeSub = {
    subscription: {
      endpoint: 'https://push.example.com/abc123',
      keys: { p256dh: 'p256dh-key', auth: 'auth-key' },
    },
  };

  test('subscribe sin Authorization → 401', async () => {
    const res = await request(app).post('/api/push/subscribe').send(fakeSub);
    expect(res.statusCode).toBe(401);
  });

  test('subscribe con JWT válido → 200, userId del token', async () => {
    const res = await request(app)
      .post('/api/push/subscribe')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(fakeSub);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('unsubscribe sin Authorization → 401', async () => {
    const res = await request(app).post('/api/push/unsubscribe').send({ endpoint: fakeSub.subscription.endpoint });
    expect(res.statusCode).toBe(401);
  });
});

// ── TAREA 6 ──────────────────────────────────────────────────────────────────
describe('TAREA 6 — fileFilter fotos', () => {
  test('upload .pdf al endpoint de fotos → 400', async () => {
    const res = await request(app)
      .post('/editor/watermarks')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', Buffer.from('%PDF-1.4 fake'), { filename: 'doc.pdf', contentType: 'application/pdf' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Tipo de archivo no permitido/i);
  });

  test('upload imagen > 20MB → 413', async () => {
    const big = Buffer.alloc(21 * 1024 * 1024, 1);
    const res = await request(app)
      .post('/editor/watermarks')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', big, { filename: 'big.jpg', contentType: 'image/jpeg' });
    expect(res.statusCode).toBe(413);
  });

  test('jpg válido pasa el fileFilter (no es rechazado por tipo)', async () => {
    const res = await request(app)
      .post('/editor/watermarks')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', Buffer.from('\xff\xd8\xff fake jpeg'), { filename: 'photo.jpg', contentType: 'image/jpeg' });
    // Pasa el filtro: NO debe ser el error de tipo. Puede fallar luego por MinIO
    // ausente en el entorno de test, pero nunca por "Tipo de archivo no permitido".
    expect(res.statusCode).not.toBe(413);
    if (res.body && res.body.error) {
      expect(res.body.error).not.toMatch(/Tipo de archivo no permitido/i);
    }
  });
});
