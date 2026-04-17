# 🚀 Guide de Déploiement DMC sur OVH

## 📁 Structure des fichiers de déploiement

```
deploy/
├── setup-server.sh      # Installation initiale du serveur (1 seule fois)
├── deploy.sh            # Déploiement complet
├── quick-update.sh      # Mise à jour rapide
└── nginx/
    └── dmc.conf         # Configuration Nginx production
```

---

## 📋 Pré-requis

- **Serveur OVH** : VPS ou Dédié sous Ubuntu 22.04 / 24.04
- **Accès SSH** : root ou utilisateur avec sudo
- **Nom de domaine** : pointé vers l'IP du serveur OVH

---

## 🔧 Étape 1 : Première Configuration du Serveur

### 1.1 Connexion SSH
```bash
ssh root@<IP_DU_SERVEUR>
# ou
ssh <utilisateur>@<IP_DU_SERVEUR>
```

### 1.2 Modifier les variables dans `setup-server.sh`
Avant d'exécuter le script, modifiez les variables en haut du fichier :
```bash
DOMAIN="votre-domaine.com"
DB_PASS="un_mot_de_passe_fort"
```

### 1.3 Exécuter l'installation
```bash
# Cloner le repo
cd /var/www
git clone https://github.com/Rimka33/dmc.git dmc
cd dmc

# Lancer l'installation du serveur
sudo bash deploy/setup-server.sh
```

Ce script installe automatiquement :
- ✅ Nginx
- ✅ PHP 8.2-FPM (avec OPcache)
- ✅ MySQL
- ✅ Composer
- ✅ Node.js 20 LTS
- ✅ Supervisor (pour les queues Laravel)
- ✅ Certbot (SSL Let's Encrypt)
- ✅ UFW Firewall
- ✅ Swap 2Go

---

## 🔑 Étape 2 : Configuration de l'Application

### 2.1 Configurer le fichier `.env`
```bash
cd /var/www/dmc
cp .env.production .env
nano .env
```

Remplir les champs marqués `__A_REMPLIR__` :
| Variable | Description |
|----------|-------------|
| `APP_KEY` | Sera généré automatiquement |
| `APP_URL` | `https://votre-domaine.com` |
| `FRONTEND_URL` | `https://votre-domaine.com` |
| `SESSION_DOMAIN` | `votre-domaine.com` |
| `DB_DATABASE` | `dmc_db` |
| `DB_USERNAME` | `dmc_user` |
| `DB_PASSWORD` | Le mot de passe choisi |
| `SANCTUM_STATEFUL_DOMAINS` | `votre-domaine.com` |
| `MAIL_*` | Vos paramètres SMTP |

### 2.2 Générer la clé d'application
```bash
php artisan key:generate
```

---

## 🚀 Étape 3 : Premier Déploiement

```bash
cd /var/www/dmc
bash deploy/deploy.sh
```

### 3.1 Exécuter les seeders (premier déploiement uniquement)
```bash
php artisan db:seed --force
```

### 3.2 Créer le lien symbolique storage
```bash
php artisan storage:link
```

---

## 🔒 Étape 4 : SSL (HTTPS)

```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

Le certificat se renouvellera automatiquement.

---

## 🔄 Mises à jour quotidiennes

Pour les mises à jour après un push sur GitHub :
```bash
cd /var/www/dmc
bash deploy/quick-update.sh
```

---

## 🔍 Commandes Utiles

### Monitoring
```bash
# Logs Laravel
tail -f /var/www/dmc/storage/logs/laravel.log

# Logs Nginx
tail -f /var/log/nginx/dmc_error.log

# Status des services
sudo systemctl status nginx
sudo systemctl status php8.2-fpm
sudo systemctl status mysql
sudo supervisorctl status
```

### Maintenance
```bash
# Activer le mode maintenance
php artisan down

# Désactiver le mode maintenance
php artisan up

# Vider tous les caches
php artisan optimize:clear

# Re-cacher tout
php artisan optimize
```

### Base de données
```bash
# Accéder à MySQL
mysql -u dmc_user -p dmc_db

# Backup de la base
mysqldump -u dmc_user -p dmc_db > backup_$(date +%Y%m%d).sql

# Restaurer un backup
mysql -u dmc_user -p dmc_db < backup_20260417.sql
```

---

## ⚠️ Points Importants

1. **Ne jamais modifier les fichiers directement sur le serveur** — toujours passer par Git
2. **Sauvegarder régulièrement** la base de données
3. **Le fichier `.env` n'est PAS versionné** — le sauvegarder séparément
4. **Certificat SSL** : se renouvelle automatiquement via Certbot
5. **Logs** : vérifier régulièrement `/var/www/dmc/storage/logs/` pour les erreurs
