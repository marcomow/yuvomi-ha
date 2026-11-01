#!/usr/bin/env node
// Build-time patch for upstream Yuvomi's MCP `call_api_operation` tool.
//
// Upstream declares path_params / query / payload as bare `{ type: 'object' }`
// with no properties. Several LLM providers (Gemini-style schema conversion,
// strict function calling) turn such schemas into empty objects, so agents send
// `path_params: {}` and every *_by_id call fails with "Missing path parameter".
//
// This patch:
//  - adds a top-level `id` shorthand that fills the {id} path parameter;
//  - declares path_params.id explicitly and marks every free-form object with
//    additionalProperties: true;
//  - accepts path_params and query as JSON strings too (payload already does).
//
// It fails the build loudly if the upstream code no longer matches, so a
// Yuvomi bump never silently drops the fix.

const fs = require('fs');

const file = process.argv[2] || '/app/server/mcp/tools.js';
let src = fs.readFileSync(file, 'utf8');

function replaceOnce(from, to, label) {
  const count = src.split(from).length - 1;
  if (count !== 1) {
    console.error(`[patch-mcp-args] ${label}: expected 1 match, found ${count} in ${file}`);
    process.exit(1);
  }
  src = src.replace(from, to);
}

replaceOnce(
  "        path_params: { type: 'object', description: 'Values for path template parameters.' },\n" +
  "        query: { type: 'object', description: 'Query string parameters.' },\n" +
  "        payload: { type: 'object', description: 'JSON request body.' },",
  "        id: { type: 'integer', description: 'Shorthand for path_params.id (e.g. the task id for get_tasks_by_id / put_tasks_by_id).' },\n" +
  "        path_params: { type: 'object', description: 'Values for path template parameters, e.g. {\"id\": 42}. A JSON string is also accepted.', properties: { id: { type: 'integer', description: 'Resource id for {id} paths.' } }, additionalProperties: true },\n" +
  "        query: { type: 'object', description: 'Query string parameters. A JSON string is also accepted.', additionalProperties: true },\n" +
  "        payload: { type: 'object', description: 'JSON request body, e.g. {\"title\": \"New title\"}. A JSON string is also accepted.', additionalProperties: true },",
  'schema'
);

replaceOnce(
  "      const path = renderPath(operation.path, args.path_params || {});",
  "      const pathParams = { ...looseObject(args.path_params, 'path_params') };\n" +
  "      if ((pathParams.id === undefined || pathParams.id === null) && args.id !== undefined && args.id !== null) pathParams.id = args.id;\n" +
  "      args = { ...args, query: looseObject(args.query, 'query') };\n" +
  "      const path = renderPath(operation.path, pathParams);",
  'handler'
);

replaceOnce(
  'function renderPath(path, pathParams = {}) {',
  "function looseObject(value, name) {\n" +
  "  if (value === undefined || value === null || value === '') return undefined;\n" +
  "  if (typeof value !== 'string') return value;\n" +
  "  try {\n" +
  "    const parsed = JSON.parse(value);\n" +
  "    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;\n" +
  "  } catch { /* fall through */ }\n" +
  "  throw new ToolError(`${name} must be a JSON object (or a string containing one).`);\n" +
  "}\n\n" +
  'function renderPath(path, pathParams = {}) {',
  'helper'
);

fs.writeFileSync(file, src);
console.log(`[patch-mcp-args] patched ${file}`);
