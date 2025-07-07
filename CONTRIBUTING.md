# 🤝 Guide de Contribution - MOTUS V2

Merci de votre intérêt pour contribuer à MOTUS V2 ! Ce guide vous aidera à démarrer.

## 🚀 Comment Contribuer

### 🐛 Signaler un Bug
1. Vérifiez que le bug n'est pas déjà signalé dans les [Issues](../../issues)
2. Créez un nouveau ticket avec le template "Bug Report"
3. Incluez :
   - Description détaillée du problème
   - Étapes pour reproduire
   - Capture d'écran si applicable
   - Version du navigateur/OS

### 💡 Proposer une Fonctionnalité
1. Vérifiez la roadmap dans le README
2. Créez un ticket "Feature Request"
3. Décrivez :
   - Le besoin utilisateur
   - La solution proposée
   - Les alternatives considérées

### 🔧 Développement

#### Prérequis
- Node.js 18+
- MySQL/MariaDB
- Git
- Compte Gmail pour les tests email

#### Setup Local
```bash
# Fork et clone
git clone https://github.com/VOTRE_USERNAME/Motus-V2.git
cd Motus-V2

# Install dependencies
cd server && npm install
cd ../client && npm install

# Configuration
cp server/.env.example server/.env
# Éditer server/.env avec vos paramètres

# Base de données
mysql -u root -p < sql/schema.sql
mysql -u root -p motus < demo-account.sql

# Démarrer en mode dev
cd server && npm run dev      # Terminal 1
cd client && npm start        # Terminal 2
```

#### Standards de Code

**Frontend (Angular/TypeScript)**
```typescript
// ✅ Bon
export class GameService {
  private apiUrl = environment.apiUrl;
  
  getRandomWord(difficulty: string): Observable<{word: string}> {
    return this.http.get<{word: string}>(`${this.apiUrl}/mot-aleatoire`, {
      params: { difficulte: difficulty }
    });
  }
}

// ❌ Éviter
export class GameService {
  getWord(diff) {
    return this.http.get('http://localhost:3000/mot-aleatoire?difficulte=' + diff);
  }
}
```

**Backend (Node.js/Express)**
```javascript
// ✅ Bon
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    
    const user = await getUserByEmail(email);
    // ... logique métier
    
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ❌ Éviter
app.post('/login', (req, res) => {
  const user = getUser(req.body.email);
  res.json(user);
});
```

#### Workflow de Développement

1. **Créer une branche**
   ```bash
   git checkout -b feature/nom-de-la-fonctionnalite
   # ou
   git checkout -b bugfix/correction-du-bug
   ```

2. **Développer et tester**
   ```bash
   # Tester localement
   npm test                    # Tests unitaires
   npm run e2e                # Tests end-to-end
   ```

3. **Commit avec Conventional Commits**
   ```bash
   git commit -m "feat: ajout système de thèmes sombres"
   git commit -m "fix: correction sauvegarde scores"
   git commit -m "docs: mise à jour README installation"
   ```

4. **Push et Pull Request**
   ```bash
   git push origin feature/nom-de-la-fonctionnalite
   # Créer PR sur GitHub avec description détaillée
   ```

#### Types de Commits
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage code (sans impact fonctionnel)
- `refactor:` Refactoring sans ajout de fonctionnalité
- `test:` Ajout/modification tests
- `chore:` Maintenance (dépendances, build, etc.)

## 📋 Checklist Pull Request

### ✅ Avant de Soumettre
- [ ] Code testé localement
- [ ] Pas d'erreurs console
- [ ] Documentation mise à jour si nécessaire
- [ ] Screenshots ajoutés pour UI changes
- [ ] Commit messages suivent les conventions
- [ ] Branch à jour avec `main`

### ✅ Description PR
- [ ] Titre clair et descriptif
- [ ] Description du problème résolu
- [ ] Description de la solution
- [ ] Tests effectués
- [ ] Screenshots avant/après si applicable

## 🎯 Domaines de Contribution

### 🚀 Priorité Haute
- **Performance** : Optimisation requêtes SQL, lazy loading
- **Accessibilité** : ARIA, navigation clavier, contrastes
- **Tests** : Coverage des composants critiques
- **Documentation** : Guides utilisateur, API docs

### 🌟 Améliorations Bienvenues
- **UI/UX** : Animations, micro-interactions
- **Fonctionnalités** : Mode sombre, PWA, offline mode
- **Multilingue** : Internationalisation i18n
- **Mobile** : Optimisations tactiles

### 🔧 Infrastructure
- **CI/CD** : GitHub Actions, tests automatisés
- **Docker** : Containerisation application
- **Monitoring** : Logs, métriques, alertes
- **Sécurité** : Audit dépendances, rate limiting

## 🏆 Reconnaissance

Les contributeurs seront ajoutés dans :
- 📄 Section "Contributors" du README
- 🎉 Release notes des versions
- 💬 Remerciements sur les réseaux sociaux

## 📞 Support

- 📧 **Email** : jeremy.somoza@laplateforme.io
- 💬 **Discussions** : GitHub Discussions
- 🐛 **Issues** : GitHub Issues
- 📚 **Documentation** : README.md

## 🔄 Cycle de Release

- **Patch** (2.0.x) : Corrections bugs urgents
- **Minor** (2.x.0) : Nouvelles fonctionnalités compatibles
- **Major** (x.0.0) : Breaking changes

Merci de faire de MOTUS V2 une meilleure application ! 🎮✨
