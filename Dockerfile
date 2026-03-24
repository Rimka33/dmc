# Utilise l'image officielle PHP avec Apache
FROM php:8.2-apache

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    nodejs \
    npm \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libpq-dev

# Configurer les extensions PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql pdo_pgsql mbstring exif pcntl bcmath xml zip

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurer Apache (DocumentRoot vers /public)
COPY .docker/apache.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

# Copier le code de l'application
WORKDIR /var/www/html
COPY . .

# Installer les dépendances PHP et JS
RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build

# Donner les permissions aux dossiers Laravel
RUN chown -R www-data:www-data storage bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# Exposer le port par défaut attendu par Render (80 ou défini via PORT env)
EXPOSE 80

# Script de démarrage
CMD ["apache2-foreground"]
