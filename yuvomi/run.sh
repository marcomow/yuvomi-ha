#!/usr/bin/env bash
# Add-on bootstrap: maps Home Assistant add-on options onto Yuvomi's
# environment variables, prepares persistent directories, then chains into
# the upstream entrypoint (which fixes /data ownership and drops privileges
# to the node user).
set -euo pipefail

echo "[yuvomi-addon] preparing Yuvomi environment"

export NODE_ENV=production
export PORT=3000
export DB_PATH=/data/yuvomi.db
# The add-on is reached over plain HTTP on the LAN (or via a user-managed
# reverse proxy), so secure-only session cookies stay off by default.
export SESSION_SECURE="${SESSION_SECURE:-false}"

# Backups and documents live on /share so they survive an add-on
# uninstall and are reachable via the Samba/SSH add-ons.
export BACKUP_DIR=/share/yuvomi/backups
export DOCUMENT_STORAGE_LOCAL_PATH=/share/yuvomi/documents
mkdir -p "${BACKUP_DIR}" "${DOCUMENT_STORAGE_LOCAL_PATH}"
chown -R node:node /share/yuvomi

# Session secret: generated once on first start, persisted in the add-on's
# private data directory.
SECRET_FILE=/data/.session_secret
if [ ! -s "${SECRET_FILE}" ]; then
  node -e "process.stdout.write(require('crypto').randomBytes(48).toString('hex'))" > "${SECRET_FILE}"
  chmod 600 "${SECRET_FILE}"
fi
SESSION_SECRET="$(cat "${SECRET_FILE}")"
export SESSION_SECRET

# Apply configured add-on options (log level, backups, encryption key,
# passthrough env_vars).
eval "$(node /usr/local/lib/yuvomi-addon/export-env.js)"

# Custom Yuvomi modules persist under /data/modules across image updates.
mkdir -p /data/modules
if [ -d /app/modules ] && [ ! -L /app/modules ] && [ -z "$(ls -A /app/modules)" ]; then
  rmdir /app/modules
  ln -s /data/modules /app/modules
fi

echo "[yuvomi-addon] starting Yuvomi on port ${PORT}"
exec /entrypoint.sh node server/index.js
