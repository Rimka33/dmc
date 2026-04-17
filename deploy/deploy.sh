#!/bin/bash
# =============================================================================
# DMC - Script de déploiement pour serveur OVH (Ubuntu/Debian)
# =============================================================================
# Usage: bash deploy.sh
# À exécuter depuis le dossier du projet sur le serveur
# =============================================================================

set -e

echo "=============================================="
echo "  DMC - Déploiement Production OVH"
echo "=============================================="

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Variables
APP_DIR="/var/www/dmc"
REPO_URL="https://github.com/Rimka33/dmc.git"
BRANCH="main"
PHP_VERSION="8.2"

# =============================================================================
# FONCTIONS
# =============================================================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# =============================================================================
# ÉTAPE 1 : Vérification des prérequis
# =============================================================================
check_prerequisites() {
    log_info "Vérification des prérequis..."

    if ! command -v php &> /dev/null; then
        log_error "PHP n'est pas installé. Exécutez d'abord setup-server.sh"
        exit 1
    fi

    if ! command -v composer &> /dev/null; then
        log_error "Composer n'est pas installé. Exécutez d'abord setup-server.sh"
        exit 1
    fi

    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé. Exécutez d'abord setup-server.sh"
        exit 1
    fi

    if ! command -v nginx &> /dev/null; then
        log_error "Nginx n'est pas installé. Exécutez d'abord setup-server.sh"
        exit 1
    fi

    log_info "Tous les prérequis sont satisfaits !"
}

# =============================================================================
# ÉTAPE 2 : Mise en maintenance
# =============================================================================
maintenance_on() {
    if [ -f "$APP_DIR/artisan" ]; then
        log_info "Activation du mode maintenance..."
        cd "$APP_DIR"
        php artisan down --render="errors::503" --retry=60 || true
    fi
}

# =============================================================================
# ÉTAPE 3 : Pull du code
# =============================================================================
pull_code() {
    if [ -d "$APP_DIR/.git" ]; then
        log_info "Mise à jour du code depuis GitHub..."
        cd "$APP_DIR"
        git fetch origin
        git reset --hard origin/$BRANCH
    else
        log_info "Clonage initial du repository..."
        git clone -b $BRANCH $REPO_URL $APP_DIR
        cd "$APP_DIR"
    fi
}

# =============================================================================
# ÉTAPE 4 : Installation des dépendances
# =============================================================================
install_dependencies() {
    cd "$APP_DIR"

    log_info "Installation des dépendances PHP (production)..."
    composer install --no-dev --optimize-autoloader --no-interaction

    log_info "Installation des dépendances Node.js..."
    npm ci

    log_info "Build des assets Vite..."
    npm run build
}

# =============================================================================
# ÉTAPE 5 : Configuration Laravel
# =============================================================================
configure_laravel() {
    cd "$APP_DIR"

    # Vérifier que .env existe
    if [ ! -f ".env" ]; then
        log_warn "Fichier .env manquant ! Copie du template..."
        cp .env.production .env
        log_warn "⚠️  IMPORTANT: Modifiez le fichier .env avec vos paramètres réels !"
        log_warn "   Puis relancez ce script."
        exit 1
    fi

    # Générer la clé si absente
    if grep -q "APP_KEY=$" .env || grep -q "__A_REMPLIR__" .env; then
        log_warn "La clé APP_KEY ou certains paramètres ne sont pas configurés."
        log_warn "Vérifiez que le .env est correctement rempli."

        if grep -q "APP_KEY=$" .env; then
            log_info "Génération de la clé d'application..."
            php artisan key:generate --force
        fi
    fi

    log_info "Cache de la configuration..."
    php artisan config:cache

    log_info "Cache des routes..."
    php artisan route:cache

    log_info "Cache des vues..."
    php artisan view:cache

    log_info "Optimisation de l'autoloader..."
    php artisan optimize
}

# =============================================================================
# ÉTAPE 6 : Migrations de la base de données
# =============================================================================
run_migrations() {
    cd "$APP_DIR"

    log_info "Exécution des migrations..."
    php artisan migrate --force

    log_info "Exécution des seeders (si premier déploiement)..."
    # Décommentez la ligne suivante pour le premier déploiement uniquement:
    # php artisan db:seed --force
}

# =============================================================================
# ÉTAPE 7 : Permissions
# =============================================================================
set_permissions() {
    cd "$APP_DIR"

    log_info "Configuration des permissions..."
    sudo chown -R www-data:www-data storage bootstrap/cache
    sudo chmod -R 775 storage bootstrap/cache

    # Créer le lien symbolique storage si absent
    if [ ! -L "public/storage" ]; then
        log_info "Création du lien symbolique storage..."
        php artisan storage:link
    fi
}

# =============================================================================
# ÉTAPE 8 : Restart des services
# =============================================================================
restart_services() {
    log_info "Redémarrage de PHP-FPM..."
    sudo systemctl restart php${PHP_VERSION}-fpm

    log_info "Redémarrage de Nginx..."
    sudo systemctl restart nginx

    log_info "Redémarrage du worker de queue..."
    cd "$APP_DIR"
    php artisan queue:restart
}

# =============================================================================
# ÉTAPE 9 : Désactivation du mode maintenance
# =============================================================================
maintenance_off() {
    cd "$APP_DIR"
    log_info "Désactivation du mode maintenance..."
    php artisan up
}

# =============================================================================
# EXÉCUTION
# =============================================================================

check_prerequisites
maintenance_on
pull_code
install_dependencies
configure_laravel
run_migrations
set_permissions
restart_services
maintenance_off

echo ""
echo "=============================================="
echo -e "  ${GREEN}✅ Déploiement terminé avec succès !${NC}"
echo "=============================================="
echo ""
echo "  Vérifiez votre site : https://$(grep APP_URL $APP_DIR/.env 2>/dev/null | cut -d'/' -f3 || echo '__VOTRE_DOMAINE__')"
echo ""
