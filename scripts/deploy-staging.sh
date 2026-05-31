#!/bin/bash
set -eo pipefail

# ═══════════════════════════════════════════════════════════
#  scripts/deploy-staging.sh
#  AnabellaLuna Pro — Deploy en staging (agentdebug.online)
#
#  Uso manual:
#    bash /var/www/anabellaluna-pro/scripts/deploy-staging.sh
#    bash /var/www/anabellaluna-pro/scripts/deploy-staging.sh --only admin
#    bash /var/www/anabellaluna-pro/scripts/deploy-staging.sh --only agents
#    bash /var/www/anabellaluna-pro/scripts/deploy-staging.sh --only frontend
#    bash /var/www/anabellaluna-pro/scripts/deploy-staging.sh --only backend
#
#  Llamado automáticamente por GitHub Actions en push a `staging`.
# ═══════════════════════════════════════════════════════════

PROJECT_DIR="/var/www/anabellaluna-pro"
LOGFILE="$PROJECT_DIR/deploy-staging.log"
NODE_VERSION="18"

exec > >(tee -a "$LOGFILE") 2>&1

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${CYAN}[$(date '+%H:%M:%S')]${NC} $1"; }
ok()   { echo -e "${GREEN}  ✔ $1${NC}"; }
warn() { echo -e "${YELLOW}  ⚠ $1${NC}"; }
fail() { echo -e "${RED}  ✖ $1${NC}"; exit 1; }

# ── Parsear argumentos ──────────────────────────────────────
ONLY=""
prev=""
for i in "$@"; do
  [ "$prev" = "--only" ] && ONLY="$i"
  prev="$i"
done

should_run() {
  [ -z "$ONLY" ] && return 0
  [ "$ONLY" = "$1" ] && return 0 || return 1
}

# ═══════════════════════════════════════════════════════════
echo ""
log "═══════════════════════════════════════════════════"
log "  DEPLOY STAGING — $(date '+%Y-%m-%d %H:%M:%S')"
log "  Repo: $PROJECT_DIR"
log "═══════════════════════════════════════════════════"

# ── 1. Git pull desde staging ───────────────────────────────
log "📥 Actualizando código (branch: staging)..."
cd "$PROJECT_DIR"
git fetch origin
git checkout staging 2>/dev/null || git checkout -b staging origin/staging
git pull origin staging || fail "git pull falló"
ok "Código en HEAD: $(git log --oneline -1)"

# ── 2. Backend ───────────────────────────────────────────────
if should_run "backend"; then
  log "🔧 Backend — npm install..."
  cd "$PROJECT_DIR/backend"
  npm install --no-audit --no-fund || fail "npm install backend falló"

  log "🔄 Backend — reiniciando con PM2..."
  if pm2 describe anabellaluna-pro-backend > /dev/null 2>&1; then
    pm2 restart anabellaluna-pro-backend --update-env
  else
    [ -f .env ] || cp .env.example .env  # primera vez: copiar ejemplo
    pm2 start server.js --name anabellaluna-pro-backend --cwd "$PROJECT_DIR/backend"
  fi
  pm2 save
  ok "Backend activo en puerto 4000"
fi

# ── 3. Admin ERP (admin.agentdebug.online) ──────────────────
if should_run "admin"; then
  log "🏗  Admin ERP — instalando dependencias..."
  cd "$PROJECT_DIR/admin"
  npm install --no-audit --no-fund || fail "npm install admin falló"

  log "🏗  Admin ERP — compilando..."
  REACT_APP_API_URL="https://admin.agentdebug.online" \
  NODE_ENV=production \
  DISABLE_ESLINT_PLUGIN=true \
  GENERATE_SOURCEMAP=false \
  npm run build || fail "Admin build falló"
  ok "Admin build → admin/build/"
fi

# ── 4. Agents CRM (agentes.agentdebug.online) ───────────────
if should_run "agents"; then
  log "🏗  Agents CRM — instalando dependencias..."
  cd "$PROJECT_DIR/agents"
  npm install --no-audit --no-fund || fail "npm install agents falló"

  log "🏗  Agents CRM — compilando..."
  REACT_APP_API_URL="https://agentes.agentdebug.online" \
  NODE_ENV=production \
  DISABLE_ESLINT_PLUGIN=true \
  GENERATE_SOURCEMAP=false \
  npm run build || fail "Agents build falló"
  ok "Agents build → agents/build/"
fi

# ── 5. Frontend público (agentdebug.online) ─────────
if should_run "frontend"; then
  log "🏗  Frontend — instalando dependencias..."
  cd "$PROJECT_DIR/frontend"
  npm install --no-audit --no-fund || fail "npm install frontend falló"

  log "🏗  Frontend — compilando..."
  VITE_API_URL="https://agentdebug.online" \
  NODE_ENV=production \
  npm run build || fail "Frontend build falló"
  ok "Frontend build → frontend/dist/"
fi

# ── 6. Nginx reload ─────────────────────────────────────────
log "🔁 Recargando nginx..."
sudo nginx -t && sudo systemctl reload nginx || warn "nginx reload falló — verificar manualmente"
ok "Nginx recargado"

# ── 7. Resumen ──────────────────────────────────────────────
echo ""
log "═══════════════════════════════════════════════════"
log "  ✅ DEPLOY STAGING COMPLETADO — $(date '+%H:%M:%S')"
log "═══════════════════════════════════════════════════"
echo ""
log "URLs activas:"
echo "  🌐 https://agentdebug.online"
echo "  🏢 https://admin.agentdebug.online"
echo "  👤 https://agentes.agentdebug.online"
echo ""
pm2 list
echo ""
log "Log en: $LOGFILE"
