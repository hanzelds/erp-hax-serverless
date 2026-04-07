#!/bin/bash
# update.sh — Actualizar la app en VPS después de git push
set -e
cd /var/www/erp-hax
echo "→ Pulling latest..."
git pull origin main
echo "→ Installing dependencies..."
npm install --ignore-scripts
echo "→ Running migrations..."
PATH=$PATH ./node_modules/.bin/prisma migrate deploy 2>/dev/null || \
  PATH=$PATH ./node_modules/.bin/prisma db push
echo "→ Building..."
PATH=$PATH ./node_modules/.bin/next build --no-turbopack
echo "→ Restarting PM2..."
pm2 restart erp-hax-dev
echo "✅ Update complete"
