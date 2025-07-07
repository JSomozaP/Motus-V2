#!/bin/bash

# ===================================
# MOTUS V2 - SCRIPT PRÉ-PUSH
# ===================================
# Vérifications avant push sur GitHub

echo "🚀 MOTUS V2 - Vérifications pré-push"
echo "===================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
ERRORS=0
WARNINGS=0

echo -e "${BLUE}📋 Vérification des fichiers essentiels...${NC}"

# Fichiers obligatoires
REQUIRED_FILES=(
    "README.md"
    "CHANGELOG.md"
    "LICENSE"
    "CONTRIBUTING.md"
    "SECURITY.md"
    ".gitignore"
    "demo-account.sql"
    "server/.env.example"
    "server/package.json"
    "client/package.json"
    "sql/schema.sql"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ✅ $file"
    else
        echo -e "  ${RED}❌ $file MANQUANT${NC}"
        ((ERRORS++))
    fi
done

echo ""
echo -e "${BLUE}🔍 Vérification du contenu...${NC}"

# Vérifier que .env n'est pas présent (sécurité)
if [ -f "server/.env" ]; then
    echo -e "  ${RED}❌ server/.env présent - RISQUE SÉCURITÉ !${NC}"
    echo -e "     ${YELLOW}Supprimez ce fichier avant le push${NC}"
    ((ERRORS++))
else
    echo -e "  ✅ Aucun fichier .env détecté"
fi

# Vérifier node_modules absent
if [ -d "server/node_modules" ] || [ -d "client/node_modules" ]; then
    echo -e "  ${YELLOW}⚠️  Dossiers node_modules détectés${NC}"
    echo -e "     ${YELLOW}Vérifiez qu'ils sont dans .gitignore${NC}"
    ((WARNINGS++))
else
    echo -e "  ✅ Aucun node_modules détecté"
fi

# Vérifier screenshots
SCREENSHOT_COUNT=$(ls screenshots/*.png 2>/dev/null | wc -l)
if [ "$SCREENSHOT_COUNT" -gt 0 ]; then
    echo -e "  ✅ $SCREENSHOT_COUNT screenshots présents"
else
    echo -e "  ${YELLOW}⚠️  Aucun screenshot détecté${NC}"
    ((WARNINGS++))
fi

# Vérifier que demo-account.sql contient des données
if grep -q "INSERT INTO" demo-account.sql 2>/dev/null; then
    echo -e "  ✅ demo-account.sql contient des données"
else
    echo -e "  ${YELLOW}⚠️  demo-account.sql semble vide${NC}"
    ((WARNINGS++))
fi

echo ""
echo -e "${BLUE}📊 Vérification de la documentation...${NC}"

# Vérifier longueur README
README_LINES=$(wc -l < README.md)
if [ "$README_LINES" -gt 100 ]; then
    echo -e "  ✅ README.md complet ($README_LINES lignes)"
else
    echo -e "  ${YELLOW}⚠️  README.md pourrait être plus détaillé${NC}"
    ((WARNINGS++))
fi

# Vérifier présence de badges
if grep -q "shield" README.md; then
    echo -e "  ✅ Badges présents dans README"
else
    echo -e "  ${YELLOW}⚠️  Badges manquants dans README${NC}"
    ((WARNINGS++))
fi

echo ""
echo -e "${BLUE}🛡️  Vérification sécurité...${NC}"

# Rechercher des secrets potentiels dans les fichiers de configuration
SECRET_FILES=(
    ".env"
    "*.env"
    "config.js"
    "config.json"
    "*.config.js"
    "*.config.json"
)

SECRET_FOUND=false

# Vérifier les fichiers de configuration spécifiques
for file_pattern in "${SECRET_FILES[@]}"; do
    for file in $(find . -name "$file_pattern" -not -path "./node_modules/*" -not -path "./.git/*" -not -name "*.example" 2>/dev/null); do
        if [ -f "$file" ]; then
            # Patterns plus spécifiques pour détecter de vrais secrets
            if grep -E "(PASSWORD|SECRET|KEY|TOKEN).*=.*['\"][^'\s]{8,}['\"]" "$file" 2>/dev/null | grep -v -E "(example|placeholder|your_|xxx|123)" >/dev/null; then
                echo -e "  ${RED}❌ Secret potentiel dans $file${NC}"
                SECRET_FOUND=true
                ((ERRORS++))
            elif grep -E "smtp.*=.*@gmail\.com" "$file" 2>/dev/null >/dev/null; then
                echo -e "  ${RED}❌ Configuration SMTP réelle détectée dans $file${NC}"
                SECRET_FOUND=true
                ((ERRORS++))
            fi
        fi
    done
done

# Vérifier les fichiers .env à la racine ou dans server/
if [ -f ".env" ] || [ -f "server/.env" ]; then
    echo -e "  ${RED}❌ Fichier .env détecté - RISQUE SÉCURITÉ !${NC}"
    echo -e "     ${YELLOW}Les fichiers .env ne doivent jamais être commités${NC}"
    SECRET_FOUND=true
    ((ERRORS++))
fi

if [ "$SECRET_FOUND" = false ]; then
    echo -e "  ✅ Aucun secret détecté dans les fichiers de configuration"
fi

echo ""
echo "===================================="
echo -e "${BLUE}📈 RÉSUMÉ${NC}"
echo "===================================="

if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
    echo -e "${GREEN}🎉 PARFAIT ! Prêt pour le push${NC}"
    echo -e "${GREEN}✅ 0 erreur, 0 avertissement${NC}"
    exit 0
elif [ "$ERRORS" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  PUSH POSSIBLE avec avertissements${NC}"
    echo -e "${YELLOW}✅ 0 erreur, $WARNINGS avertissement(s)${NC}"
    exit 0
else
    echo -e "${RED}🚫 PUSH BLOQUÉ - Erreurs à corriger${NC}"
    echo -e "${RED}❌ $ERRORS erreur(s), $WARNINGS avertissement(s)${NC}"
    echo ""
    echo -e "${YELLOW}Corrigez les erreurs avant de pousser sur GitHub${NC}"
    exit 1
fi
