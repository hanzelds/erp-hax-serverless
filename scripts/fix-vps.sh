#!/bin/bash
# ============================================================
#  fix-vps.sh — Aplica fixes de compatibilidad para VPS
#  Usa el paquete npm oficial 'geist' en lugar de descargar
#  archivos de fuentes manualmente.
#  Uso: bash scripts/fix-vps.sh
# ============================================================

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LAYOUT_FILE="$ROOT_DIR/src/app/layout.tsx"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
fail() { echo -e "${RED}✗ $1${NC}"; exit 1; }

echo ""
echo "============================================"
echo "  fix-vps.sh — ERP Hax VPS Compatibility"
echo "============================================"
echo ""

# ── [1] Verificar raíz del proyecto ────────────────────────
if [ ! -f "$ROOT_DIR/package.json" ]; then
  fail "No se encontró package.json. Ejecuta desde la raíz del proyecto."
fi
ok "Raíz del proyecto: $ROOT_DIR"

# ── [2] Instalar paquete geist (fuentes oficiales vía npm) ──
if ! grep -q '"geist"' "$ROOT_DIR/package.json" 2>/dev/null; then
  echo "  Instalando paquete geist..."
  cd "$ROOT_DIR"
  npm install geist || fail "No se pudo instalar el paquete geist"
  ok "Paquete geist instalado"
else
  ok "Paquete geist ya está en package.json"
fi

# ── [3] Actualizar layout.tsx ──────────────────────────────
if grep -q "next/font/google\|next/font/local" "$LAYOUT_FILE" 2>/dev/null; then
  echo "  Actualizando layout.tsx para usar paquete geist..."
  cat > "$LAYOUT_FILE" << 'EOF'
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERP Hax",
  description: "ERP Hax Serverless",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
EOF
  ok "layout.tsx actualizado (usa paquete geist)"
else
  ok "layout.tsx ya está actualizado, sin cambios"
fi

# ── [4] Limpiar carpeta fonts/ si existe (ya no se necesita) 
if [ -d "$ROOT_DIR/src/app/fonts" ]; then
  rm -rf "$ROOT_DIR/src/app/fonts"
  ok "Carpeta fonts/ eliminada (ya no necesaria)"
fi

# ── [5] .gitignore ─────────────────────────────────────────
if ! grep -q "^\.next" "$ROOT_DIR/.gitignore" 2>/dev/null; then
  echo ".next/" >> "$ROOT_DIR/.gitignore"
  ok ".next/ agregado a .gitignore"
else
  ok ".gitignore ya excluye .next/"
fi

# ── [6] Commit y push ──────────────────────────────────────
echo ""
echo "--------------------------------------------"
read -p "¿Hacer commit y push automático? (s/N): " DOPUSH
echo ""

if [[ "$DOPUSH" =~ ^[sS]$ ]]; then
  cd "$ROOT_DIR"
  git add package.json package-lock.json src/app/layout.tsx .gitignore
  # Remover fonts/ del tracking si estaban commiteadas
  git rm -r --cached src/app/fonts/ 2>/dev/null && ok "fonts/ removido del repo" || true
  git diff --cached --stat
  echo ""
  git commit -m "fix: use geist npm package for VPS compatibility"
  git push origin main
  ok "Commit y push completados"
else
  warn "Skipped. Para hacerlo manualmente:"
  echo "  git rm -r --cached src/app/fonts/ 2>/dev/null || true"
  echo "  git add package.json package-lock.json src/app/layout.tsx .gitignore"
  echo "  git commit -m 'fix: use geist npm package for VPS compatibility'"
  echo "  git push origin main"
fi

echo ""
echo "============================================"
echo -e "${GREEN}  ✓ Todos los fixes aplicados correctamente${NC}"
echo "============================================"
echo ""
echo "  Siguiente paso en la VPS:"
echo "  cd /var/www/erp-hax"
echo "  git pull origin main"
echo "  npm install"
echo "  PATH=\$PATH ./node_modules/.bin/next build --no-turbopack"
echo "  pm2 restart erp-hax-dev"
echo ""