#!/bin/bash
set -e

npx prisma migrate deploy

exec "$@"
