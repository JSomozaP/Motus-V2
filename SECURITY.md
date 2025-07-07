# 🔐 Guide de Sécurité - MOTUS V2

Ce document décrit les mesures de sécurité implémentées et les bonnes pratiques à suivre.

## 🛡️ Mesures de Sécurité Implémentées

### 🔑 Authentification & Autorisation
- **JWT (JSON Web Tokens)** : Tokens sécurisés avec expiration 24h
- **bcrypt** : Hachage des mots de passe avec salt rounds 10
- **Guards Angular** : Protection des routes côté frontend
- **Middleware Express** : Validation tokens côté backend
- **Vérification email** : Obligatoire avant accès au jeu

### 🌐 Protection Réseau
- **CORS configuré** : Seul le frontend autorisé (localhost:4200)
- **Headers sécurisés** : Prévention XSS et injections
- **Validation inputs** : Sanitisation côté client et serveur
- **Rate limiting** : Protection contre force brute (à implémenter)

### 🗄️ Base de Données
- **Requêtes préparées** : Protection contre injections SQL
- **Connexions chiffrées** : Support SSL/TLS pour MySQL
- **Principe de moindre privilège** : Utilisateur DB avec droits limités
- **Backup automatique** : Sauvegarde régulière des données

### 📧 Service Email
- **SMTP sécurisé** : Connexion TLS avec Gmail
- **Tokens temporaires** : Vérification et reset avec expiration
- **Templates sécurisés** : Pas d'exécution de code dans emails
- **Validation emails** : Format et existence vérifiés

## ⚠️ Variables d'Environnement Sensibles

### 🔒 Toujours Protéger
```bash
# Secrets critiques
JWT_SECRET=                 # Clé signature tokens (64+ caractères)
DB_PASSWORD=               # Mot de passe base de données
EMAIL_PASS=                # Mot de passe application Gmail

# Informations sensibles
DB_HOST=                   # Adresse serveur base de données
EMAIL_USER=               # Adresse email service
```

### ✅ Configuration Sécurisée
```bash
# Générer un JWT secret fort
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Mot de passe application Gmail (pas le mot de passe normal)
# 1. Activer 2FA sur Gmail
# 2. Aller dans "Mots de passe d'application"
# 3. Générer pour "Autre (nom personnalisé)"
# 4. Utiliser le code 16 caractères généré
```

## 🚨 Checklist Sécurité Production

### ✅ Avant Déploiement
- [ ] **HTTPS obligatoire** : Certificat SSL/TLS valide
- [ ] **Variables d'environnement** : Aucun secret en dur dans le code
- [ ] **JWT secret unique** : Généré aléatoirement pour chaque environnement
- [ ] **Mots de passe forts** : Base de données et services
- [ ] **CORS strict** : Uniquement domaines autorisés
- [ ] **Headers sécurisés** : CSP, HSTS, X-Frame-Options

### ✅ Monitoring Sécurité
- [ ] **Logs d'authentification** : Tentatives de connexion
- [ ] **Monitoring d'erreurs** : Détection d'anomalies
- [ ] **Audit dépendances** : Vulnérabilités npm/packages
- [ ] **Backup chiffrés** : Sauvegarde données sensibles
- [ ] **Plan de réponse incident** : Procédures en cas de breach

## 🛠️ Outils de Sécurité Recommandés

### 📦 Audit Dépendances
```bash
# Vérifier vulnérabilités npm
npm audit
npm audit fix

# Outils avancés
npm install -g snyk
snyk test
```

### 🔍 Analyse Statique
```bash
# ESLint avec règles sécurité
npm install --save-dev eslint-plugin-security

# Helmet.js pour headers sécurisés
npm install helmet
```

### 🚦 Rate Limiting
```javascript
// Exemple implémentation express-rate-limit
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  message: 'Trop de tentatives de connexion',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', loginLimiter);
```

## 🔍 Tests de Sécurité

### 🧪 Tests à Effectuer
1. **Injection SQL** : Tenter des requêtes malveillantes
2. **XSS** : Scripts dans champs de saisie
3. **CSRF** : Requêtes cross-site forgées
4. **Force brute** : Multiples tentatives connexion
5. **Tokens expirés** : Validation expiration JWT

### 🛡️ Outils de Test
- **OWASP ZAP** : Scanner vulnérabilités web
- **Burp Suite** : Tests de pénétration
- **npm audit** : Vulnérabilités dépendances
- **Snyk** : Monitoring continu sécurité

## 📋 Incident Response

### 🚨 En Cas de Breach
1. **Isoler** : Couper accès compromis
2. **Évaluer** : Ampleur de la compromission
3. **Notifier** : Utilisateurs et autorités si nécessaire
4. **Corriger** : Patcher vulnérabilité
5. **Documenter** : Post-mortem et leçons apprises

### 🔄 Rotation Secrets
```bash
# Procédure rotation JWT secret
1. Générer nouveau secret
2. Déployer en rolling update
3. Invalider anciens tokens
4. Notifier utilisateurs de se reconnecter
```

## 📞 Contact Sécurité

Pour signaler une vulnérabilité :
- 📧 **Email** : security@motus-v2.com (si disponible)
- 🔒 **Responsable** : jeremy.somoza@laplateforme.io
- ⏱️ **Réponse** : 48h maximum
- 🏆 **Bug bounty** : Reconnaissance publique

---

**⚠️ Important** : La sécurité est un processus continu. Restez informé des dernières vulnérabilités et mettez à jour régulièrement les dépendances.
