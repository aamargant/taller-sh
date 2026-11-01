#!/usr/bin/env bash
# taller.sh // Local Server + Cloudflare Tunnel Daemon
set -e

PORT=8088
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Iniciando taller.sh en local (puerto $PORT)..."

# Matar procesos anteriores si los hubiera
pkill -f "http.server $PORT" 2>/dev/null || true
pkill -f "cloudflared tunnel --url http://127.0.0.1:$PORT" 2>/dev/null || true

# Arrancar servidor HTTP local
python3 -m http.server "$PORT" --directory "$DIR" > /tmp/taller-sh-http.log 2>&1 &
SERVER_PID=$!
echo "✓ Servidor local iniciado (PID: $SERVER_PID)"

# Arrancar túnel Cloudflare seguro
echo "==> Abriendo túnel seguro Cloudflare Edge (HTTPS)..."
/opt/homebrew/bin/cloudflared tunnel --url "http://127.0.0.1:$PORT" > /tmp/taller-sh-tunnel.log 2>&1 &
TUNNEL_PID=$!
echo "✓ Túnel Cloudflare iniciado (PID: $TUNNEL_PID)"

sleep 3
URL=$(grep -oE "https://[a-zA-Z0-9-]+\.trycloudflare\.com" /tmp/taller-sh-tunnel.log | head -n 1 || true)

echo "============================================================"
echo "  🛠️  TALLER.SH YA ESTÁ PUBLICADO EN INTERNET"
echo "============================================================"
echo "  Local:   http://localhost:$PORT"
if [ -n "$URL" ]; then
  echo "  Público: $URL"
else
  echo "  (Comprueba /tmp/taller-sh-tunnel.log para ver la URL generada)"
fi
echo "============================================================"
echo "Para detener el servidor: pkill -f 'http.server $PORT' && pkill -f 'cloudflared tunnel'"
