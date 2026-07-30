#!/usr/bin/env bash
set -Eeuo pipefail

REPOSITORY_URL="${WWCOMBO_REPOSITORY_URL:-https://github.com/NovaWallace/wwcombo-repository.git}"
BRANCH="${WWCOMBO_BRANCH:-main}"
REPOSITORY_DIR="${WWCOMBO_REPOSITORY_DIR:-/opt/wwcombo-repository}"
RUNTIME_ROOT="${WWCOMBO_RUNTIME_ROOT:-/var/lib/wwcombo}"
HOST="${WWCOMBO_HOST:-0.0.0.0}"
PORT="${WWCOMBO_PORT:-9881}"
PUBLIC_URL="${WWCOMBO_PUBLIC_URL:-https://Nova.fb520.site}"
TRUST_PROXY="${WWCOMBO_TRUST_PROXY:-1}"

if [[ ${EUID:-$(id -u)} -ne 0 ]]; then
  echo "Run with sudo: curl -fsSL https://raw.githubusercontent.com/NovaWallace/wwcombo-repository/main/server/deploy.sh | sudo bash" >&2
  exit 1
fi

install_git() {
  if command -v git >/dev/null 2>&1; then
    return
  fi

  if command -v apt-get >/dev/null 2>&1; then
    apt-get update
    apt-get install -y ca-certificates git
  elif command -v dnf >/dev/null 2>&1; then
    dnf install -y ca-certificates git
  else
    echo "Git is required. Install Git and run this command again." >&2
    exit 1
  fi
}

git_in_repository() {
  git -c safe.directory="$REPOSITORY_DIR" -C "$REPOSITORY_DIR" "$@"
}

install_git

if [[ -e "$REPOSITORY_DIR" && ! -d "$REPOSITORY_DIR/.git" ]]; then
  echo "$REPOSITORY_DIR already exists but is not a Git repository." >&2
  exit 1
fi

if [[ -d "$REPOSITORY_DIR/.git" ]]; then
  if [[ -n "$(git_in_repository status --porcelain)" ]]; then
    echo "Deployment stopped because $REPOSITORY_DIR has uncommitted changes." >&2
    echo "Commit or remove those changes, then run the deployment command again." >&2
    exit 1
  fi
  git_in_repository fetch --prune origin "$BRANCH"
  git_in_repository checkout "$BRANCH"
  git_in_repository merge --ff-only "origin/$BRANCH"
else
  install -d -m 0755 "$(dirname "$REPOSITORY_DIR")"
  git clone --branch "$BRANCH" --single-branch "$REPOSITORY_URL" "$REPOSITORY_DIR"
fi

RUN_USER="${SUDO_USER:-root}"
RUN_GROUP="$(id -gn "$RUN_USER")"
chown -R "$RUN_USER:$RUN_GROUP" "$REPOSITORY_DIR"

install_args=(
  --host "$HOST"
  --port "$PORT"
  --runtime "$RUNTIME_ROOT"
  --public-url "$PUBLIC_URL"
)
if [[ "$TRUST_PROXY" == "1" ]]; then
  install_args+=(--trust-proxy)
fi

admin_password="${WWCOMBO_ADMIN_PASSWORD:-}"
if [[ ! -f "$RUNTIME_ROOT/config.json" ]]; then
  if [[ -z "$admin_password" ]]; then
    if [[ ! -r /dev/tty || ! -w /dev/tty ]]; then
      echo "First deployment needs an administrator password." >&2
      echo "Run the command in an interactive SSH terminal." >&2
      exit 1
    fi
    read -r -s -p "Set the administrator password (at least 10 characters): " admin_password < /dev/tty
    echo > /dev/tty
    read -r -s -p "Enter the password again: " admin_password_confirm < /dev/tty
    echo > /dev/tty
    [[ "$admin_password" == "$admin_password_confirm" ]] || { echo "The passwords do not match." >&2; exit 1; }
    unset admin_password_confirm
  fi
  [[ ${#admin_password} -ge 10 ]] || { echo "The administrator password must contain at least 10 characters." >&2; exit 1; }
  install_args+=(--admin-password "$admin_password")
fi

bash "$REPOSITORY_DIR/server/one-click-install.sh" "${install_args[@]}"
unset admin_password WWCOMBO_ADMIN_PASSWORD

if systemctl is-active --quiet wwcombo.service; then
  echo "Deployment complete: $PUBLIC_URL"
  echo "Admin console: ${PUBLIC_URL%/}/admin/"
  echo "Service logs: sudo journalctl -u wwcombo.service -f"
else
  echo "wwcombo.service did not start successfully." >&2
  systemctl status wwcombo.service --no-pager || true
  exit 1
fi
