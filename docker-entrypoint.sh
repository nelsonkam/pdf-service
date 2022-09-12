#!/bin/bash
set -e

npx prisma generate --schema ./prisma/schema.prisma
npx prisma migrate deploy

exec "$@"
