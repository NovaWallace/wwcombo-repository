#!/usr/bin/env bash
set -Eeuo pipefail

SERVER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[[ ${EUID:-$(id -u)} -eq 0 ]] || { echo "请使用 sudo bash server/one-click-install.sh 运行。" >&2; exit 1; }

node_ok="0"
if command -v node >/dev/null 2>&1; then
  node_major="$(node -p "Number(process.versions.node.split('.')[0])" 2>/dev/null || echo 0)"
  [[ "$node_major" =~ ^[0-9]+$ ]] && (( node_major >= 18 )) && node_ok="1"
fi

if [[ "$node_ok" != "1" ]] || ! command -v npm >/dev/null 2>&1 || ! command -v git >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update
    apt-get install -y ca-certificates curl git
    if [[ "$node_ok" != "1" ]]; then
      curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
      apt-get install -y nodejs
    else
      apt-get install -y npm
    fi
  elif command -v dnf >/dev/null 2>&1; then
    dnf install -y nodejs npm git
  else
    echo "无法识别系统包管理器，请先安装 Node.js 18+、npm、Git 和 systemd。" >&2
    exit 1
  fi
fi

echo "依赖已就绪，接下来由你设置维护端密码并启动服务。"
bash "$SERVER_DIR/install-service.sh" "$@"
