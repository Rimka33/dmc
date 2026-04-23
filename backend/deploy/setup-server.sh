#!/bin/bash
# =============================================================================
# DMC - Installation initiale du serveur OVH (AlmaLinux / Rocky / RHEL 9)
# =============================================================================
# Usage: sudo bash setup-server.sh
# À exécuter UNE SEULE FOIS lors de la première configuration du serveur
# =============================================================================

set -e

echo "=============================================="
echo "  DMC - Configuration initiale serveur OVH (AlmaLinux)"
echo "=============================================="

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PHP_VERSION="8.2"
DOMAIN="57.129.122.107"
APP_DIR="/var/www/dmc"
DB_NAME="dmc_db"
DB_USER="dmc_user"
DB_PASS="SecurePass123!"

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# =============================================================================
log_info "1. Mise à jour du système..."
# =============================================================================
dnf update -y
dnf install -y epel-release dnf-utils wget zip unzip nano tar
dnf install -y supervisor

# =============================================================================
log_info "2. Installation de Nginx..."
# =============================================================================
dnf install -y nginx
systemctl enable --now nginx

# =============================================================================
log_info "3. Installation de PHP 8.2 (Remi Repository)..."
# =============================================================================
dnf install -y https://rpms.remirepo.net/enterprise/remi-release-9.rpm || log_warn "Le repo Remi est peut-être déjà installé."
dnf module reset -y php
dnf module enable -y php:remi-8.2
dnf install -y php-fpm php-cli php-mysqlnd php-zip php-gd php-mbstring php-curl php-xml php-bcmath php-intl php-opcache php-process php-fileinfo

log_info "Configuration de PHP FPM..."
PHP_INI="/etc/php.ini"
sed -i 's/upload_max_filesize = .*/upload_max_filesize = 50M/' $PHP_INI
sed -i 's/post_max_size = .*/post_max_size = 50M/' $PHP_INI
sed -i 's/memory_limit = .*/memory_limit = 256M/' $PHP_INI
sed -i 's/max_execution_time = .*/max_execution_time = 300/' $PHP_INI
sed -i 's/expose_php = On/expose_php = Off/' $PHP_INI

# Changer l'utilisateur de php-fpm d'Apache vers Nginx ou un utilisateur dédié (par défaut 'apache' sur AlmaLinux)
sed -i 's/user = apache/user = nginx/' /etc/php-fpm.d/www.conf
sed -i 's/group = apache/group = nginx/' /etc/php-fpm.d/www.conf
# Ajuster les permissions du socket
sed -i 's/;listen.owner = nobody/listen.owner = nginx/' /etc/php-fpm.d/www.conf
sed -i 's/;listen.group = nobody/listen.group = nginx/' /etc/php-fpm.d/www.conf

systemctl enable --now php-fpm

# =============================================================================
log_info "4. Installation de MariaDB (MySQL)..."
# =============================================================================
dnf install -y mariadb-server mariadb
systemctl enable --now mariadb

log_info "Configuration de la base de données..."
mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

log_warn "⚠️ Exécutez ensuite: mysql_secure_installation"

# =============================================================================
log_info "5. Installation de Composer..."
# =============================================================================
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer

# =============================================================================
log_info "6. Installation de Node.js 20 LTS..."
# =============================================================================
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs

# =============================================================================
log_info "7. Création du dossier et permissions..."
# =============================================================================
mkdir -p $APP_DIR
chown -R nginx:nginx $APP_DIR # Nginx tourne sous l'utilisateur 'nginx' sur AlmaLinux

# =============================================================================
log_info "8. Configuration de Nginx pour DMC..."
# =============================================================================
# On copie la conf Nginx (on doit ajuster le chemin du socket PHP-FPM pour AlmaLinux qui utilise souvent 127.0.0.1:9000 ou /run/php-fpm/www.sock)
cp $(dirname "$0")/nginx/dmc.conf /etc/nginx/conf.d/dmc.conf
sed -i "s/__VOTRE_DOMAINE__/${DOMAIN}/g" /etc/nginx/conf.d/dmc.conf
sed -i "s/unix:\/var\/run\/php\/php8.2-fpm.sock/unix:\/run\/php-fpm\/www.sock/g" /etc/nginx/conf.d/dmc.conf

nginx -t && systemctl reload nginx

# =============================================================================
log_info "9. Installation de Certbot..."
# =============================================================================
dnf install -y certbot python3-certbot-nginx

# =============================================================================
log_info "10. Configuration du Firewall (Firewalld)..."
# =============================================================================
dnf install -y firewalld
systemctl enable --now firewalld
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# =============================================================================
log_info "11. Supervisor et Cron..."
# =============================================================================
cat > /etc/supervisord.d/dmc-worker.ini << 'EOF'
[program:dmc-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/dmc/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=nginx
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/dmc/storage/logs/worker.log
stopwaitsecs=3600
EOF

systemctl enable --now supervisord
supervisorctl reread
supervisorctl update

(crontab -l -u nginx 2>/dev/null; echo "* * * * * cd /var/www/dmc && php artisan schedule:run >> /dev/null 2>&1") | crontab -u nginx -

# Appliquer le contexte SELinux (si actif)
if command -v setenforce &> /dev/null; then
    log_info "Configuration de SELinux..."
    setsebool -P httpd_can_network_connect 1 || true
    setsebool -P httpd_can_network_connect_db 1 || true
    setsebool -P httpd_unified 1 || true
    # Accord des permissions SELinux sur les fichiers web
    if [ -d "$APP_DIR" ]; then
        chcon -Rt httpd_sys_content_t $APP_DIR || true
        chcon -Rt httpd_sys_rw_content_t $APP_DIR/storage || true
        chcon -Rt httpd_sys_rw_content_t $APP_DIR/bootstrap/cache || true
    fi
fi

echo "=============================================="
echo -e "  ${GREEN}✅ Configuration serveur terminée !${NC}"
echo "=============================================="
