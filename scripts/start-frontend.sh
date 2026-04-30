#!/bin/bash

# MemoriA - Start Frontend
# Script pour démarrer le serveur Angular

cd "$(dirname "$0")/../MemoriA-dev/MemorIA_Frontend" || exit

echo "🎨 Démarrage du Frontend MemoriA (Port 4200)..."
echo "   http://localhost:4200"
echo ""

ng serve --open
