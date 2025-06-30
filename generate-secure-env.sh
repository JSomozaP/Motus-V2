#!/bin/bash

echo "🔐 ======================================="
echo "🔐 GÉNÉRATION VARIABLES SÉCURISÉES"
echo "🔐 ======================================="
echo ""

# Générer JWT secret de 64 caractères (très sécurisé)
JWT_SECRET=$(openssl rand -hex 32)

# Générer mot de passe DB fort
DB_PASSWORD="Motus2025_$(openssl rand -hex 8)_Secure"

echo "🔑 VARIABLES ACTUELLES (faibles) :"
echo "======================================"
echo "JWT_SECRET=your-super-secret-jwt-key-here"
echo "DB_PASSWORD=motus123"
echo ""

echo "🛡️ NOUVELLES VARIABLES SÉCURISÉES :"
echo "======================================"
echo "JWT_SECRET=$JWT_SECRET"
echo "DB_PASSWORD=$DB_PASSWORD"
echo "======================================"
echo ""

echo "📝 ACTIONS À EFFECTUER :"
echo "1️⃣ Copiez JWT_SECRET ci-dessus"
echo "2️⃣ Éditez server/.env"
echo "3️⃣ Remplacez les anciennes valeurs"
echo "4️⃣ (Optionnel) Changez le mot de passe MySQL"
echo "5️⃣ Redémarrez l'application"
echo ""

echo "⚠️ IMPORTANT :"
echo "- Gardez ces valeurs en sécurité"
echo "- Ne les commitez jamais sur Git"
echo "- Utilisez des valeurs différentes en production"
