#!/bin/bash
# =============================================================================
# DMC - Mise à jour rapide (Quick Deploy)
# =============================================================================
# Usage: bash quick-update.sh
# Pour les mises à jour quotidiennes sans changements serveur
# =============================================================================

set -e

APP_DIR="/var/www/dmc"
BRANCH="main"

cd "$APP_DIR"

echo "🔄 Mise à jour rapide DMC..."

# Mode maintenance
php artisan down --retry=30 || true

# Pull du code
git fetch origin
git reset --hard origin/$BRANCH

# Dépendances PHP
composer install --no-dev --optimize-autoloader --no-interaction

# Build frontend
npm ci
npm run build

# Laravel cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Migrations
php artisan migrate --force

# Permissions
sudo chown -R www-data:www-data storage bootstrap/cache

# Restart queue
php artisan queue:restart

# Fin maintenance
php artisan up

echo "✅ Mise à jour terminée !"
