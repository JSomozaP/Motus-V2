# 🎮 MOTUS V2

Un jeu de mots moderne inspiré de Motus avec système d'authentification complet, scoring dynamique et leaderboard en temps réel.

![MOTUS V2](https://img.shields.io/badge/MOTUS-V2-blue?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-18-red?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange?style=for-the-badge)

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
- 📊 **Leaderboard live** : classement instantané
- 👤 **Pseudos utilisateur** : affichage du vrai pseudo connecté
- 💾 **Sauvegarde automatique** des scores

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

### 6️⃣ Test complet
```bash
# Vérifier que tout fonctionne :
# 1. Aller sur http://localhost:4200
# 2. Créer un compte avec un vrai email
# 3. Vérifier l'email reçu et cliquer sur le lien
# 4. Se connecter et jouer !
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
Response: [{ rank, playerAlias, totalScore, wordsFound, date }]
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
│   │   │       ├── leaderboard-modal/ # Classement
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
- 🐛 **Issues** : [GitHub Issues]
- 💡 **Suggestions** : Pull Requests bienvenues
- 📚 **Documentation** : Ce README + commentaires code

## 🎯 Roadmap Développement

### ✅ Version 2.0 (Actuelle - Décembre 2024)
- ✅ Authentification complète JWT
- ✅ Vérification email obligatoire
- ✅ Système de pseudos personnalisés
- ✅ 4 niveaux de difficulté
- ✅ Leaderboard temps réel
- ✅ Interface responsive moderne
- ✅ Service email intégré

### 🚧 Version 2.1 (Q1 2025)
- [ ] 🎨 **Thèmes visuels** : Mode sombre, couleurs personnalisées
- [ ] 🎵 **Effets sonores** : Feedback audio pour les actions
- [ ] 📱 **PWA** : Installation sur mobile/desktop
- [ ] 📊 **Statistiques** : Graphiques de progression utilisateur
- [ ] 🏆 **Achievements** : Badges et récompenses

### 🔮 Version 2.2 (Q2 2025)
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
- ✅ **Jeu 4 niveaux** : Génération mots + scoring + sauvegarde
- ✅ **Emails automatiques** : Templates HTML + SMTP Gmail
- ✅ **Responsive design** : Mobile/tablet/desktop

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

---

**🎮 Amusez-vous bien avec MOTUS V2 !**

*Développé avec ❤️ et ☕ par Jeremy Somoza - La Plateforme 2025*

**🔥 Version finale validée - Prêt pour production ! 🔥**