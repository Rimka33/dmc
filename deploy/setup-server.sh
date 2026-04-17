#!/bin/bash
# =============================================================================
# DMC - Installation initiale du serveur OVH (Ubuntu 22.04 / 24.04)
# =============================================================================
# Usage: sudo bash setup-server.sh
# À exécuter UNE SEULE FOIS lors de la première configuration du serveur
# =============================================================================

set -e

echo "=============================================="
echo "  DMC - Configuration initiale serveur OVH"
echo "=============================================="

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PHP_VERSION="8.2"
DOMAIN="__VOTRE_DOMAINE__"
APP_DIR="/var/www/dmc"
DB_NAME="dmc_db"
DB_USER="dmc_user"
DB_PASS="__MOT_DE_PASSE_DB__"

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# =============================================================================
# ÉTAPE 1 : Mise à jour du système
# =============================================================================
log_info "Mise à jour du système..."
apt update && apt upgrade -y

# =============================================================================
# ÉTAPE 2 : Installation de Nginx
# =============================================================================
log_info "Installation de Nginx..."
apt install -y nginx
systemctl enable nginx
systemctl start nginx

# =============================================================================
# ÉTAPE 3 : Installation de PHP 8.2 + Extensions
# =============================================================================
log_info "Installation de PHP ${PHP_VERSION}..."
apt install -y software-properties-common
add-apt-repository -y ppa:ondrej/php
apt update

apt install -y \
    php${PHP_VERSION}-fpm \
    php${PHP_VERSION}-cli \
    php${PHP_VERSION}-common \
    php${PHP_VERSION}-mysql \
    php${PHP_VERSION}-pgsql \
    php${PHP_VERSION}-zip \
    php${PHP_VERSION}-gd \
    php${PHP_VERSION}-mbstring \
    php${PHP_VERSION}-curl \
    php${PHP_VERSION}-xml \
    php${PHP_VERSION}-bcmath \
    php${PHP_VERSION}-intl \
    php${PHP_VERSION}-readline \
    php${PHP_VERSION}-opcache \
    php${PHP_VERSION}-tokenizer \
    php${PHP_VERSION}-fileinfo

# Configurer PHP pour la production
log_info "Configuration de PHP pour la production..."
PHP_INI="/etc/php/${PHP_VERSION}/fpm/php.ini"

sed -i 's/upload_max_filesize = .*/upload_max_filesize = 50M/' $PHP_INI
sed -i 's/post_max_size = .*/post_max_size = 50M/' $PHP_INI
sed -i 's/memory_limit = .*/memory_limit = 256M/' $PHP_INI
sed -i 's/max_execution_time = .*/max_execution_time = 300/' $PHP_INI
sed -i 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/' $PHP_INI
sed -i 's/expose_php = On/expose_php = Off/' $PHP_INI

# OPcache pour performance
sed -i 's/;opcache.enable=1/opcache.enable=1/' $PHP_INI
sed -i 's/;opcache.memory_consumption=128/opcache.memory_consumption=256/' $PHP_INI
sed -i 's/;opcache.max_accelerated_files=10000/opcache.max_accelerated_files=20000/' $PHP_INI
sed -i 's/;opcache.validate_timestamps=1/opcache.validate_timestamps=0/' $PHP_INI

systemctl restart php${PHP_VERSION}-fpm

# =============================================================================
# ÉTAPE 4 : Installation de MySQL
# =============================================================================
log_info "Installation de MySQL..."
apt install -y mysql-server

# Sécurisation de base
log_info "Configuration de MySQL..."
mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

log_warn "⚠️  N'oubliez pas d'exécuter: sudo mysql_secure_installation"

# =============================================================================
# ÉTAPE 5 : Installation de Composer
# =============================================================================
log_info "Installation de Composer..."
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer

# =============================================================================
# ÉTAPE 6 : Installation de Node.js 20 LTS
# =============================================================================
log_info "Installation de Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# =============================================================================
# ÉTAPE 7 : Installation de Git
# =============================================================================
log_info "Installation de Git..."
apt install -y git

# =============================================================================
# ÉTAPE 8 : Création du dossier de l'application
# =============================================================================
log_info "Création du dossier de l'application..."
mkdir -p $APP_DIR
chown -R www-data:www-data $APP_DIR

# =============================================================================
# ÉTAPE 9 : Configuration de Nginx
# =============================================================================
log_info "Configuration de Nginx pour DMC..."
cp $(dirname "$0")/nginx/dmc.conf /etc/nginx/sites-available/dmc.conf

# Remplacer le domaine dans la configuration
sed -i "s/__VOTRE_DOMAINE__/${DOMAIN}/g" /etc/nginx/sites-available/dmc.conf

# Activer le site
ln -sf /etc/nginx/sites-available/dmc.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx

# =============================================================================
# ÉTAPE 10 : Installation de Certbot (SSL Let's Encrypt)
# =============================================================================
log_info "Installation de Certbot pour SSL..."
apt install -y certbot python3-certbot-nginx

log_warn "⚠️  Pour obtenir le certificat SSL, exécutez :"
log_warn "   sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"

# =============================================================================
# ÉTAPE 11 : Configuration du Firewall
# =============================================================================
log_info "Configuration du firewall UFW..."
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable

# =============================================================================
# ÉTAPE 12 : Configuration de la swap (si VPS avec peu de RAM)
# =============================================================================
if [ ! -f /swapfile ]; then
    log_info "Création d'un fichier swap de 2Go..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# =============================================================================
# ÉTAPE 13 : Configuration du worker de queue Laravel (Supervisor)
# =============================================================================
log_info "Installation de Supervisor pour les queues Laravel..."
apt install -y supervisor

cat > /etc/supervisor/conf.d/dmc-worker.conf << 'EOF'
[program:dmc-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/dmc/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/dmc/storage/logs/worker.log
stopwaitsecs=3600
EOF

supervisorctl reread
supervisorctl update

# =============================================================================
# ÉTAPE 14 : Cron pour le scheduler Laravel
# =============================================================================
log_info "Configuration du Cron Laravel..."
(crontab -l -u www-data 2>/dev/null; echo "* * * * * cd /var/www/dmc && php artisan schedule:run >> /dev/null 2>&1") | crontab -u www-data -

# =============================================================================
# RÉSUMÉ
# =============================================================================
echo ""
echo "=============================================="
echo -e "  ${GREEN}✅ Serveur configuré avec succès !${NC}"
echo "=============================================="
echo ""
echo "  📋 Prochaines étapes :"
echo "  ────────────────────────────────────────────"
echo "  1. Modifiez les variables en haut de ce script"
echo "     (DOMAIN, DB_PASS) si ce n'est pas déjà fait"
echo ""
echo "  2. Sécurisez MySQL :"
echo "     sudo mysql_secure_installation"
echo ""
echo "  3. Clonez et déployez l'application :"
echo "     cd /var/www && git clone https://github.com/Rimka33/dmc.git dmc"
echo "     cd dmc && bash deploy/deploy.sh"
echo ""
echo "  4. Configurez SSL :"
echo "     sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo ""
echo "  5. Vérifiez que le .env est correctement rempli"
echo ""
echo "  📊 Services installés :"
echo "     • Nginx        ✅"
echo "     • PHP ${PHP_VERSION}-FPM  ✅"
echo "     • MySQL        ✅"
echo "     • Composer     ✅"
echo "     • Node.js      ✅"
echo "     • Supervisor   ✅"
echo "     • UFW Firewall ✅"
echo "     • Certbot      ✅"
echo "=============================================="
