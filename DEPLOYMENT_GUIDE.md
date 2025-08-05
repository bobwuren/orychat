# 🚀 Guide de Déploiement Orientys - Production

## 📋 Vue d'ensemble Architecture

```
Internet
    │
    ├── orientys.com (App Client)
    ├── admin.orientys.com (Dashboard Admin)  
    └── api.orientys.com (API Backend)
            │
            └── MySQL Database (Interne VPS)
```

## 🖥️ Configuration VPS

### Prérequis Serveur
```bash
# Ubuntu 20.04/22.04 LTS recommandé
sudo apt update && sudo apt upgrade -y

# Installation Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installation MySQL
sudo apt install mysql-server -y

# Installation Nginx
sudo apt install nginx -y

# Installation PM2 (Process Manager)
sudo npm install -g pm2

# Installation Certbot (SSL)
sudo apt install certbot python3-certbot-nginx -y
```

## 🔧 Configuration Domaines DNS

### Enregistrements DNS à créer :
```
Type    Nom                     Valeur
A       orientys.com           IP_DE_VOTRE_VPS
A       api.orientys.com       IP_DE_VOTRE_VPS
A       admin.orientys.com     IP_DE_VOTRE_VPS
```

### Configuration CORS dans app.js
Il faut aussi mettre à jour la configuration CORS pour supporter les deux domaines Next.js :

```javascript
// CORS : autoriser tout en développement, restreindre en production
if (process.env.NODE_ENV === 'production') {
    app.use(cors({
        origin: [
            'https://orientys.com',
            'https://admin.orientys.com'
        ],
        credentials: true,
        optionsSuccessStatus: 200
    }));
} else {
    app.use(cors()); // tout autorisé en dev
}
```

```bash
# Créer la structure
sudo mkdir -p /var/www/orientys/{api,client,admin}
sudo chown -R $USER:$USER /var/www/orientys
```

## ⚙️ Déploiement API Backend

### 1. Cloner et installer
```bash
cd /var/www/orientys/api
git clone https://github.com/Darrylwin/orientys-api.git .
npm install --production
```

### 2. Configuration .env Production
```bash
# /var/www/orientys/api/.env
NODE_ENV=production
PORT=3000

# Base de données
DB_HOST=localhost
DB_USER=orientys_user
DB_PASSWORD=MOT_DE_PASSE_FORT_ICI
DB_NAME=orientys_db

# JWT
JWT_SECRET=VOTRE_SECRET_JWT_SUPER_FORT_64_CARACTERES_MINIMUM

# URLs des applications
CLIENT_URL=https://orientys.com
ADMIN_URL=https://admin.orientys.com
API_URL=https://api.orientys.com

# Email (pour création admin)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
EMAIL_FROM=noreply@orientys.com
```

### 3. Configuration MySQL
```bash
sudo mysql -u root -p

# Créer la base et l'utilisateur
CREATE DATABASE orientys_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'orientys_user'@'localhost' IDENTIFIED BY 'MOT_DE_PASSE_FORT_ICI';
GRANT ALL PRIVILEGES ON orientys_db.* TO 'orientys_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Importer la structure
cd /var/www/orientys/api
mysql -u orientys_user -p orientys_db < config/database/db.sql

# Seed initial
npm run seed
```

### 4. Démarrage avec PM2
```bash
cd /var/www/orientys/api

# Configuration PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'orientys-api',
    script: 'app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Créer dossier logs
mkdir -p logs

# Démarrer l'API
pm2 start ecosystem.config.js
pm2 save
pm2 startup # Suivre les instructions affichées
```

## 🌐 Configuration Nginx

### 1. Configuration API
```bash
sudo tee /etc/nginx/sites-available/orientys-api << 'EOF'
server {
    listen 80;
    server_name api.orientys.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.orientys.com;

    # SSL (sera configuré par Certbot)
    
    # Sécurité
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    limit_req zone=api burst=20 nodelay;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Activer le site
sudo ln -s /etc/nginx/sites-available/orientys-api /etc/nginx/sites-enabled/
```

### 2. Configuration App Client (Next.js)
```bash
sudo tee /etc/nginx/sites-available/orientys-client << 'EOF'
server {
    listen 80;
    server_name orientys.com www.orientys.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name orientys.com www.orientys.com;

    # Redirection www -> non-www
    if ($host = www.orientys.com) {
        return 301 https://orientys.com$request_uri;
    }

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache pour les assets Next.js
    location /_next/static/ {
        proxy_pass http://localhost:3001;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/orientys-client /etc/nginx/sites-enabled/
```

