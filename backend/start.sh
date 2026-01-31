#!/bin/sh

if [ "$APP_RUN_MIGRATIONS" = "true" ]; then
    echo "Running migrations..."
    php artisan migrate --seed --force
fi

echo "Starting server..."
php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
