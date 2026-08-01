# Home Assistant Add-on: Yuvomi

[Yuvomi](https://github.com/ulsklyc/yuvomi) is a privacy-focused, self-hosted
family planner: tasks (Kanban), shopping lists, meals & recipes, calendar,
budget & split expenses, health tracking, documents, notes, birthdays,
rewards, reminders and more — all in one PWA, running entirely on your own
hardware.

This add-on wraps the official Yuvomi container image so it runs under the
Home Assistant Supervisor with persistent storage and configuration through
the add-on UI.

## Installation

1. Add this repository to your Home Assistant add-on store:
   **Settings → Add-ons → Add-on Store → ⋮ → Repositories** and paste
   `https://github.com/marcomow/yuvomi-ha`.
2. Find **Yuvomi** in the store and click **Install**.
3. Start the add-on and click **Open Web UI** (port `3000` by default).
4. On first launch, Yuvomi's setup wizard walks you through creating the
   household and admin account.

## Data locations

| What | Where | Survives uninstall? |
|------|-------|---------------------|
| Database (`yuvomi.db`) | add-on private data (`/data`) | No — take a backup first |
| Automated backups | `/share/yuvomi/backups` | Yes |
| Documents (local storage) | `/share/yuvomi/documents` | Yes |
| Custom modules | add-on private data (`/data/modules`) | No |

Everything under `/share/yuvomi` is reachable through the Samba or SSH
add-ons, so automated backups can be copied off-device easily.

## Configuration

Example configuration:

```yaml
log_level: info
db_encryption_key: ""
backup_enabled: true
backup_schedule: "0 2 * * *"
backup_keep: 7
local_document_storage: true
env_vars:
  - name: WEATHER_LAT
    value: "52.52"
  - name: WEATHER_LON
    value: "13.405"
```

### Option: `log_level`

Yuvomi server log verbosity: `debug`, `info`, `warn` or `error`.

### Option: `db_encryption_key`

Optional AES-256 key for SQLCipher database encryption at rest. Leave empty
for an unencrypted database.

**Warning:** set this *before first start* if you want encryption. Changing
or removing the key after the database has been created makes the existing
database unreadable (restore from a backup in that case). Keep a copy of the
key somewhere safe — without it your data cannot be recovered.

### Option: `backup_enabled` / `backup_schedule` / `backup_keep`

Controls Yuvomi's built-in automated backups. `backup_schedule` is a cron
expression (default `0 2 * * *`, i.e. daily at 02:00) and `backup_keep` is
the number of backup archives to retain. Backups are written to
`/share/yuvomi/backups`.

### Option: `local_document_storage`

Enables the local storage backend of the Documents module, storing uploaded
files under `/share/yuvomi/documents`. Disable it if you only use WebDAV or
Google Drive document storage (configured via `env_vars`).

### Option: `env_vars`

Passthrough for any other Yuvomi environment variable — weather, SMTP email,
Google/CalDAV calendar sync, OIDC single sign-on, web push, WebDAV backup
targets and so on. See the upstream
[`.env.example`](https://github.com/ulsklyc/yuvomi/blob/main/.env.example)
for the full list. Each entry takes a `name` (uppercase, e.g. `WEATHER_LAT`)
and a `value`.

Notes:

- `SESSION_SECRET` is generated automatically on first start and persisted;
  you don't need to set it.
- The host timezone is passed to the add-on automatically, so `TZ` normally
  doesn't need to be set.
- `PORT`, `DB_PATH` and `BACKUP_DIR` are managed by the add-on and should
  not be overridden.

## Reverse proxy / HTTPS

The web UI is served over plain HTTP on the mapped port. If you expose
Yuvomi through a reverse proxy with TLS (e.g. the Nginx Proxy Manager
add-on), add these to `env_vars`:

```yaml
env_vars:
  - name: SESSION_SECURE
    value: "true"
  - name: BASE_URL
    value: "https://yuvomi.example.com"
```

Home Assistant *Ingress* is not used: Yuvomi is a full PWA that expects to be
served from its own origin, which also keeps it installable as an app on
family members' phones without going through the Home Assistant UI.

## Updating

The add-on version tracks the upstream Yuvomi container image version.
Update from the add-on page as usual; the database and configuration are
preserved.

## Support

- Add-on issues (packaging, options, startup):
  [marcomow/yuvomi-ha](https://github.com/marcomow/yuvomi-ha/issues)
- Yuvomi application issues:
  [ulsklyc/yuvomi](https://github.com/ulsklyc/yuvomi/issues)
