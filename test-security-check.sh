#!/bin/bash

echo "Testing improved security checks..."

# Check if .env files exist
echo "1. Checking for .env files:"
if [ -f ".env" ]; then
    echo "   ❌ .env found in root"
fi
if [ -f "server/.env" ]; then
    echo "   ❌ server/.env found"
fi

# Test the old patterns that were causing false positives
echo ""
echo "2. Testing old patterns (should find false positives):"
echo "   password pattern matches:"
grep -r -E "password.*=.*[^example]" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.example" 2>/dev/null | head -3

echo "   secret pattern matches:"
grep -r -E "secret.*=.*[^your_]" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.example" 2>/dev/null | head -3

# Test new approach - look for actual secrets in config files
echo ""
echo "3. Testing new approach (should avoid false positives):"
echo "   Looking for real secrets in config files only..."

SECRET_FOUND=false

# Check specific configuration files
for file_pattern in ".env" "*.env" "config.js" "config.json"; do
    for file in $(find . -name "$file_pattern" -not -path "./node_modules/*" -not -path "./.git/*" -not -name "*.example" 2>/dev/null); do
        if [ -f "$file" ]; then
            echo "   Checking $file..."
            # Look for patterns that indicate real secrets (long values, not placeholders)
            if grep -E "(PASSWORD|SECRET|KEY|TOKEN).*=.*['\"][^'\s]{8,}['\"]" "$file" 2>/dev/null | grep -v -E "(example|placeholder|your_|xxx|123)" >/dev/null; then
                echo "     ❌ Real secret found"
                SECRET_FOUND=true
            else
                echo "     ✅ Only placeholders found"
            fi
        fi
    done
done

if [ "$SECRET_FOUND" = false ]; then
    echo "   ✅ No real secrets detected in config files"
fi

echo ""
echo "Test complete."
