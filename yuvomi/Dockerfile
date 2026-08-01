ARG BUILD_FROM=ghcr.io/ulsklyc/yuvomi:0.71.10
FROM ${BUILD_FROM}

COPY export-env.js /usr/local/lib/yuvomi-addon/export-env.js
COPY run.sh /run.sh
RUN chmod a+x /run.sh

# The upstream entrypoint fixes volume ownership and drops privileges to the
# node user. run.sh must execute as root first (to read add-on options and
# prepare /share directories), so it takes over as entrypoint and chains back
# into the upstream /entrypoint.sh.
ENTRYPOINT ["/run.sh"]
CMD []
