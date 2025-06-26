chmod +x cleanup.sh

#!/bin/bash

echo "🧹 ======================================="
echo "🧹 NETTOYAGE AUTOMATIQUE MOTUS V2"
echo "🧹 ======================================="
echo ""

# Afficher le répertoire courant
echo "📁 Répertoire actuel : $(pwd)"
echo ""

# Vérifier qu'on est dans le bon dossier
if [[ ! -f "README.md" || ! -d "client" || ! -d "server" ]]; then
    echo "❌ ERREUR: Vous n'êtes pas dans le dossier racine de Motus-V2"
    echo "💡 Naviguez vers le dossier racine et relancez le script"
    exit 1
fi

echo "✅ Dossier Motus-V2 détecté"
echo ""

# 1. Supprimer les fichiers de backup
echo "🗑️  ÉTAPE 1: Suppression des fichiers backup..."
backup_files=$(find . -name "*.backup*" -type f 2>/dev/null)
if [[ -n "$backup_files" ]]; then
    echo "📄 Fichiers backup trouvés :"
    echo "$backup_files"
    find . -name "*.backup*" -type f -delete
    echo "✅ Fichiers backup supprimés"
else
    echo "ℹ️  Aucun fichier backup trouvé"
fi
echo ""

# 2. Nettoyer les caches Node.js
echo "📦 ÉTAPE 2: Nettoyage des caches Node.js..."

# Cache client
if [[ -d "client/node_modules/.cache" ]]; then
    rm -rf client/node_modules/.cache/
    echo "✅ Cache client supprimé"
fi

if [[ -d "client/.angular/cache" ]]; then
    rm -rf client/.angular/cache/
    echo "✅ Cache Angular supprimé"
fi

# Cache server
if [[ -d "server/node_modules/.cache" ]]; then
    rm -rf server/node_modules/.cache/
    echo "✅ Cache serveur supprimé"
fi

echo "📦 Caches nettoyés"
echo ""

# 3. Supprimer les logs temporaires
echo "📄 ÉTAPE 3: Suppression des logs temporaires..."
log_files=$(find . -name "*.log" -type f 2>/dev/null)
if [[ -n "$log_files" ]]; then
    echo "📄 Logs trouvés :"
    echo "$log_files"
    find . -name "*.log" -type f -delete
    echo "✅ Logs supprimés"
else
    echo "ℹ️  Aucun log temporaire trouvé"
fi
echo ""

# 4. Nettoyer les dossiers dist/build
echo "🏗️  ÉTAPE 4: Nettoyage des builds temporaires..."
if [[ -d "client/dist" ]]; then
    rm -rf client/dist/
    echo "✅ Dossier dist/ supprimé"
fi
echo ""

# 5. Vérifier .gitignore
echo "📋 ÉTAPE 5: Vérification .gitignore..."
if [[ ! -f ".gitignore" ]]; then
    echo "⚠️  Fichier .gitignore manquant !"
    echo "💡 Création d'un .gitignore basique..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/

# Environment
.env
*.env

# Logs
*.log
logs/

# Build
dist/
build/

# Cache
.cache/
.angular/cache/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Backup files
*.backup
*.backup*
EOF
    echo "✅ .gitignore créé"
else
    echo "✅ .gitignore présent"
fi
echo ""

# 6. Créer .env.example si manquant
echo "⚙️  ÉTAPE 6: Vérification .env.example..."
if [[ ! -f "server/.env.example" ]]; then
    echo "⚠️  Fichier server/.env.example manquant !"
    echo "💡 Création du template..."
    cat > server/.env.example << 'EOF'
# Configuration Base de Données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_securise
DB_NAME=motus

# JWT Secret (minimum 32 caractères)
JWT_SECRET=votre_super_secret_jwt_minimum_32_caracteres

# Configuration SMTP Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_application

# Environnement
NODE_ENV=development
PORT=3000
EOF
    echo "✅ .env.example créé"
else
    echo "✅ .env.example présent"
fi
echo ""

# 7. Résumé
echo "🎉 ======================================="
echo "🎉 NETTOYAGE AUTOMATIQUE TERMINÉ !"
echo "🎉 ======================================="
echo ""
echo "✅ Fichiers backup supprimés"
echo "✅ Caches Node.js nettoyés"  
echo "✅ Logs temporaires supprimés"
echo "✅ Builds temporaires nettoyés"
echo "✅ .gitignore vérifié"
echo "✅ .env.example créé/vérifié"
echo ""
echo "📋 PROCHAINES ÉTAPES MANUELLES :"
echo "1️⃣  Nettoyer les console.log (voir CLEANUP.md)"
echo "2️⃣  Sécuriser les variables d'environnement"
echo "3️⃣  Tester l'application après nettoyage"
echo "4️⃣  Effectuer un build de production"
echo ""
echo "📚 Consultez CLEANUP.md pour les détails !"
echo ""
echo "🚀 Votre application est maintenant plus propre !"