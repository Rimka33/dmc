#!/bin/bash
# =============================================================================
# DMC - Mise à jour rapide (Quick Deploy)
# =============================================================================
# Usage: bash quick-update.sh
# Pour les mises à jour quotidiennes sans changements serveur
# =============================================================================

set -e

REPO_DIR="/var/www/dmc"
APP_DIR="/var/www/dmc/backend"
BRANCH="main"

# Ajouter l'exception Git pour le dossier du dépôt
git config --global --add safe.directory "$REPO_DIR" || true

cd "$REPO_DIR"
echo "🔄 Mise à jour rapide DMC (Git Pull)..."
git fetch origin
git reset --hard origin/$BRANCH

cd "$APP_DIR"
echo "🔄 Configuration et compilation Laravel..."

# Mode maintenance
php artisan down --retry=30 || true

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

# Permissions (Adapté pour AlmaLinux avec nginx)
sudo chown -R almalinux:nginx storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Restart queue
php artisan queue:restart

# Fin maintenance
php artisan up

echo "✅ Mise à jour terminée !"
