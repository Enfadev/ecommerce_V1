#!/bin/sh
# wait-for-db.sh - Wait for database to be ready before starting app

set -e

max_attempts=60
attempt=0

echo "⏳ Waiting for database to be ready..."

# Extract database connection details from DATABASE_URL
DB_HOST="${DATABASE_URL#*@}"
DB_HOST="${DB_HOST%%:*}"
DB_PORT="${DATABASE_URL#*:}"
DB_PORT="${DB_PORT%%/*}"
DB_NAME="${DATABASE_URL##*/}"
DB_NAME="${DB_NAME%%\?*}"

# Wait for MySQL to be ready
until nc -z db 3306 2>/dev/null; do
  attempt=$((attempt + 1))
  
  if [ $attempt -eq $max_attempts ]; then
    echo "❌ Database not ready after $max_attempts attempts. Exiting..."
    exit 1
  fi
  
  echo "⏳ Database not ready yet (attempt $attempt/$max_attempts). Waiting..."
  sleep 2
done

echo "✅ Database is ready! Starting application..."
exec "$@"
