#!/bin/bash
# ============================================================
#  setup-vps.sh — Setup completo en VPS desde cero
#  Ejecutar como: bash scripts/setup-vps.sh
#  Prerequisito: estar en /var/www/erp-hax con el repo clonado
# ============================================================
set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok() { echo -e "${GREEN}✓ $1${NC}"; }
info() { echo -e "${YELLOW}→ $1${NC}"; }
fail() { echo -e "${RED}✗ $1${NC}"; exit 1; }

echo ""
echo "============================================"
echo "  ERP Hax — Setup VPS"
echo "============================================"
echo ""

# ── [1] PostgreSQL ─────────────────────────────────────────
info "Instalando PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib 2>/dev/null
sudo systemctl start postgresql
sudo systemctl enable postgresql
ok "PostgreSQL instalado y activo"

# ── [2] Crear base de datos y usuario ──────────────────────
info "Configurando base de datos..."
sudo -u postgres psql << PSQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'erphax') THEN
    CREATE USER erphax WITH PASSWORD 'ErpHax2025!';
  END IF;
END
\$\$;
CREATE DATABASE erphax_db OWNER erphax;
GRANT ALL PRIVILEGES ON DATABASE erphax_db TO erphax;
PSQL
ok "Base de datos 'erphax_db' creada"

# ── [3] Archivo .env ───────────────────────────────────────
if [ ! -f .env ]; then
  info "Creando archivo .env..."
  SECRET=$(openssl rand -base64 32)
  cat > .env << ENVFILE
DATABASE_URL="postgresql://erphax:ErpHax2025!@localhost:5432/erphax_db"
NEXTAUTH_URL="http://203.161.39.136:3000"
NEXTAUTH_SECRET="$SECRET"
ALANUBE_API_URL="https://api.alanube.do/v1"
ALANUBE_API_KEY=""
ALANUBE_RNC="133290251"
NEXT_PUBLIC_APP_NAME="ERP Hax"
NEXT_PUBLIC_COMPANY_NAME="HAX ESTUDIO CREATIVO EIRL"
NEXT_PUBLIC_COMPANY_RNC="133290251"
ENVFILE
  ok ".env creado con SECRET autogenerado"
else
  ok ".env ya existe, sin cambios"
fi

# ── [4] Instalar dependencias ──────────────────────────────
info "Instalando dependencias npm..."
npm install --ignore-scripts
ok "Dependencias instaladas"

# ── [5] Prisma migrate + seed ──────────────────────────────
info "Ejecutando migraciones..."
PATH=$PATH ./node_modules/.bin/prisma migrate deploy 2>/dev/null || \
  PATH=$PATH ./node_modules/.bin/prisma db push
ok "Schema aplicado a la base de datos"

info "Ejecutando seed inicial..."
PATH=$PATH npm run db:seed
ok "Datos iniciales insertados"

# ── [6] Build ──────────────────────────────────────────────
info "Construyendo la app..."
PATH=$PATH ./node_modules/.bin/next build --no-turbopack
ok "Build completado"

# ── [7] Reiniciar PM2 ──────────────────────────────────────
info "Reiniciando PM2..."
pm2 delete erp-hax-dev 2>/dev/null || true
pm2 start /home/koderadmin/.nvm/versions/node/v24.14.0/bin/npm \
  --name "erp-hax-dev" -- run start
pm2 save
ok "App corriendo en PM2"

echo ""
echo "============================================"
echo -e "${GREEN}  ✅ Setup completado${NC}"
echo "============================================"
echo ""
echo "  URL:      http://203.161.39.136:3000"
echo "  Login:    hanzel@hax.com.do"
echo "  Password: Admin123!"
echo ""
echo "  ⚠️  Cambia la contraseña después del primer login"
echo ""
