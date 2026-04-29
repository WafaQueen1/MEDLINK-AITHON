# 🚀 Installation Complète - Smart Prescription Reader

Bienvenue! Ce fichier guide vous à travers chaque étape pour faire fonctionner l'application.

## ⚡ Installation Rapide (3 étapes)

### Étape 1: Préparer le projet
```bash
cd pharmatec
flutter clean
flutter pub get
```

### Étape 2: Vérifier la configuration
```bash
flutter doctor
```
Tout doit afficher ✓

### Étape 3: Lancer l'application
```bash
flutter run
```

**C'est tout!** L'application devrait maintenant s'exécuter sur votre appareil/émulateur.

---

## 📋 Installation Détaillée

### Prérequis
- **Flutter**: 3.6.0 ou plus récent
- **Dart**: 3.0.0 ou plus récent
- **Android SDK**: API 21+ (si vous ciblez Android)
- **iOS**: iOS 13.0+ (si vous ciblez iOS)
- **Espace disque**: ~500 MB

### Vérifier l'installation Flutter
```bash
flutter --version
dart --version
flutter doctor -v
```

### Installer/Mettre à jour Flutter
```bash
# macOS/Linux
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"

# Windows
# Télécharger depuis https://flutter.dev/docs/get-started/install
# Ajouter au PATH
```

---

## 🔧 Configuration pour Android

### Étape 1: Vérifier Android SDK
```bash
flutter doctor --android-licenses
# Accepter les licenses
```

### Étape 2: Vérifier build.gradle
```gradle
// android/app/build.gradle devrait contenir:
android {
    minSdkVersion 21
    targetSdkVersion 34
    // ...
}
```

### Étape 3: Configurer AndroidManifest.xml
Vérifiez que les permissions sont présentes:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### Lancer sur Android
```bash
# Sur un appareil physique
flutter run

# Sur un émulateur
flutter emulators
flutter emulators launch <emulator-id>
flutter run
```

---

## 🍎 Configuration pour iOS

### Étape 1: Installer Pods
```bash
cd ios
pod install
cd ..
```

### Étape 2: Vérifier Info.plist
Les permissions doivent être configurées (voir ios/Runner/Info.plist)

### Étape 3: Configurer Deployment Target
```
Xcode → Runner → Build Settings → Minimum Deployment Target → 13.0
```

### Lancer sur iOS
```bash
flutter run -d <device-id>
```

---

## 📦 Dépendances principales

Toutes les dépendances sont déjà configurées dans `pubspec.yaml`:

```yaml
dependencies:
  hive: ^2.2.3                 # Base de données locale
  camera: ^0.10.6              # Caméra
  google_ml_kit: ^0.7.3        # OCR
  path_provider: ^2.1.1        # Stockage fichiers
  uuid: ^4.0.0                 # Génération UUID
  intl: ^0.19.0                # Formatage dates
```

Pour installer:
```bash
flutter pub get
```

---

## ✅ Vérification Post-Installation

### Test 1: Vérification des permissions
- Android: Paramètres > Applications > Pharmatec > Permissions > Caméra ✓
- iOS: Settings > Privacy > Camera ✓

### Test 2: Vérification Hive
```bash
# L'app devrait créer automatiquement:
# - /data/data/com.example.pharmatec/app_flutter/hive/ (Android)
# - /Documents/pharmatec_images/ (iOS)
```

