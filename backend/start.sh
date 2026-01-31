# Ensure we have a port
FINAL_PORT=${PORT:-8080}
echo "--- Starting Boot Sequence ---"
echo "Target Port: $FINAL_PORT"

if [ "$APP_RUN_MIGRATIONS" = "true" ]; then
    echo "Clearing cache..."
    php artisan config:clear || echo "Config clear failed"
    php artisan route:clear || echo "Route clear failed"
    
    echo "Running migrations..."
    php artisan migrate --seed --force || { echo "Migration failed!"; exit 1; }
fi

echo "Starting Laravel Server on port $FINAL_PORT..."
php artisan serve --host=0.0.0.0 --port=$FINAL_PORT
