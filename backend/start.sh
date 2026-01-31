#!/bin/sh
set -e

echo "--- Starting Boot Sequence ---"

if [ "$APP_RUN_MIGRATIONS" = "true" ]; then
    echo "Clearing cache..."
    php artisan config:clear || echo "Config clear failed (safe to ignore)"
    php artisan route:clear || echo "Route clear failed (safe to ignore)"
    
    echo "Running migrations..."
    php artisan migrate --seed --force || { echo "Migration failed!"; exit 1; }
fi

echo "Binding to PORT: $PORT"
echo "Starting Laravel Server..."
php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
