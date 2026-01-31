FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    sed

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/ .

# Fix line endings for Windows users and make executable
RUN sed -i 's/\r$//' start.sh && chmod +x start.sh

# Install composer dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Expose port and start server using the script
CMD ["./start.sh"]
