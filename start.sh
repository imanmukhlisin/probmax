#!/bin/sh
# Jangan gunakan set -e agar container tidak mati jika ada error db

# Ensure we have a port
FINAL_PORT=${PORT:-8080}
echo "--- Starting Boot Sequence ---"
echo "Target Port: $FINAL_PORT"

if [ "$APP_RUN_MIGRATIONS" = "true" ]; then
    echo "Clearing cache..."
    php artisan config:clear
    php artisan route:clear
    
    echo "Running migrations..."
    # Kita tetap jalankan tapi jangan sampai mematikan container seandainya gagal
    php artisan migrate --seed --force || echo "!!! Migration failed, but starting server anyway for debugging !!!"
fi

echo "Starting Laravel Server on port $FINAL_PORT..."
# Gunakan exec agar Laravel jadi proses utama (lebih stabil di Docker)
exec php artisan serve --host=0.0.0.0 --port=$FINAL_PORT
