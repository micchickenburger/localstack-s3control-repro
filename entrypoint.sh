#!/bin/bash
set -e

# Ensure node_modules are found
if [ ! -d /app/node_modules ]; then
  npm ci
  mkdir -p dist
  cp cdktf.json dist/
fi

echo Ready.

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
