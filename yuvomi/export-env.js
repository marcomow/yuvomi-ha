#!/usr/bin/env node
// Translates Home Assistant add-on options (/data/options.json) into
// shell `export` lines consumed by run.sh. Values are single-quoted with
// embedded quotes escaped, so arbitrary option values are shell-safe.
'use strict';

const fs = require('fs');

const OPTIONS_FILE = process.env.ADDON_OPTIONS_FILE || '/data/options.json';

let options;
try {
  options = JSON.parse(fs.readFileSync(OPTIONS_FILE, 'utf8'));
} catch (err) {
  process.stderr.write(`[yuvomi-addon] unable to read ${OPTIONS_FILE}: ${err.message}\n`);
  process.exit(1);
}

const quote = (value) => `'${String(value).replace(/'/g, `'\\''`)}'`;

const lines = [];
const setEnv = (name, value) => {
  if (value === undefined || value === null || value === '') return;
  lines.push(`export ${name}=${quote(value)}`);
};

setEnv('LOG_LEVEL', options.log_level);
setEnv('DB_ENCRYPTION_KEY', options.db_encryption_key);
setEnv('BACKUP_ENABLED', options.backup_enabled);
setEnv('BACKUP_SCHEDULE', options.backup_schedule);
setEnv('BACKUP_KEEP', options.backup_keep);
if (options.local_document_storage) {
  setEnv('DOCUMENT_STORAGE_LOCAL_ENABLED', 'true');
}

// Free-form passthrough for every other Yuvomi environment variable
// (weather, SMTP, OIDC, Google/CalDAV sync, web push, ...).
for (const entry of options.env_vars || []) {
  if (entry && typeof entry.name === 'string' && /^[A-Z][A-Z0-9_]*$/.test(entry.name)) {
    setEnv(entry.name, entry.value);
  }
}

process.stdout.write(lines.join('\n') + '\n');