### 3. Configuration Admin Dashboard (Next.js)
```bash
sudo tee /etc/nginx/sites-available/orientys-admin << 'EOF'
server {
    listen 80;
    server_name admin.orientys.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.orientys.com;

    # Sécurité renforcée pour admin
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    
    # Rate limiting strict
    limit_req_zone $binary_remote_addr zone=admin:10m rate=10r/m;
    limit_req zone=admin burst=5 nodelay;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache pour les assets Next.js
    location /_next/static/ {
        proxy_pass http://localhost:3002;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/orientys-admin /etc/nginx/sites-enabled/
```

### 4. Tester et redémarrer Nginx
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 Configuration SSL avec Certbot

```bash
# Obtenir les certificats SSL
sudo certbot --nginx -d api.orientys.com
sudo certbot --nginx -d orientys.com -d www.orientys.com
sudo certbot --nginx -d admin.orientys.com

# Renouvellement automatique
sudo crontab -e
# Ajouter cette ligne :
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔥 Configuration Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 📊 Déploiement Apps Next.js

### App Client (Next.js)
```bash
cd /var/www/orientys/client

# Cloner votre repo client
git clone https://github.com/VOTRE_COMPTE/orientys-client.git .

# Configuration .env.production
cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://api.orientys.com
NODE_ENV=production
EOF

# Build et export statique
npm install
npm run build

# Si vous voulez du SSR (recommandé)
# Démarrer avec PM2
cat > ecosystem.client.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'orientys-client',
    script: './node_modules/next/dist/bin/next',
    args: 'start -p 3001',
    cwd: '/var/www/orientys/client',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

pm2 start ecosystem.client.config.js
```

### Admin Dashboard (Next.js)
```bash
cd /var/www/orientys/admin

# Cloner votre repo admin
git clone https://github.com/VOTRE_COMPTE/orientys-admin.git .

# Configuration .env.production
cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://api.orientys.com
NODE_ENV=production
EOF

# Build
npm install
npm run build

# Démarrer avec PM2
cat > ecosystem.admin.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'orientys-admin',
    script: './node_modules/next/dist/bin/next',
    args: 'start -p 3002',
    cwd: '/var/www/orientys/admin',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    }
  }]
};
EOF

pm2 start ecosystem.admin.config.js
```

## 🛠️ Commandes de Gestion

### API
```bash
# Status
pm2 status
pm2 logs orientys-api

# Redémarrer
pm2 restart orientys-api

# Déployer nouvelle version
cd /var/www/orientys/api
git pull
npm install --production
pm2 restart orientys-api
```

### Apps Next.js
```bash
# Status toutes les apps
pm2 status

# Logs spécifiques
pm2 logs orientys-client
pm2 logs orientys-admin

# Redéployer client Next.js
cd /var/www/orientys/client
git pull
npm install
npm run build
pm2 restart orientys-client

# Redéployer admin Next.js
cd /var/www/orientys/admin
git pull
npm install
npm run build
pm2 restart orientys-admin

# Redémarrer toutes les apps
pm2 restart all
```

## 📋 Checklist de Déploiement

- [ ] VPS configuré avec Node.js, MySQL, Nginx
- [ ] DNS pointés vers le VPS
- [ ] API déployée et fonctionnelle
- [ ] Base de données créée et seedée
- [ ] Nginx configuré pour les 3 domaines
- [ ] SSL activé avec Certbot
- [ ] Firewall configuré
- [ ] Apps frontend buildées et déployées
- [ ] PM2 configuré pour redémarrage auto
- [ ] Tests de connectivité réussis

## 🚨 Dépannage

### Logs à vérifier
```bash
# Logs API
pm2 logs orientys-api

# Logs Nginx
sudo tail -f /var/log/nginx/error.log

# Logs MySQL
sudo tail -f /var/log/mysql/error.log
```

### Commandes utiles
```bash
# Statut des services
sudo systemctl status nginx
sudo systemctl status mysql
pm2 status

# Redémarrer les services
sudo systemctl restart nginx
sudo systemctl restart mysql
pm2 restart all
```

## 📞 Support

En cas de problème, vérifier dans l'ordre :
1. Status des services (nginx, mysql, pm2)
2. Logs d'erreur
3. Configuration des domaines DNS
4. Certificats SSL
5. Variables d'environnement

---

**Note :** Remplacez `MOT_DE_PASSE_FORT_ICI` et `VOTRE_SECRET_JWT_SUPER_FORT_64_CARACTERES_MINIMUM` par des valeurs sécurisées !
