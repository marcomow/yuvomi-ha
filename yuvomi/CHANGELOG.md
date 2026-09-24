# Changelog

## 2.69.1

- Bump Yuvomi to [v2.69.1](https://github.com/ulsklyc/yuvomi/releases/tag/v2.69.1)
  (`ghcr.io/ulsklyc/yuvomi:2.69.1`, amd64 and aarch64)
- Upstream database migrations run automatically on first start and are
  one-way: take a backup before updating, and restore that backup if you ever
  need to roll the add-on back to 0.71.10
- Replace the obsolete `watchdog` option with a Docker `HEALTHCHECK` on
  `/health` and drop the redundant `boot: auto` (add-on linter)

## 0.71.10

- Initial release of the Yuvomi Home Assistant add-on
- Wraps the official `ghcr.io/ulsklyc/yuvomi:0.71.10` image (amd64, aarch64)
- Persistent database in add-on data, backups and documents on `/share/yuvomi`
- Auto-generated persistent `SESSION_SECRET`
- Add-on options for log level, database encryption, automated backups,
  local document storage and free-form environment variable passthrough
- Health watchdog on `/health`
