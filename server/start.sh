#!/usr/bin/env bash
set -Eeuo pipefail

SERVER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPOSITORY_DIR="$(cd "$SERVER_DIR/.." && pwd)"
HOST="0.0.0.0"
PORT="9881"
RUNTIME_ROOT="$(cd "$REPOSITORY_DIR/.." && pwd)/wwcombo-server-runtime"
ADMIN_PASSWORD=""
PUBLIC_URL="https://Nova.fb520.site"
TRUST_PROXY="0"

usage() {
  cat <<'EOF'
Usage: bash server/start.sh [options]

Options:
  --host ADDRESS          Listen address (default: 0.0.0.0)
  --port NUMBER           Listen port (default: 9881)
  --runtime PATH          Runtime data directory
  --admin-password VALUE  Set or reset the server admin password
  --public-url URL        Public website URL (default: https://Nova.fb520.site)
  --trust-proxy           Trust reverse-proxy HTTPS and client headers
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host) HOST="${2:?Missing host}"; shift 2 ;;
    --port) PORT="${2:?Missing port}"; shift 2 ;;
    --runtime) RUNTIME_ROOT="${2:?Missing runtime path}"; shift 2 ;;
    --admin-password) ADMIN_PASSWORD="${2:?Missing admin password}"; shift 2 ;;
    --public-url) PUBLIC_URL="${2:?Missing public URL}"; shift 2 ;;
    --trust-proxy) TRUST_PROXY="1"; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 2 ;;
  esac
done

command -v node >/dev/null 2>&1 || { echo "Node.js 18+ is required." >&2; exit 1; }
command -v git >/dev/null 2>&1 || { echo "Git is required." >&2; exit 1; }
NODE_MAJOR="$(node -p "Number(process.versions.node.split('.')[0])")"
(( NODE_MAJOR >= 18 )) || { echo "Node.js 18+ is required; current version: $(node -v)" >&2; exit 1; }
[[ "$PORT" =~ ^[0-9]+$ ]] && (( PORT >= 1 && PORT <= 65535 )) || { echo "Invalid port: $PORT" >&2; exit 1; }
[[ "$PUBLIC_URL" =~ ^https?://[^[:space:]]+$ ]] || { echo "Invalid public URL: $PUBLIC_URL" >&2; exit 1; }

mkdir -p "$RUNTIME_ROOT"
if [[ -n "$ADMIN_PASSWORD" ]]; then
  WWCOMBO_ADMIN_PASSWORD="$ADMIN_PASSWORD" node "$SERVER_DIR/configure.mjs" --runtime "$RUNTIME_ROOT"
else
  node "$SERVER_DIR/configure.mjs" --runtime "$RUNTIME_ROOT"
fi
unset ADMIN_PASSWORD

export WWCOMBO_HOST="$HOST"
export WWCOMBO_PORT="$PORT"
export WWCOMBO_RUNTIME_ROOT="$RUNTIME_ROOT"
export WWCOMBO_PUBLIC_URL="${PUBLIC_URL%/}"
export WWCOMBO_TRUST_PROXY="$TRUST_PROXY"

echo "网站地址：${WWCOMBO_PUBLIC_URL}/"
echo "管理后台：${WWCOMBO_PUBLIC_URL}/admin/"
echo "监听地址：$HOST:$PORT"

child_pid=""
stop_child() {
  if [[ -n "$child_pid" ]] && kill -0 "$child_pid" 2>/dev/null; then
    kill "$child_pid" 2>/dev/null || true
    wait "$child_pid" 2>/dev/null || true
  fi
  exit 0
}
trap stop_child INT TERM

while true; do
  node "$SERVER_DIR/server.mjs" &
  child_pid=$!
  set +e
  wait "$child_pid"
  exit_code=$?
  set -e
  child_pid=""
  if [[ "$exit_code" -eq 75 ]]; then
    echo "更新完成，正在重启服务。"
    sleep 1
    continue
  fi
  exit "$exit_code"
done
