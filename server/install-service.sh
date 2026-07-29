#!/usr/bin/env bash
set -Eeuo pipefail

SERVER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPOSITORY_DIR="$(cd "$SERVER_DIR/.." && pwd)"
HOST="0.0.0.0"
PORT="9881"
RUNTIME_ROOT="/var/lib/wwcombo"
ADMIN_PASSWORD=""
PUBLIC_URL="https://Nova.fb520.site"
TRUST_PROXY="0"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host) HOST="${2:?Missing host}"; shift 2 ;;
    --port) PORT="${2:?Missing port}"; shift 2 ;;
    --runtime) RUNTIME_ROOT="${2:?Missing runtime path}"; shift 2 ;;
    --admin-password) ADMIN_PASSWORD="${2:?Missing admin password}"; shift 2 ;;
    --public-url) PUBLIC_URL="${2:?Missing public URL}"; shift 2 ;;
    --trust-proxy) TRUST_PROXY="1"; shift ;;
    --help|-h)
      echo "Usage: sudo bash server/install-service.sh [--host 0.0.0.0] [--port 9881] [--public-url https://Nova.fb520.site] [--trust-proxy] [--admin-password VALUE]"
      exit 0
      ;;
    *) echo "Unknown option: $1" >&2; exit 2 ;;
  esac
done

[[ ${EUID:-$(id -u)} -eq 0 ]] || { echo "Run this installer with sudo." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js 18+ is required." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required." >&2; exit 1; }
command -v git >/dev/null 2>&1 || { echo "Git is required." >&2; exit 1; }
command -v systemctl >/dev/null 2>&1 || { echo "systemd is required." >&2; exit 1; }
[[ "$PUBLIC_URL" =~ ^https?://[^[:space:]]+$ ]] || { echo "Invalid public URL: $PUBLIC_URL" >&2; exit 1; }

npm install --omit=dev --prefix "$SERVER_DIR"

RUN_USER="${SUDO_USER:-root}"
RUN_GROUP="$(id -gn "$RUN_USER")"
install -d -o "$RUN_USER" -g "$RUN_GROUP" -m 0750 "$RUNTIME_ROOT"

if [[ -n "$ADMIN_PASSWORD" ]]; then
  WWCOMBO_ADMIN_PASSWORD="$ADMIN_PASSWORD" node "$SERVER_DIR/configure.mjs" --runtime "$RUNTIME_ROOT"
else
  node "$SERVER_DIR/configure.mjs" --runtime "$RUNTIME_ROOT"
fi
chown -R "$RUN_USER:$RUN_GROUP" "$RUNTIME_ROOT"

cat > /etc/systemd/system/wwcombo.service <<EOF
[Unit]
Description=WWCombo community server
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
User=$RUN_USER
Group=$RUN_GROUP
WorkingDirectory=$REPOSITORY_DIR
Environment=WWCOMBO_HOST=$HOST
Environment=WWCOMBO_PORT=$PORT
ExecStart=/bin/bash $SERVER_DIR/start.sh --host $HOST --port $PORT --runtime $RUNTIME_ROOT --public-url $PUBLIC_URL$(if [[ "$TRUST_PROXY" == "1" ]]; then printf ' --trust-proxy'; fi)
Restart=on-failure
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable wwcombo.service
systemctl restart wwcombo.service
echo "服务已启动：${PUBLIC_URL%/}/"
echo "管理后台：${PUBLIC_URL%/}/admin/"
echo "监听地址：$HOST:$PORT"
echo "查看日志：sudo journalctl -u wwcombo.service -f"
