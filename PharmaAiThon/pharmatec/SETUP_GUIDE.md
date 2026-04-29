# Guide de Configuration - Smart Prescription Reader

## Configuration Détaillée du Projet

### 1. Installation de Flutter

Si vous ne l'avez pas encore fait:

```bash
# Télécharger Flutter
git clone https://github.com/flutter/flutter.git
cd flutter
export PATH="$PATH:`pwd`/bin"

# Vérifier l'installation
flutter doctor
```

### 2. Configuration Android

#### 2.1 AndroidManifest.xml
Les permissions suivantes sont déjà configurées:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

#### 2.2 Minimum SDK
Configuré à API 21+ (déjà défini dans `build.gradle`)

#### 2.3 Compiler avec Gradle
```bash
cd android
./gradlew build
```

### 3. Configuration iOS

#### 3.1 Info.plist
Les clés suivantes sont configurées:
```xml
<key>NSCameraUsageDescription</key>
<string>Cette application a besoin d'accéder à votre caméra...</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Cette application a besoin d'accéder à votre galerie photo...</string>
```

#### 3.2 Pods
```bash
cd ios
pod install
cd ..
```

#### 3.3 Deployment Target
Minimum: iOS 13.0

### 4. Configuration Google ML Kit (Important!)

#### Pour Android:
```groovy
// Dans android/app/build.gradle, assurez-vous d'avoir:
minSdkVersion = 21
```

#### Pour iOS:
```bash
# L'installation via pubspec.yaml suffit
flutter pub get
```

### 5. Structure des Dossiers pour Stockage

L'application crée automatiquement:
```
Documents/
└── pharmatec_images/          # Images des ordonnances
    ├── prescription_TIMESTAMP.jpg
    ├── prescription_TIMESTAMP.jpg
    └── ...
```

### 6. Initialisation Hive

Hive s'initialise automatiquement au démarrage:
```dart
// Dans main.dart
await HiveService.initializeHive();
```

Ceci crée deux boxes:
- `userBox`: Pour les données utilisateur
- `scanBox`: Pour les scans d'ordonnances

## Installation Complète du Projet

### Étape 1: Cloner et préparer
```bash
cd <path-to-pharmatec>
flutter clean
flutter pub get
```

### Étape 2: Vérifier les dépendances
```bash
flutter doctor
```

Tout doit être ✓ sauf si vous ne développez que sur une plateforme.

### Étape 3: Compiler
```bash
# Debug
flutter run

# Release
flutter run --release
```

## Dépannage

### Problème 1: Erreur Google ML Kit
**Message**: "No implementation found for method... getText"

**Solution**:
```bash
flutter clean
flutter pub get
flutter run
```

### Problème 2: Permissions refusées
**Message**: "Permission denied" ou "Access denied"

**Solution** (Android):
1. Aller dans Paramètres > Applications > Smart Prescription Reader
2. Permissions > Activez Caméra et Stockage

**Solution** (iOS):
1. Settings > Privacy > Camera
2. Settings > Privacy > Photos
3. Acceptez les permissions

### Problème 3: OCR ne détecte rien
**Cause**: Image de mauvaise qualité

**Solutions**:
- Assurer un éclairage adéquat
- Tenir le téléphone stable
- Nettoyer l'objectif caméra
- Prendre plusieurs photos

### Problème 4: Base de données corrompue
**Symptôme**: L'application se bloque au démarrage

**Solution**:
1. Désinstaller l'application complètement
2. Exécuter `flutter clean`
3. Réinstaller
```bash
flutter clean
flutter pub get
flutter run
```

### Problème 5: Espace insuffisant
**Symptôme**: "Not enough storage space"

**Solution**:
- Libérer de l'espace sur le téléphone
- Supprimer les anciens scans via l'interface
- Vider le cache: `flutter clean`

## Configuration IDE Recommandée

### Visual Studio Code
Installer les extensions:
1. Flutter
2. Dart
3. Awesome Flutter Snippets
4. Error Lens

### Android Studio
- Installer Flutter et Dart plugins
- Configurer un AVD (Android Virtual Device)

### Xcode (macOS)
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

## Modes de Déploiement

### Debug (Développement)
```bash
flutter run -v  # Verbose mode
```

### Profile (Performance)
```bash
flutter run --profile
```

### Release (Production)
```bash
flutter run --release
```

## Build pour Distribution

### APK Android
```bash
flutter build apk --release
# Sortie: build/app/outputs/flutter-apk/app-release.apk

# Ou pour plusieurs architectures:
flutter build apk --release --split-per-abi
```

### App Bundle Android
```bash
flutter build appbundle --release
# Sortie: build/app/outputs/bundle/release/app-release.aab
```

### IPA iOS
```bash
flutter build ios --release
# Sortie: build/ios/iphoneos/Runner.app

# Pour créer une archive:
cd ios && xcodebuild -workspace Runner.xcworkspace -scheme Runner -configuration Release -archive -archivePath build/Runner.xcarchive
```

## Configuration pour Tests

### Tests unitaires
```bash
flutter test
```

### Tests d'intégration
```bash
flutter drive --target=test_driver/app.dart
```

## Optimisations de Performance

### Android
```groovy
// Dans build.gradle
release {
    signingConfig signingConfigs.release
    shrinkResources true
    minifyEnabled true
    proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
}
```

### iOS
```bash
# Build optimisé
flutter build ios --release --split-debug-info=./symbols
```

## Variables d'Environnement

### Configurer le chemin Flutter
```bash
# Pour macOS/Linux
export PATH="$PATH:/path/to/flutter/bin"

# Pour Windows
setx PATH "%PATH%;C:\path\to\flutter\bin"
```

## Vérification de Configuration

Exécuter le diagnostic complet:
```bash
flutter doctor -v
```

Vérifier les dépendances du projet:
```bash
flutter pub deps
```

Vérifier les problèmes d'analyse:
```bash
flutter analyze
```

## Points de Configuration Critiques

1. ✅ **SDK Android**: Minimum 21
2. ✅ **SDK iOS**: Minimum 13.0
3. ✅ **Permissions**: Caméra et Stockage
4. ✅ **Hive**: Initialisation au démarrage
5. ✅ **Google ML Kit**: Configuration OCR
6. ✅ **Path Provider**: Chemins de stockage

## Configuration de la Base de Données

### Backup Hive
```bash
# Les boîtes Hive sont dans:
# Android: /data/data/com.example.pharmatec/app_flutter/
# iOS: /Documents/pharmatec_images/
```

### Exporter les données
L'application exporte automatiquement les scans vers le dossier `pharmatec_images`.

### Réinitialiser les données
```dart
// Dans le code
await HiveService.clearAllData();
```

## Support et Documentation

- Documentation Flutter: https://flutter.dev
- Google ML Kit: https://firebase.google.com/docs/ml-kit
- Hive Database: https://docs.hivedb.dev/
- Camera Plugin: https://pub.dev/packages/camera
