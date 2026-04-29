#!/bin/bash
# Script de vérification post-installation
# Utilisation: bash verify_installation.sh

echo "🔍 Vérification de l'installation - Smart Prescription Reader"
echo "=============================================================="
echo ""

# Vérifier Flutter
echo "1️⃣  Vérification Flutter..."
if command -v flutter &> /dev/null; then
    FLUTTER_VERSION=$(flutter --version)
    echo "✅ Flutter installé: $FLUTTER_VERSION"
else
    echo "❌ Flutter non trouvé"
    exit 1
fi

# Vérifier Dart
echo ""
echo "2️⃣  Vérification Dart..."
if command -v dart &> /dev/null; then
    DART_VERSION=$(dart --version)
    echo "✅ Dart installé: $DART_VERSION"
else
    echo "❌ Dart non trouvé"
    exit 1
fi

# Vérifier la structure du projet
echo ""
echo "3️⃣  Vérification de la structure du projet..."

REQUIRED_FILES=(
    "pubspec.yaml"
    "lib/main.dart"
    "lib/models/user_model.dart"
    "lib/models/scan_model.dart"
    "lib/services/auth_service.dart"
    "lib/services/hive_service.dart"
    "lib/services/ml_kit_service.dart"
    "lib/services/image_service.dart"
    "lib/screens/login_screen.dart"
    "lib/screens/signup_screen.dart"
    "lib/screens/home_screen.dart"
    "lib/screens/camera_screen.dart"
    "lib/screens/result_screen.dart"
    "lib/screens/history_screen.dart"
    "lib/widgets/custom_widgets.dart"
    "lib/widgets/root_widget.dart"
    "lib/utils/medicine_list.dart"
)

MISSING_FILES=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MANQUANT!)"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

echo ""
echo "4️⃣  Vérification de la documentation..."

DOCS=(
    "README.md"
    "SETUP_GUIDE.md"
    "FEATURES.md"
    "QUICK_START.md"
    "INSTALLATION.md"
    "PROJECT_SUMMARY.md"
)

MISSING_DOCS=0
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $doc"
    else
        echo "  ❌ $doc (MANQUANT!)"
        MISSING_DOCS=$((MISSING_DOCS + 1))
    fi
done

echo ""
echo "5️⃣  Vérification des permissions Android..."
if grep -q "CAMERA" android/app/src/main/AndroidManifest.xml; then
    echo "  ✅ Permission CAMERA configurée"
else
    echo "  ⚠️  Permission CAMERA non trouvée"
fi

if grep -q "READ_EXTERNAL_STORAGE" android/app/src/main/AndroidManifest.xml; then
    echo "  ✅ Permission READ_EXTERNAL_STORAGE configurée"
else
    echo "  ⚠️  Permission READ_EXTERNAL_STORAGE non trouvée"
fi

echo ""
echo "6️⃣  Vérification des permissions iOS..."
if grep -q "NSCameraUsageDescription" ios/Runner/Info.plist; then
    echo "  ✅ Permission caméra iOS configurée"
else
    echo "  ⚠️  Permission caméra iOS non trouvée"
fi

echo ""
echo "=============================================================="

if [ $MISSING_FILES -eq 0 ] && [ $MISSING_DOCS -eq 0 ]; then
    echo "✅ VÉRIFICATION RÉUSSIE!"
    echo ""
    echo "Prochaines étapes:"
    echo "1. Exécutez: flutter clean && flutter pub get"
    echo "2. Exécutez: flutter doctor"
    echo "3. Exécutez: flutter run"
    exit 0
else
    echo "⚠️  VÉRIFICATION INCOMPLÈTE"
    echo ""
    echo "Fichiers manquants: $MISSING_FILES"
    echo "Documentations manquantes: $MISSING_DOCS"
    exit 1
fi
