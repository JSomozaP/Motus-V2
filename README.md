# 🎮 MOTUS V2

Un jeu de mots moderne inspiré de Motus avec système d'authentification complet, scoring dynamique et leaderboard en temps réel.

![MOTUS V2](https://img.shields.io/badge/MOTUS-V2-blue?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-18-red?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange?style=for-the-badge)

## 🌟 Fonctionnalités

### 🔐 Authentification Complète
- ✅ Inscription avec vérification email
- ✅ Connexion sécurisée (JWT)
- ✅ Réinitialisation mot de passe
- ✅ Protection des routes

### 🎯 Jeu Motus Avancé
- 🟢 **Facile** : Mots de 3-4 lettres
- 🟡 **Moyen** : Mots de 5-7 lettres  
- 🔴 **Difficile** : Mots de 6-9 lettres
- 🟣 **Cauchemar** : Mots de 8-12 lettres

### 🏆 Système de Score
- ⏱️ Score basé sur le temps
- 🎯 Bonus selon les tentatives
- 📊 Leaderboard en temps réel
- 👤 Pseudos personnalisés

### 📧 Notifications Email
- 📨 Vérification d'inscription
- 🔄 Réinitialisation mot de passe
- 🎨 Templates HTML personnalisés

## 🛠️ Stack Technique

### 🎨 Frontend
```
Angular 18 + TypeScript
├── RxJS pour la gestion d'état
├── Angular Router + Guards
├── SCSS pour le styling
└── Responsive Design
```

### ⚙️ Backend
```
Node.js + Express
├── MySQL avec mysql2/promise
├── JWT pour l'authentification
├── bcrypt pour le hachage
├── Nodemailer pour les emails
└── CORS + Middleware sécurisés
```

### 🗄️ Base de Données
```
MySQL/MariaDB
├── Table users (authentification)
├── Table games (parties en cours)
├── Table wall_of_fame (scores)
└── Gestion des tokens de reset
```

## 🚀 Installation Rapide

### Prérequis
- **Node.js** 18+ et npm
- **MySQL** ou MariaDB
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
# Éditer .env avec vos paramètres

# Frontend  
cd ../client
npm install
```

### 2️⃣ Base de données
```sql
-- Créer la base
CREATE DATABASE motus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Importer le schéma
-- mysql -u root -p motus < server/database/schema.sql
```

### 3️⃣ Variables d'environnement
```env
# server/.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_super_secret_jwt_key_production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_application
```

### 4️⃣ Démarrer l'application
```bash
# Terminal 1 - Backend
cd server && npm start
# 🚀 Serveur sur http://localhost:3000

# Terminal 2 - Frontend  
cd client && npm start
# 🎮 Application sur http://localhost:4200
```

## 🎮 Guide de Jeu

### 🏁 Démarrage
1. **Inscription** : Créez un compte avec email valide
2. **Vérification** : Cliquez sur le lien reçu par email
3. **Connexion** : Accédez au jeu avec vos identifiants

### 🎯 Gameplay
1. **Choisir difficulté** : Sélectionnez votre niveau
2. **Indice initial** : La première lettre est révélée
3. **Proposer des mots** : Tapez vos propositions
4. **Interpréter les couleurs** :
   - 🟩 **Vert** : Lettre correcte, bonne position
   - 🟨 **Orange** : Lettre correcte, mauvaise position  
   - ⬜ **Gris** : Lettre absente du mot

### 📊 Scoring
```
Score = Base (100) + Bonus Temps + Bonus Tentatives
├── Bonus Temps : max 50 points (plus rapide = plus de points)
├── Bonus Tentatives : 10 points par tentative restante
└── Score final affiché dans le leaderboard
```

## 📋 API Documentation

### 🔐 Authentification
```http
POST /api/auth/register
POST /api/auth/login  
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/verify/:token
```

### 🎮 Jeu
```http
GET  /api/game/word/:difficulty    # Nouveau mot
POST /api/game/guess              # Vérifier proposition  
POST /api/games/:id/complete      # Terminer partie
```

### 🏆 Leaderboard
```http
GET /api/leaderboard              # Top scores
```

## 📁 Structure du Projet

```
Motus-V2/
├── 📱 client/                    # Frontend Angular
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── login/           # Connexion
│   │   │   ├── game-grid/       # Plateau de jeu
│   │   │   ├── keyboard/        # Clavier virtuel
│   │   │   └── leaderboard/     # Classement
│   │   ├── services/
│   │   │   ├── auth.service.ts  # Authentification
│   │   │   └── game.service.ts  # Logique jeu
│   │   └── guards/
│   │       └── auth.guard.ts    # Protection routes
│   └── assets/                  # Ressources statiques
├── 🖥️ server/                    # Backend Node.js
│   ├── index.js                 # Point d'entrée principal
│   ├── email-service.js         # Service envoi emails
│   ├── .env.example             # Template configuration
│   └── package.json             # Dépendances backend
└── 📚 README.md                  # Documentation
```

## 🔧 Scripts Disponibles

### Backend
```bash
npm start          # Démarrer serveur production
npm run dev        # Mode développement avec nodemon
npm test           # Tests unitaires
```

### Frontend
```bash
npm start          # Serveur développement
npm run build      # Build production
npm run test       # Tests unitaires
npm run e2e        # Tests end-to-end
```

## 🚀 Déploiement Production

### 🌐 Frontend (Netlify/Vercel)
```bash
cd client
ng build --configuration production
# Déployer le dossier dist/
```

### 🖥️ Backend (VPS/Cloud)
```bash
# Variables d'environnement sécurisées
export JWT_SECRET="votre_super_secret_production"
export DB_PASSWORD="mot_de_passe_securise"

# PM2 pour la gestion de processus
npm install -g pm2
pm2 start index.js --name motus-v2
pm2 startup
pm2 save
```

### 🗄️ Base de Données
- **Développement** : MySQL local
- **Production** : MySQL Cloud (PlanetScale, AWS RDS...)
- **Sauvegarde** : Automatisée quotidienne

## 🔐 Sécurité

### ✅ Mesures Implémentées
- 🔒 **JWT** avec expiration (24h)
- 🛡️ **bcrypt** pour les mots de passe
- 🚪 **CORS** configuré pour le frontend
- ✉️ **Vérification email** obligatoire
- 🔄 **Rate limiting** sur les endpoints sensibles

### 🚨 Recommandations Production
- 🌐 **HTTPS** obligatoire
- 🔑 **Variables d'environnement** sécurisées
- 📊 **Monitoring** des erreurs
- 🚦 **Load balancing** si nécessaire

## 👥 Équipe & Crédits

### 👨‍💻 Développement
- **Jeremy Somoza** - Développeur Principal
- **La Plateforme** - Formation et support

### 🛠️ Technologies Utilisées
- **API Mots** : [trouve-mot.fr](https://trouve-mot.fr)
- **Email Service** : Gmail SMTP
- **Hosting** : Local/Cloud déployable

## 📄 Licence

```
MIT License - Copyright (c) 2025 Jeremy Somoza

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

## 🆘 Dépannage

### 🔧 Problèmes Courants

#### Connexion Base de Données
```bash
# Vérifier MySQL
sudo systemctl status mysql
mysql -u root -p

# Vérifier les permissions
GRANT ALL PRIVILEGES ON motus.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

#### Emails Non Reçus
```bash
# Vérifier la configuration SMTP
# Activer "Mots de passe d'application" sur Gmail
# Vérifier les spams
```

#### Erreurs CORS
```bash
# S'assurer que le serveur backend tourne sur 3000
# Frontend sur 4200
# Vérifier la configuration CORS dans index.js
```

### 📞 Support
- 📧 **Email** : jeremy.somoza@laplateforme.io
- 🐛 **Issues** : [GitHub Issues]
- 📚 **Docs** : Ce README

---

## 🎯 Roadmap

### Version 2.1 (Prochaine)
- [ ] 🎨 Thèmes visuels multiples
- [ ] 🎵 Effets sonores
- [ ] 📱 PWA (Progressive Web App)
- [ ] 🤝 Mode multijoueur

### Version 2.2 (Future)
- [ ] 🏆 Tournois et événements
- [ ] 📊 Statistiques avancées
- [ ] 🌍 Support multilingue
- [ ] 🔗 Intégration réseaux sociaux

---

**🎮 Amusez-vous bien avec MOTUS V2 !**

*Développé avec ❤️ par Jeremy Somoza - 2025*