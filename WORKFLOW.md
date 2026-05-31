# Workflow de Desarrollo — AnabellaLuna Pro

Flujo: **Dev Laptop → GitHub (`anabellaluna-pro`) → Staging** (auto-deploy).
No existe entorno de producción en este proyecto.

```
laptop (anabellaluna-pro)  ──push develop──▶  GitHub  ──GitHub Action (SSH)──▶  staging (build + deploy automático)
      ▲
      └── pull ── upstream (anabellaluna = fork del colaborador)
```

## Repos / remotes
| Remote | Repo | Rol |
|--------|------|-----|
| `origin` | `arriolaayamil-eng/anabellaluna-pro` | Tu repo — fuente de verdad, se despliega a staging |
| `upstream` | `arriolaayamil-eng/anabellaluna` | Fork del colaborador — de acá se bajan sus features |

## Ramas
| Rama | Propósito | Deploy automático |
|------|-----------|-------------------|
| `main` | Código estable — gestionado por el colaborador | No (fuera de scope) |
| `develop` | Integración continua | → **Staging automático** (push) |
| `feature/*` | Desarrollo de funcionalidades | No |
| `hotfix/*` | Fixes urgentes | No |

## Entorno staging (detectado)
- Server: `expert001@190.196.230.128`
- Directorio deploy: `/var/www/anabellaluna-pro`
- Runtime: Node 22 · Web server: nginx · Proceso backend: PM2 `anabellaluna-pro-backend` (puerto 4000)
- Frontends estáticos servidos por nginx: admin (`admin.agentdebug.online`), agents (`agentes.agentdebug.online`), público (`agentdebug.online`)
- Script de deploy en el server: `scripts/deploy-staging.sh` (lo invoca la GitHub Action)

## Situación A — Nueva funcionalidad
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-descriptivo
# ... trabajar ...
git add .
git commit -m "feat: descripción en presente"
git push origin feature/nombre-descriptivo
```
Abrir PR en GitHub: `develop ← feature/nombre-descriptivo`.
Al mergear el PR → push a `develop` → **deploy automático a staging**.

## Situación B — Hotfix urgente
```bash
git checkout develop
git pull origin develop
git checkout -b hotfix/descripcion-breve
# ... fix ...
git commit -m "fix: descripción del problema"
git push origin hotfix/descripcion-breve
```
Abrir PR hacia `develop`. Al mergear → deploy automático a staging.

## Situación C — Bajar features del colaborador (upstream)
```bash
git fetch upstream
git checkout develop
git merge upstream/main        # o cherry-pick de commits puntuales
# resolver conflictos si los hay
git push origin develop        # dispara deploy a staging
```

## Situación D — El deploy a staging falló
1. GitHub → **Actions** → abrir el run de "Deploy → Staging" y leer el log.
2. Si es error de código: corregir en la rama, commit y push; volver a mergear a `develop`.
3. Re-disparar sin nuevos commits: Actions → "Deploy → Staging" → **Run workflow** (workflow_dispatch).
4. Rollback manual en el server:
   ```bash
   ssh expert001@190.196.230.128
   cd /var/www/anabellaluna-pro
   git log --oneline -5
   git reset --hard <COMMIT_HASH_ESTABLE>
   bash scripts/deploy-staging.sh           # rebuild + restart
   # o restaurar un backup de build previo:
   ls .deploy-backups/                        # backups con timestamp (builds + .env)
   ```

## Convención de commits
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` documentación
- `chore:` mantenimiento / config
- `refactor:` refactor sin cambio de comportamiento
- `test:` tests

## CI/CD (GitHub Actions)
- `.github/workflows/ci.yml` — corre en cada **PR** a `develop`/`main`: install + lint + tests del backend.
- `.github/workflows/deploy-staging.yml` — corre en cada **push** a `develop`: SSH al server y ejecuta `deploy-staging.sh` (sync `develop` → npm install → build admin/agents/frontend → restart PM2) + health check de los 3 dominios.

### Secrets requeridos (GitHub → Settings → Secrets and variables → Actions)
| Secret | Valor |
|--------|-------|
| `SSH_STAGING_HOST` | `190.196.230.128` |
| `SSH_STAGING_USER` | `expert001` |
| `SSH_STAGING_PRIVATE_KEY` | contenido completo de `~/.ssh/github_actions_staging` (incluye `-----BEGIN`/`-----END-----`) |

> La clave pública (`github_actions_staging.pub`) ya está instalada en `~/.ssh/authorized_keys` del server.
> El `ANTHROPIC_API_KEY` del backend (feature de IA/MCP) se configura en `/var/www/anabellaluna-pro/backend/.env` en el server (no es un secret de CI).
