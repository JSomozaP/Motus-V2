#!/bin/bash

echo "🧠 ======================================="
echo "🧠 NETTOYAGE INTELLIGENT DES CONSOLE.LOG"
echo "🧠 ======================================="
echo ""

# Sauvegarder avant modification
echo "💾 Sauvegarde des fichiers originaux..."
find client/src -name "*.ts" -exec cp {} {}.smart-backup \;

echo "🗑️ Suppression SÉLECTIVE des logs de debug technique..."
echo ""

# === LOGS TECHNIQUES À SUPPRIMER ===

# 1. APIs et réponses techniques (trop verbeux)
echo "🔗 Suppression logs API..."
find client/src -name "*.ts" -exec sed -i '/console\.log.*🔗 Appel API trouve-mot/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*📡 Réponse API reçue/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*🔄 Appel leaderboard URL/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*💾 Appel completeGame vers/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*✅ Réponse completeGame/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*✅ Réponse leaderboard/d' {} \;

# 2. Interactions clavier (debug pur)
echo "⌨️ Suppression logs clavier..."
find client/src -name "*.ts" -exec sed -i '/console\.log.*🎹 Clavier - touche cliquée/d' {} \;

# 3. Modals de debug
echo "🔧 Suppression logs modals debug..."
find client/src -name "*.ts" -exec sed -i '/console\.log.*🔧 Modal.*Debug/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*🔔 Modal reçu.*DEBUG/d' {} \;

# 4. Vérifications techniques détaillées
echo "🔍 Suppression vérifications techniques..."
find client/src -name "*.ts" -exec sed -i '/console\.log.*🔍 Vérification locale/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*🎯 Traitement réponse/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*💾 Sauvegarde BDD avec userId dynamique/d' {} \;

# 5. Modes de difficulté (trop verbeux)
echo "🎮 Suppression logs modes détaillés..."
find client/src -name "*.ts" -exec sed -i '/console\.log.*🟢 Mode FACILE: 3-4 lettres/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*📚 Mode MOYEN: 5-7 lettres/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*🔥 Mode DIFFICILE: 6-9 lettres/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*💀 Mode CAUCHEMAR: 6-12 lettres/d' {} \;

# 6. Logs de debug spécifiques
echo "🧪 Suppression logs debug spécifiques..."
find client/src -name "*.ts" -exec sed -i '/console\.log.*⚠️ Aucun mot valide trouvé/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*✅ Mot valide généré (sans caractères)/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*🔄 Mot fallback/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*📊 Scores reçus pour modal/d' {} \;
find client/src -name "*.ts" -exec sed -i '/console\.log.*📊 Leaderboard mappé/d' {} \;

# 7. Supprimer commentaires // Debug
echo "💬 Suppression commentaires debug..."
find client/src -name "*.ts" -exec sed -i 's/ \/\/ Debug//g' {} \;

echo ""
echo "✅ ======================================="
echo "✅ NETTOYAGE INTELLIGENT TERMINÉ !"
echo "✅ ======================================="
echo ""

echo "🎯 LOGS CONSERVÉS (utiles) :"
echo "- 🎮 Jeu prêt - Mot de X lettres"
echo "- ✅ Score sauvé pour [joueur]"
echo "- ✅ Nouveau mot chargé !"
echo "- �� Déconnexion demandée"
echo "- 🔄 Actions importantes utilisateur"
echo "- 🏆 Tous les succès/confirmations"
echo "- ❌ TOUTES les erreurs (console.error)"
echo ""

echo "🗑️ LOGS SUPPRIMÉS (debug technique) :"
echo "- 🔗 Appels API détaillés"
echo "- ⌨️ Clics clavier individuels"
echo "- 🔧 Debug modals"
echo "- 📊 Données techniques internes"
echo ""

echo "💾 Fichiers sauvegardés avec extension .smart-backup"
echo "🚀 Votre code est maintenant production-ready !"
