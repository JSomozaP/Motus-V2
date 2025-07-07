# 🎮 MOTUS V2

Un jeu de mots moderne inspiré de Motus avec système d'authentification complet, scoring dynamique et leaderboard en temps réel.

![MOTUS V2](https://img.shields.io/badge/MOTUS-V2.0.0-blue?style=for-the-badge)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github)
![Angular](https://img.shields.io/badge/Angular-18-red?style=for-the-badge&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange?style=for-the-badge&logo=mysql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![JWT](https://img.shields.io/badge/JWT-Auth-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Last Commit](https://img.shields.io/github/last-commit/jeremy-somoza/motus-v2?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/jeremy-somoza/motus-v2?style=for-the-badge)

> 🚀 **Démarrage rapide:** [Installation en 5 minutes](#-installation-rapide) | [Compte démo](#-compte-de-démonstration) | [Demo live](https://motus-v2.netlify.app)

## 📑 Table des Matières

- [🖼️ Aperçu du Jeu](#️-aperçu-du-jeu)
- [🎮 Compte de Démonstration](#-compte-de-démonstration)
- [🌟 Fonctionnalités](#-fonctionnalités)
- [🛠️ Stack Technique](#️-stack-technique)
- [🚀 Installation Rapide](#-installation-rapide)
- [🎮 Guide Utilisateur](#-guide-utilisateur)
- [📋 API Documentation](#-api-documentation)
- [📁 Structure du Projet](#-structure-du-projet)
- [📦 Fichiers Importants](#-fichiers-importants-du-projet)
- [🚀 Déploiement Production](#-déploiement-production)
- [🔐 Sécurité](#-sécurité--bonnes-pratiques)
- [🐛 Dépannage](#-dépannage)
- [🎯 Roadmap](#-roadmap-développement)
- [🏆 Crédits](#-crédits--remerciements)

---

## 🖼️ Aperçu du Jeu

### 🔐 Authentification Sécurisée
![Page de connexion](./screenshots/motus%20login.png)
*Interface de connexion moderne avec design responsive*

![Email de vérification](./screenshots/motus%20mail%20confirmation%20creation%20compte.png)
*Email de confirmation d'inscription avec template personnalisé*

![Reset mot de passe](./screenshots/motus%20mail%20reset%20mot%20de%20passe.png)
*Service de réinitialisation de mot de passe par email*

![Page de reset](./screenshots/motus%20page%20de%20reset%20password.png)
*Interface de création d'un nouveau mot de passe*

### 🎮 Interface de Jeu
![Interface principale](./screenshots/motus%20main%20page.png)
*Dashboard principal avec Hall of Fame et sélection de difficulté*

![Version responsive](./screenshots/motus%20main%20page%20responsive.png)
*Interface adaptée pour appareils mobiles et tablettes*

![Choix difficulté](./screenshots/motus%20choix%20difficulté.png)
*Sélection des 4 niveaux de difficulté disponibles*

### 🎯 Gameplay Dynamique
![Grille de jeu](./screenshots/motus%20exemple%20de%20grille%20lettres%20pendant%20partie.png)
*Plateau de jeu avec système de couleurs intuitif : vert (correct), orange (mal placé), gris (absent)*

![Mot trouvé](./screenshots/motus%20exemple%20grille%20lettres%20mot%20trouve.png)
*Animation de victoire avec affichage du score calculé en temps réel*

### 🏆 Fonctionnalités Avancées
![Leaderboard](./screenshots/motus%20modal%20leaderboard.png)
*Hall of Fame complet avec classement des joueurs et historique*

![Changement pseudo](./screenshots/motus%20modal%20changement%20pseudo.png)
*Système de modification de pseudo en cours de partie*

![Déconnexion](./screenshots/motus%20modal%20deconection.png)
*Modal de confirmation pour la déconnexion sécurisée*

---

## 🎮 Compte de Démonstration

Pour tester l'application immédiatement :

**🔐 Identifiants de test :**
- 📧 **Email :** `demo@motus-v2.com`
- 🔑 **Mot de passe :** `Demo123!`
- 👤 **Pseudo :** `DemoPlayer`

**📊 Données incluses :**
- ✅ Compte pré-vérifié (accès immédiat)
- 🏆 29 scores sur tous les niveaux de difficulté
- 👥 Leaderboard enrichi avec 9 joueurs fictifs
- 📈 Historique réaliste sur plusieurs jours

---

## 🌟 Fonctionnalités

### 🔐 Authentification Complète ✅
- ✅ **Inscription sécurisée** avec validation email obligatoire
- ✅ **Vérification par email** avec templates HTML personnalisés
- ✅ **Connexion JWT** avec tokens sécurisés (24h)
- ✅ **Réinitialisation mot de passe** par email
- ✅ **Protection des routes** avec guards Angular
- ✅ **Gestion des pseudos** personnalisés et uniques

### 🎯 Jeu Motus Avancé
- 🟢 **Facile** : Mots de 3-5 lettres (6 tentatives)
- 🟡 **Moyen** : Mots de 5-7 lettres (6 tentatives)  
- 🔴 **Difficile** : Mots de 6-9 lettres (6 tentatives)
- 🟣 **Cauchemar** : Mots de 8-12 lettres (6 tentatives)
- 🎮 **Interface moderne** avec clavier virtuel et animations

### 🏆 Système de Score
- ⏱️ **Score temps réel** basé sur la rapidité
- 🎯 **Bonus tentatives** : points supplémentaires
- 📊 **Leaderboard scrollable** : top 100 scores avec toutes les infos (rang, joueur, score, difficulté, date)
- 👤 **Pseudos utilisateur** : affichage du vrai pseudo connecté
- 💾 **Sauvegarde par session** : score total enregistré à la fin de chaque partie (pas par mot individuel)

### 📧 Service Email Intégré
- 📨 **Vérification inscription** : email personnalisé avec pseudo
- 🔄 **Reset mot de passe** : lien sécurisé temporaire
- 🎨 **Templates responsive** : design moderne
- ⚡ **Envoi instantané** via Gmail SMTP

## 🛠️ Stack Technique

### 🎨 Frontend
```
Angular 18 + TypeScript
├── RxJS pour la gestion d'état réactive
├── Angular Router + Guards d'authentification
├── Services modulaires (Auth, Game, Modal)
├── SCSS avec variables et mixins
├── Composants standalone optimisés
└── Responsive Design mobile-first
```

### ⚙️ Backend
```
Node.js + Express
├── MySQL avec mysql2/promise (async/await)
├── JWT + bcrypt pour la sécurité
├── Nodemailer + Gmail SMTP
├── CORS configuré pour production
├── Middleware d'authentification 
└── Gestion d'erreurs centralisée
```

### 🗄️ Base de Données
```
MySQL/MariaDB
├── Table users (auth + pseudos + verification)
├── Table games (parties en cours)
├── Table wall_of_fame (historique scores)
├── Table mots (dictionnaire local)
└── Tokens temporaires (reset + verification)
```

## 🚀 Installation Rapide

### Prérequis
- **Node.js** 18+ et npm
- **MySQL** ou MariaDB
- **Compte Gmail** pour SMTP
- **Git**

### 1️⃣ Cloner et configurer
```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd Motus-V2

# Backend
cd server
npm install
cp .env.example .env
# ⚠️ IMPORTANT : Éditer .env avec vos vrais paramètres

# Frontend  
cd ../client
npm install
```

### 2️⃣ Base de données
```sql
-- Connexion MySQL
mysql -u root -p

-- Créer la base
CREATE DATABASE motus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE motus;

-- Créer les tables principales
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pseudo VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expiry DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE wall_of_fame (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  score INT NOT NULL,
  login VARCHAR(50) NOT NULL,
  difficulty ENUM('facile', 'moyen', 'difficile', 'cauchemar') DEFAULT 'facile',
  words_found INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3️⃣ Configuration Email Gmail
```bash
# 1. Activer l'authentification à 2 facteurs sur Gmail
# 2. Générer un "Mot de passe d'application" 
# 3. Utiliser ce mot de passe dans .env (pas votre mot de passe Gmail normal)
```

### 4️⃣ Variables d'environnement
```env
# server/.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=motus

# JWT
JWT_SECRET=votre_super_secret_jwt_key_production_minimum_32_caracteres

# Gmail SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application_gmail

# URLs (développement)
CLIENT_URL=http://localhost:4200
SERVER_URL=http://localhost:3000
```

### 5️⃣ Démarrer l'application
```bash
# Terminal 1 - Backend
cd server
npm start
# 🚀 API sur http://localhost:3000

# Terminal 2 - Frontend  
cd client
npm start
# 🎮 App sur http://localhost:4200
```

### 6️⃣ Données de démonstration (optionnel)
```bash
# Pour enrichir le leaderboard avec des données de test
cd server
mysql -u root -p motus < ../demo-account.sql

# Cela ajoute :
# - Le compte demo@motus-v2.com (mot de passe: Demo123!)
# - 29 scores répartis sur tous les niveaux de difficulté
# - 9 joueurs fictifs pour un leaderboard réaliste
```

### 7️⃣ Test complet
```bash
# Vérifier que tout fonctionne :
# 1. Aller sur http://localhost:4200
# 2. Créer un compte avec un vrai email
# 3. Vérifier l'email reçu et cliquer sur le lien
# 4. Se connecter et jouer !

# OU utiliser le compte de démo directement
# Email: demo@motus-v2.com | Mot de passe: Demo123!
```

## 🎮 Guide Utilisateur

### 🏁 Première utilisation
1. **📝 Inscription** : Pseudo unique + email valide + mot de passe
2. **📧 Vérification** : Cliquer sur le lien reçu par email
3. **🔐 Connexion** : Utiliser vos identifiants
4. **🎯 Jouer** : Choisir difficulté et deviner les mots !

### 🎯 Règles du jeu
1. **Indice initial** : La première lettre est toujours révélée
2. **6 tentatives maximum** pour tous les niveaux
3. **Couleurs des lettres** :
   - 🟩 **Vert** : Lettre correcte à la bonne position
   - 🟨 **Orange** : Lettre présente mais mal placée
   - ⬜ **Gris** : Lettre absente du mot
4. **Clavier virtuel** : Les lettres testées changent de couleur

### 📊 Système de score
```javascript
Score Final = Score Base (100) 
            + Bonus Temps (0-50 points selon rapidité)
            + Bonus Tentatives (10 points par tentative restante)

Exemple : Mot trouvé en 2 tentatives en 30 secondes
= 100 + 35 (temps) + 40 (4 tentatives restantes) = 175 points
```

## 📋 API Documentation

### 🔐 Authentification
```http
POST /api/auth/register
Body: { pseudo, email, password }
Response: { message, userId }

POST /api/auth/login  
Body: { email, password }
Response: { token, user: { id, email, pseudo } }

GET /api/auth/verify/:token
Response: { message: "Email vérifié avec succès" }

POST /api/auth/forgot-password
Body: { email }
Response: { message: "Email de réinitialisation envoyé" }

POST /api/auth/reset-password
Body: { token, newPassword }
Response: { message: "Mot de passe réinitialisé" }
```

### 🎮 Jeu
```http
GET /api/mot-aleatoire?difficulte=facile
Response: { mot: "PIANO" }

POST /api/games/:id/complete
Body: { score, time, attempts, playerAlias }
Response: { success: true }
```

### 🏆 Leaderboard
```http
GET /api/leaderboard
Response: [
  {
    player_alias: "ProGamer",
    email: "progamer@email.com", 
    best_score: 450,
    date_achieved: "06/07/2025",
    difficulty: "cauchemar",
    games_played: 1,
    score: 450,
    best_streak: 1
  },
  // ... jusqu'à 100 scores maximum
]
```

## 📁 Structure du Projet

```
Motus-V2/
├── 📱 client/ (Frontend Angular)
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── login/          # Connexion + mot de passe oublié
│   │   │   │   ├── register/       # Inscription
│   │   │   │   └── reset-password/ # Reset mot de passe
│   │   │   ├── game/
│   │   │   │   ├── game-grid/      # Plateau + logique jeu
│   │   │   │   └── keyboard/       # Clavier virtuel
│   │   │   ├── verify/             # Vérification email
│   │   │   └── shared/
│   │   │       ├── leaderboard-modal/ # Classement scrollable (top 100)
│   │   │       ├── modal/          # Modales génériques
│   │   │       └── toast/          # Notifications
│   │   ├── services/
│   │   │   ├── auth.service.ts     # Gestion authentification
│   │   │   ├── game.service.ts     # Logique de jeu
│   │   │   ├── modal.service.ts    # Gestion modales
│   │   │   └── toast.service.ts    # Notifications
│   │   ├── guards/
│   │   │   └── auth.guard.ts       # Protection routes
│   │   └── app.routes.ts           # Configuration routing
│   └── assets/                     # Images, fonts, etc.
├── 🖥️ server/ (Backend Node.js)
│   ├── index.js                    # Point d'entrée + routes
│   ├── email-service.js            # Service envoi emails
│   ├── .env.example                # Template configuration
│   └── package.json                # Dépendances
├── 📊 sql/                         # Scripts base de données
│   ├── schema.sql                  # Structure tables principales
│   └── demo-account.sql           # Données de démonstration
├── 📸 screenshots/                 # Captures d'écran fonctionnalités
├── 🧹 scripts/                     # Scripts utilitaires
└── 📚 README.md                     # Cette documentation
```

## 🔧 Scripts Disponibles

### Backend
```bash
npm start          # Démarrer serveur (production)
npm run dev        # Mode développement avec nodemon
npm test           # Tests unitaires (à implémenter)
```

### Frontend
```bash
npm start          # Serveur de développement (port 4200)
ng build           # Build pour production
ng test            # Tests unitaires avec Karma
ng e2e             # Tests end-to-end avec Protractor
```

## 🚀 Déploiement Production

### 🌐 Frontend (Netlify/Vercel)
```bash
cd client
ng build --configuration production
# Déployer le contenu de dist/client/
```

### 🖥️ Backend (VPS/Railway/Heroku)
```bash
# Variables d'environnement de production
export NODE_ENV=production
export JWT_SECRET="secret_ultra_securise_minimum_32_caracteres"
export DB_HOST="votre_db_host_cloud"
export EMAIL_USER="email_production@domaine.com"

# Avec PM2 (recommandé)
npm install -g pm2
pm2 start index.js --name motus-v2-api
pm2 startup && pm2 save
```

### 🗄️ Base de Données Cloud
- **PlanetScale** : MySQL serverless
- **AWS RDS** : MySQL managé  
- **Railway** : PostgreSQL/MySQL
- **Supabase** : PostgreSQL avec dashboard

## 🔐 Sécurité & Bonnes Pratiques

### ✅ Mesures Implémentées
- 🔒 **JWT sécurisé** : Expiration 24h, secret fort
- 🛡️ **Hachage bcrypt** : Salt rounds 10
- 🚪 **CORS strict** : Frontend autorisé uniquement
- ✉️ **Vérification email** : Obligatoire avant accès
- 🔄 **Tokens temporaires** : Reset mot de passe (1h)
- 🚫 **Logs sécurisés** : Aucun token/mot de passe loggé

### ⚠️ Points d'attention Production
- 🌐 **HTTPS obligatoire** : Certificat SSL/TLS
- 🔑 **Variables d'environnement** : Jamais en dur dans le code
- 🔒 **Base de données** : Connexions chiffrées
- 📊 **Monitoring** : Logs d'erreurs centralisés
- 🚦 **Rate limiting** : Prévention force brute

## 📦 Fichiers Importants du Projet

### 🔧 Fichiers de Configuration
```
Motus-V2/
├── 📋 README.md                    # Documentation complète du projet
├── 🚫 .gitignore                   # Fichiers à ignorer par Git (secrets, node_modules, etc.)
├── 📝 CHANGELOG.md                 # Historique des versions et modifications
├── 📄 LICENSE                      # Licence MIT du projet
├── 🤝 CONTRIBUTING.md              # Guide pour les contributeurs
├── 🔐 SECURITY.md                  # Politiques de sécurité et vulnérabilités
├── 🛡️ pre-push-check.sh           # Script de vérification avant push GitHub
├── ⚙️ server/.env.example         # Template variables d'environnement
├── 🏗️ sql/schema.sql               # Structure base de données MySQL
├── 🎭 demo-account.sql             # Données de démonstration (29 scores + 9 joueurs)
└── 📸 screenshots/                 # Captures d'écran de toutes les fonctionnalités
```

### ⚠️ Fichiers Sensibles (exclus de Git)
```
server/.env                        # Variables d'environnement réelles
server/node_modules/               # Dépendances Node.js
client/node_modules/               # Dépendances Angular
client/dist/                       # Build de production
*.log                              # Fichiers de log
.DS_Store                          # Fichiers système macOS
Thumbs.db                          # Fichiers système Windows
```

### 🌐 Compatibilité Navigateurs
```
✅ Chrome 90+         (Recommandé)
✅ Firefox 88+        (Testé)
✅ Safari 14+         (Testé)
✅ Edge 90+           (Testé)
📱 Mobile Safari      (iOS 14+)
📱 Chrome Mobile      (Android 8+)
❌ Internet Explorer  (Non supporté)
```

---

## 🚀 Déploiement Production

### 🌐 Frontend (Netlify/Vercel)
```bash
cd client
ng build --configuration production
# Déployer le contenu de dist/client/
```

### 🖥️ Backend (VPS/Railway/Heroku)
```bash
# Variables d'environnement de production
export NODE_ENV=production
export JWT_SECRET="secret_ultra_securise_minimum_32_caracteres"
export DB_HOST="votre_db_host_cloud"
export EMAIL_USER="email_production@domaine.com"

# Avec PM2 (recommandé)
npm install -g pm2
pm2 start index.js --name motus-v2-api
pm2 startup && pm2 save
```

### 🗄️ Base de Données Cloud
- **PlanetScale** : MySQL serverless
- **AWS RDS** : MySQL managé  
- **Railway** : PostgreSQL/MySQL
- **Supabase** : PostgreSQL avec dashboard

## 🔐 Sécurité & Bonnes Pratiques

### ✅ Mesures Implémentées
- 🔒 **JWT sécurisé** : Expiration 24h, secret fort
- 🛡️ **Hachage bcrypt** : Salt rounds 10
- 🚪 **CORS strict** : Frontend autorisé uniquement
- ✉️ **Vérification email** : Obligatoire avant accès
- 🔄 **Tokens temporaires** : Reset mot de passe (1h)
- 🚫 **Logs sécurisés** : Aucun token/mot de passe loggé

### ⚠️ Points d'attention Production
- 🌐 **HTTPS obligatoire** : Certificat SSL/TLS
- 🔑 **Variables d'environnement** : Jamais en dur dans le code
- 🔒 **Base de données** : Connexions chiffrées
- 📊 **Monitoring** : Logs d'erreurs centralisés
- 🚦 **Rate limiting** : Prévention force brute

## 🧪 Tests & Qualité

### ✅ Check-list avant production
- [ ] Scripts de sécurité passés (`./pre-push-check.sh`)
- [ ] Variables d'environnement configurées (DB, JWT, Email)
- [ ] Base de données créée avec schema.sql
- [ ] Compte Gmail configuré avec mot de passe d'application
- [ ] Tests locaux réussis (inscription + email + jeu)
- [ ] Screenshots à jour dans README

### ✅ Déploiement
- [ ] Build frontend réussi (`ng build --prod`)
- [ ] Serveur backend testé en production
- [ ] HTTPS configuré (certificat SSL)
- [ ] Variables d'environnement sécurisées
- [ ] Monitoring logs en place

## 🐛 Dépannage

### 🔧 Problèmes Courants

#### "Erreur connexion base de données"
```bash
# Vérifier MySQL
sudo systemctl status mysql
mysql -u root -p -e "SHOW DATABASES;"

# Vérifier les permissions
mysql -u root -p
GRANT ALL PRIVILEGES ON motus.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

#### "Email non reçu"
```bash
# 1. Vérifier la config Gmail
# 2. Utiliser un "Mot de passe d'application" (pas le mot de passe Gmail)
# 3. Vérifier les spams
# 4. Tester avec un autre email
```

#### "Token JWT invalide"
```bash
# Vider le cache navigateur
localStorage.clear()
sessionStorage.clear()

# Vérifier la longueur du JWT_SECRET (min 32 caractères)
```

#### "Route /game bloquée"
```bash
# Le guard d'authentification peut bloquer
# Vérifier que isAuthenticated() retourne true
# Voir les logs F12 pour détails
```

### 📞 Support & Contribution
- 📧 **Email** : jeremy.somoza@laplateforme.io
- 🐛 **Issues** : [Signaler un bug](https://github.com/jeremy-somoza/motus-v2/issues)
- 💡 **Suggestions** : [Pull Requests](https://github.com/jeremy-somoza/motus-v2/pulls) bienvenues
- 📚 **Documentation** : Ce README + commentaires dans le code
- 🌟 **Star le projet** : Si vous aimez Motus V2, n'hésitez pas à mettre une étoile !

## 🎯 FAQ - Questions Fréquentes

### ❓ Puis-je modifier les mots du jeu ?
Oui ! Les mots sont stockés dans `client/src/assets/mots.json`. Vous pouvez ajouter/modifier les mots par difficulté.

### ❓ Comment changer les couleurs du thème ?
Modifiez les variables CSS dans `client/src/styles.scss` (variables `--primary-color`, `--accent-color`, etc.).

### ❓ Le jeu fonctionne-t-il hors ligne ?
Actuellement non, car il nécessite l'authentification et la sauvegarde des scores. Une version PWA hors ligne est prévue en v2.1.

### ❓ Puis-je héberger le jeu sur mon serveur ?
Absolument ! Suivez la section [🚀 Déploiement Production](#-déploiement-production) pour l'installation sur votre serveur.

### ❓ Comment ajouter de nouveaux niveaux de difficulté ?
1. Ajoutez les mots dans `mots.json` avec une nouvelle clé
2. Modifiez le composant `game-grid` pour gérer le nouveau niveau
3. Adaptez l'API backend dans `index.js` (route `/api/mot-aleatoire`)

## 🎯 Roadmap Développement

### ✅ Version 2.0 (Actuelle - Juillet 2025)
- ✅ Authentification complète JWT
- ✅ Vérification email obligatoire
- ✅ Système de pseudos personnalisés
- ✅ 4 niveaux de difficulté
- ✅ Leaderboard scrollable top 100 scores
- ✅ Interface responsive moderne
- ✅ Service email intégré
- ✅ Score par session (pas par mot individuel)
- ✅ Compte de démonstration pré-configuré
- ✅ 29 scores de test répartis sur tous les niveaux

### 🚧 Version 2.1 (Q4 2025)
- [ ] 🎨 **Thèmes visuels** : Mode sombre, couleurs personnalisées
- [ ] 🎵 **Effets sonores** : Feedback audio pour les actions
- [ ] 📱 **PWA** : Installation sur mobile/desktop
- [ ] 📊 **Statistiques** : Graphiques de progression utilisateur
- [ ] 🏆 **Achievements** : Badges et récompenses

### 🔮 Version 2.2 (Q1 2026)
- [ ] 🤝 **Mode multijoueur** : Parties en temps réel
- [ ] 🌍 **Multilingue** : Support français/anglais/espagnol
- [ ] 🔗 **Partage social** : Résultats sur réseaux sociaux
- [ ] 🎪 **Événements** : Tournois et défis spéciaux
- [ ] 🤖 **API publique** : Intégration tiers

## 📊 Métriques Actuelles

### Code Quality ✅
- ✅ **0 erreurs** de compilation TypeScript
- ✅ **Structure modulaire** : Services séparés et réutilisables
- ✅ **Sécurité** : Authentification robuste testée
- ✅ **Performance** : Optimisations Angular et requêtes SQL

### Fonctionnalités Testées ✅
- ✅ **Inscription complète** : Pseudo → Email → Vérification → Connexion
- ✅ **Jeu 4 niveaux** : Génération mots + scoring + sauvegarde par session
- ✅ **Emails automatiques** : Templates HTML + SMTP Gmail
- ✅ **Responsive design** : Mobile/tablet/desktop
- ✅ **Leaderboard** : 100 scores scrollables avec toutes les infos
- ✅ **Compte démo** : Accès immédiat pour tests
- ✅ **Scoring optimisé** : Score total de session au lieu de mots individuels

### Performance 🚀
- ⚡ **Build time** : ~15 secondes
- 🚀 **Cold start** : ~3 secondes  
- 📦 **Bundle size** : Optimisé Angular
- 🔄 **Hot reload** : <1 seconde

---

## 🏆 Crédits & Remerciements

### 👨‍💻 Équipe
- **Jeremy Somoza** - Développeur Full Stack
- **La Plateforme** - Formation et mentorat technique

### 🛠️ Technologies & Services
- **Angular Team** - Framework frontend
- **Node.js Foundation** - Runtime JavaScript  
- **Oracle MySQL** - Base de données
- **Gmail SMTP** - Service email
- **trouve-mot.fr** - API dictionnaire français

### 📄 Licence
```
MIT License - Copyright (c) 2025 Jeremy Somoza

Permission accordée, gratuitement, à toute personne obtenant une copie
de ce logiciel et des fichiers de documentation associés, de traiter
le logiciel sans restriction, y compris sans limitation les droits
d'utilisation, de copie, de modification, de fusion, de publication,
de distribution, de sous-licence et/ou de vente de copies du logiciel.
```

## 📈 Statistiques du Projet

![GitHub repo size](https://img.shields.io/github/repo-size/jeremy-somoza/motus-v2)
![GitHub code size](https://img.shields.io/github/languages/code-size/jeremy-somoza/motus-v2)
![GitHub issues](https://img.shields.io/github/issues/jeremy-somoza/motus-v2)
![GitHub closed issues](https://img.shields.io/github/issues-closed/jeremy-somoza/motus-v2)
![GitHub pull requests](https://img.shields.io/github/issues-pr/jeremy-somoza/motus-v2)

### 🔢 Détails Techniques
- **📊 Lignes de code** : ~3,500 (TypeScript + JavaScript + SCSS + HTML)
- **🎨 Composants Angular** : 12 composants modulaires
- **🔧 Services** : 6 services réutilisables
- **📱 Responsive breakpoints** : 4 tailles d'écran optimisées
- **🗄️ Tables MySQL** : 4 tables principales + indexes
- **📧 Templates email** : 2 templates HTML responsive
- **🎮 Mots disponibles** : 1000+ mots français par difficulté
- **🏆 Scores maximum** : Top 100 sauvegardés par session

---

**🎮 Amusez-vous bien avec MOTUS V2 !**

*Développé avec ❤️ et ☕ par Jeremy Somoza - La Plateforme 2025*

**🔥 Version finale v2.0.0 - Prêt pour production ! 🔥**

---

<div align="center">

[![⭐ Star ce projet](https://img.shields.io/badge/⭐-Star_ce_projet-yellow?style=for-the-badge)](https://github.com/jeremy-somoza/motus-v2)
[![🍴 Fork](https://img.shields.io/badge/🍴-Fork-blue?style=for-the-badge)](https://github.com/jeremy-somoza/motus-v2/fork)
[![📝 Issues](https://img.shields.io/badge/📝-Issues-red?style=for-the-badge)](https://github.com/jeremy-somoza/motus-v2/issues)

**[🚀 Demo Live](https://motus-v2.netlify.app)** | **[📚 Documentation](https://github.com/jeremy-somoza/motus-v2#readme)** | **[🐛 Report Bug](https://github.com/jeremy-somoza/motus-v2/issues)**

</div>