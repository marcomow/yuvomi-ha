ARG BUILD_FROM=ghcr.io/ulsklyc/yuvomi:2.71.0
FROM ${BUILD_FROM}

COPY export-env.js /usr/local/lib/yuvomi-addon/export-env.js
COPY run.sh /run.sh
RUN chmod a+x /run.sh

# The Supervisor watchdog follows the container health status.
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# The upstream entrypoint fixes volume ownership and drops privileges to the
# node user. run.sh must execute as root first (to read add-on options and
# prepare /share directories), so it takes over as entrypoint and chains back
# into the upstream /entrypoint.sh.
ENTRYPOINT ["/run.sh"]
CMD []
