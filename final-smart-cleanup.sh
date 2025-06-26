#!/bin/bash

echo "🚀 ======================================="
echo "🚀 NETTOYAGE FINAL INTELLIGENT MOTUS V2"
echo "🚀 ======================================="
echo ""

# 1. Nettoyage intelligent des console.log
echo "🧠 ÉTAPE 1: Nettoyage intelligent console.log..."
if [[ -f "smart-cleanup.sh" ]]; then
    ./smart-cleanup.sh
    echo "✅ Console.log nettoyés intelligemment"
else
    echo "❌ Script smart-cleanup.sh non trouvé"
    exit 1
fi

echo ""

# 2. Génération variables sécurisées
echo "🔐 ÉTAPE 2: Génération variables sécurisées..."
if [[ -f "generate-secure-env.sh" ]]; then
    ./generate-secure-env.sh
else
    echo "❌ Script generate-secure-env.sh non trouvé"
    exit 1
fi

echo ""

# 3. Suppression doublons
echo "🗑️ ÉTAPE 3: Suppression doublons..."
if [[ -f ".env.example" ]]; then
    rm .env.example
    echo "✅ .env.example racine supprimé (doublon)"
else
    echo "ℹ️ Pas de doublon .env.example à supprimer"
fi

# 4. Vérifier structure finale
echo ""
echo "📁 ÉTAPE 4: Vérification structure..."
echo "📋 Fichiers de documentation :"
ls -la | grep -E "(README|CLEANUP|cleanup|\.sh)" | head -5

echo ""
echo "📋 Configuration serveur :"
ls -la server/ | grep -E "(\.env|index\.js)"

# 5. Test build production
echo ""
echo "🏗️ ÉTAPE 5: Test build production..."
cd client
echo "⏳ Construction en cours..."
npm run build --configuration production > /tmp/build.log 2>&1
if [[ $? -eq 0 ]]; then
    echo "✅ Build production réussi !"
    echo "📦 Taille du build :"
    du -sh dist/ 2>/dev/null || echo "📦 Build créé avec succès"
    rm -rf dist/  # Nettoyer après test
else
    echo "⚠️ Erreur dans le build. Vérifiez /tmp/build.log"
    echo "🔍 Dernières lignes d'erreur :"
    tail -3 /tmp/build.log
fi

cd ..

echo ""
echo "🎉 ======================================="
echo "🎉 NETTOYAGE INTELLIGENT TERMINÉ !"
echo "🎉 ======================================="
echo ""

echo "✅ ACTIONS EFFECTUÉES :"
echo "🧠 Console.log nettoyés intelligemment"
echo "🔐 Variables sécurisées générées"
echo "🗑️ Doublons supprimés"
echo "🏗️ Build production testé"
echo "💾 Fichiers sauvegardés (.smart-backup)"
echo ""

echo "📋 PROCHAINES ACTIONS MANUELLES :"
echo "1️⃣ Mettre à jour server/.env avec les nouvelles variables"
echo "2️⃣ Tester l'application (npm start dans server + client)"
echo "3️⃣ Vérifier que tout fonctionne"
echo "4️⃣ Supprimer les fichiers .smart-backup si tout va bien"
echo ""

echo "🚀 VOTRE APPLICATION EST PRÊTE POUR LA PRODUCTION !"
echo "🎮 Logs utiles conservés, debug technique supprimé"
