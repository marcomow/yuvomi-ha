# Changelog

## 0.71.10

- Initial release of the Yuvomi Home Assistant add-on
- Wraps the official `ghcr.io/ulsklyc/yuvomi:0.71.10` image (amd64, aarch64)
- Persistent database in add-on data, backups and documents on `/share/yuvomi`
- Auto-generated persistent `SESSION_SECRET`
- Add-on options for log level, database encryption, automated backups,
  local document storage and free-form environment variable passthrough
- Health watchdog on `/health`
