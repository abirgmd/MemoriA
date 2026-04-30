#!/bin/bash

# MemoriA - Run Tests
# Script pour exécuter tous les tests

echo "🧪 Exécution des tests MemoriA..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

FAILED=0

# Backend Tests
echo "📦 Tests Backend..."
cd MemoriA-dev/MemorIA_Backend
if command -v mvn &> /dev/null; then
    mvn test -q
else
    ./mvnw test -q
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Tests Backend échoués${NC}"
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✓ Tests Backend passés${NC}"
fi

cd ../..

# Frontend Tests
echo ""
echo "🎨 Tests Frontend..."
cd MemoriA-dev/MemorIA_Frontend

npm test -- --watch=false --browsers=ChromeHeadless -q 2>/dev/null

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Tests Frontend échoués${NC}"
    FAILED=$((FAILED + 1))
else
    echo -e "${GREEN}✓ Tests Frontend passés${NC}"
fi

cd ../..

# Summary
echo ""
echo "=========================================="
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Tous les tests sont passés!${NC}"
else
    echo -e "${RED}✗ $FAILED groupe(s) de tests échoué(s)${NC}"
    exit 1
fi
echo "=========================================="
