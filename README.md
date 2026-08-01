# Yuvomi Home Assistant Add-on Repository

Run [Yuvomi](https://github.com/ulsklyc/yuvomi) — the privacy-focused,
self-hosted family planner — directly on your Home Assistant box.

Yuvomi bundles 17 household modules into one PWA: tasks (Kanban), shopping
lists, meals & recipes, calendar with Google/CalDAV/iCloud sync, budget &
split expenses, health & medication tracking, documents, notes & contacts,
birthdays, rewards, reminders and more.

## Installation

Yuvomi is a server application, so it ships as a Home Assistant **add-on**
(a Supervisor-managed container), not as a HACS package — HACS only
distributes integrations, dashboards and themes and cannot run server apps.
Installing an add-on repository is just as easy, and no HACS is required:

[![Open your Home Assistant instance and show the add add-on repository dialog with a specific repository URL pre-filled.](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fmarcomow%2Fyuvomi-ha)

Or manually:

1. Go to **Settings → Add-ons → Add-on Store**.
2. Open the **⋮** menu (top right) → **Repositories**.
3. Add `https://github.com/marcomow/yuvomi-ha` and close the dialog.
4. Find **Yuvomi** in the store (refresh if needed) and click **Install**.
5. Start the add-on, then click **Open Web UI** and follow Yuvomi's setup
   wizard.

> Note: add-ons require a Supervisor-based installation (Home Assistant OS
> or Supervised). On Container/Core installations, run Yuvomi with its
> [official Docker deployment](https://github.com/ulsklyc/yuvomi) instead.

## Add-ons

### [Yuvomi](./yuvomi)

Self-hosted family planner — tasks, shopping, meals, calendar, budget,
health & more. Supports `amd64` and `aarch64`.

See the [add-on documentation](./yuvomi/DOCS.md) for configuration details
(database encryption, automated backups, reverse proxy setup, extra
environment variables).

## License

MIT — see [LICENSE](./LICENSE). Yuvomi itself is developed by
[ulsklyc](https://github.com/ulsklyc/yuvomi) and is also MIT licensed.