### Test 3: Test complet
1. Lancer l'app
2. Créer un compte: `test@example.com` / `test123456`
3. Se connecter
4. Scanner une ordonnance (photo d'un document)
5. Vérifier la extraction OCR
6. Sauvegarder
7. Consulter l'historique

---

## 🔍 Troubleshooting Installation

### Problème: "Flutter not found"
```bash
# Ajouter Flutter au PATH
export PATH="$PATH:/path/to/flutter/bin"
```

### Problème: "Android SDK not found"
```bash
flutter config --android-sdk /path/to/android/sdk
```

### Problème: "Pod install failed"
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Problème: "Google ML Kit not recognized"
```bash
flutter clean
flutter pub get
flutter run
```

### Problème: "Permission denied"
```bash
sudo chmod -R 777 ~/path/to/pharmatec
```

---

## 🎯 Premier Lancement

### Étape 1: Créer un compte
- Cliquer sur "S'inscrire"
- Remplir tous les champs
- Utiliser un email valide
- Mot de passe >= 6 caractères

### Étape 2: Se connecter
- Utiliser le même email/mot de passe
- Accèder à HomeScreen

### Étape 3: Scanner une ordonnance
- Cliquer sur "Scanner une ordonnance"
- Permettre l'accès à la caméra
- Prendre une photo d'un document texte
- L'OCR extraira le texte automatiquement
- Éditer les médicaments détectés
- Sauvegarder

### Étape 4: Consulter l'historique
- Cliquer sur "Historique"
- Voir tous les scans précédents
- Supprimer si nécessaire

---

## 🔐 Configuration de Sécurité

### Permissions Required
- ✅ Camera: Pour scanner les ordonnances
- ✅ Storage: Pour sauvegarder les images
- ✅ Photos: Pour sélectionner des images (iOS)

### Accepter les Permissions
L'app demande les permissions au premier usage:
- Android: Dans les paramètres de l'app
- iOS: Pop-up lors du premier accès

---

## 📚 Documentation

Après l'installation, consultez:
- **README.md**: Guide complet de l'application
- **FEATURES.md**: Toutes les fonctionnalités détaillées
- **SETUP_GUIDE.md**: Configuration avancée
- **QUICK_START.md**: Démarrage rapide
- **PROJECT_SUMMARY.md**: Architecture complète

---

## 🚀 Commandes Utiles

### Développement
```bash
# Lancer avec verbose logging
flutter run -v

# Lancer en mode profile
flutter run --profile

# Lancer en mode release
flutter run --release

# Hot reload
flutter run

# Ensuite appuyer sur 'r' pour hot reload
# Appuyer sur 'R' pour hot restart
```

### Maintenance
```bash
# Nettoyer le projet
flutter clean

# Mettre à jour les dépendances
flutter pub get
flutter pub upgrade

# Vérifier les problèmes
flutter analyze

# Format le code
flutter format lib/

# Exécuter les tests
flutter test
```

### Build
```bash
# Build APK Android
flutter build apk --release

# Build iOS
flutter build ios --release

# Build Web
flutter build web --release
```

---

## 📊 Vérification de Santé

Exécuter avant de commencer:
```bash
flutter doctor
```

Résultat attendu:
```
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, version 3.x.x)
[✓] Android toolchain - develop for Android devices
[✓] iOS toolchain - develop for iOS devices
[✓] Xcode - develop for iOS
[✓] Android Studio
[✓] VS Code
[✓] Connected device
```

---

## 💻 Configuration IDE

### Visual Studio Code
Extensions recommandées:
1. Flutter - by Dart Code
2. Dart - by Dart Code
3. Awesome Flutter Snippets - by Nash

Créer `.vscode/launch.json`:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Pharmatec",
            "type": "dart",
            "request": "launch",
            "program": "lib/main.dart"
        }
    ]
}
```

### Android Studio
1. Ouvrir le projet
2. Attendre l'indexation
3. Run > Run 'main.dart'

### Xcode (macOS)
1. Ouvrir `ios/Runner.xcworkspace`
2. Sélectionner un device
3. Run

---

## 🔗 Ressources Utiles

- Flutter: https://flutter.dev
- Dart: https://dart.dev
- Hive: https://docs.hivedb.dev/
- Google ML Kit: https://firebase.google.com/docs/ml-kit
- Stack Overflow: Tag [flutter]

---

## 📞 Support Installation

Si vous rencontrez des problèmes:

1. **Consulter README.md** - Section "Dépannage"
2. **Consulter SETUP_GUIDE.md** - Section "Troubleshooting"
3. **Exécuter `flutter doctor -v`** - Pour diagnostiquer
4. **Vérifier les logs** - `flutter run -v`

---

## ✨ Prochaines Étapes

1. ✅ Installation réussie
2. 📖 Lire la documentation
3. 🧪 Tester toutes les fonctionnalités
4. 🎨 Personnaliser si nécessaire
5. 📦 Builder pour production

---

## 🎉 Bravo!

Votre application **Smart Prescription Reader** est maintenant prête à l'emploi!

Commencez à scanner vos ordonnances médicales en toute sécurité, 100% offline.

**Besoin d'aide?** Consultez les fichiers de documentation inclus.

---

**Bienvenue dans Smart Prescription Reader! 🏥📱**
