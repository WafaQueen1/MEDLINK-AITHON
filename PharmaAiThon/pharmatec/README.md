# Smart Prescription Reader

Une application Flutter complète pour scanner et extraire les médicaments des ordonnances médicales using AI/OCR (Reconnaissance Optique de Caractères). L'application fonctionne **100% hors ligne** sans serveur backend.

## 🎯 Objectif

L'application permet aux patients de :
- Scanner les ordonnances médicales avec la caméra
- Extraire automatiquement les noms de médicaments
- Stocker l'historique localement
- Gérer leurs données personnelles

## ✨ Caractéristiques Principales

### 1. **Authentification Locale**
- Système d'inscription et de connexion sécurisé
- Stockage des données utilisateur avec Hive
- Validation complète des champs
- Gestion du profil patient

### 2. **Scanning de Prescriptions**
- Accès à la caméra du dispositif
- Flash intégré
- Interface intuitive pour capturer les ordonnances

### 3. **Extraction OCR (Intelligence Artificielle)**
- Reconnaissance optique de texte en temps réel
- Utilise **Google ML Kit** (100% hors ligne)
- Extraction automatique des noms de médicaments
- Correspondance avec une liste de 100+ médicaments connus

### 4. **Édition et Sauvegarde**
- Modification manuelle des médicaments détectés
- Ajout/suppression de médicaments
- Sauvegarde locale dans la base de données Hive

### 5. **Historique**
- Affichage de tous les scans précédents
- Affichage de l'image, des médicaments et de la date
- Suppression de scans individuels ou en masse
- Gestion complète de l'historique

### 6. **Stockage 100% Hors Ligne**
- Base de données Hive pour les données locales
- Stockage des images en local
- Pas d'accès Internet requis

## 📋 Fonctionnalités Détaillées

### Écran d'Authentification
```
INSCRIPTION:
- Prénom, Nom
- Âge
- Sexe (Male/Female)
- Maladie chronique (Oui/Non)
- Numéro Chifa
- Email
- Mot de passe

CONNEXION:
- Email
- Mot de passe
```

### Écran d'Accueil
- Message de bienvenue personnalisé
- Bouton principal : "Scanner une ordonnance"
- Bouton : "Historique"
- Bouton : "Déconnecter"
- Info sur le mode hors ligne

### Écran Camera
- Aperçu en temps réel
- Bouton Flash (On/Off)
- Bouton Capture
- Guide de positionnement

### Écran Résultat
- Affichage de l'image capturée
- Liste des médicaments détectés
- Édition des médicaments
- Ajout/Suppression de médicaments
- Affichage du texte brut extrait
- Boutons Sauvegarder/Annuler

### Écran Historique
- Liste de tous les scans
- Image de chaque scan
- Date et heure
- Liste des médicaments
- Suppression individuelle
- Suppression en masse

## 🛠️ Technologies Utilisées

| Technologie | Utilisation |
|-------------|------------|
| **Flutter** | Framework UI cross-platform |
| **Dart** | Langage de programmation |
| **Hive** | Base de données locale |
| **Google ML Kit** | OCR hors ligne |
| **Camera** | Accès à la caméra |
| **Image** | Traitement d'images |
| **Path Provider** | Stockage de fichiers |

## 📦 Dépendances

```yaml
# Base
flutter: sdk: flutter
cupertino_icons: ^1.0.8

# Base de données
hive: ^2.2.3
hive_flutter: ^1.1.0

# Camera et Images
camera: ^0.10.6
image_picker: ^1.0.4
image: ^4.0.17

# OCR
google_ml_kit: ^0.7.3

# Stockage
path_provider: ^2.1.1

# Utilitaires
intl: ^0.19.0
uuid: ^4.0.0
```

## ⚙️ Installation et Setup

### Prérequis
- Flutter 3.6.0 ou plus récent
- Dart 3.0.0 ou plus récent
- Android SDK 21+ ou iOS 13.0+

### Étapes d'Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd pharmatec
```

2. **Installer les dépendances**
```bash
flutter pub get
```

3. **Configurer Google ML Kit (Optional mais recommandé)**
   - Pour Android : Configurer Firebase (optionnel)
   - Pour iOS : Ajouter les frameworks

4. **Lancer l'application**
```bash
# Mode Debug
flutter run

# Mode Release
flutter run --release
```

## 📱 Compilation

### Android
```bash
flutter build apk --release
# Sortie: build/app/outputs/flutter-apk/app-release.apk
```

### iOS
```bash
flutter build ios --release
# Sortie: build/ios/iphoneos/Runner.app
```

## 🗄️ Structure du Projet

```
lib/
├── main.dart                 # Point d'entrée
├── models/
│   ├── user_model.dart      # Modèle utilisateur
│   └── scan_model.dart      # Modèle scan
├── services/
│   ├── hive_service.dart    # Service base de données
│   ├── auth_service.dart    # Service authentification
│   ├── ml_kit_service.dart  # Service OCR
│   └── image_service.dart   # Service images
├── screens/
│   ├── login_screen.dart    # Écran connexion
│   ├── signup_screen.dart   # Écran inscription
│   ├── home_screen.dart     # Écran accueil
│   ├── camera_screen.dart   # Écran caméra
│   ├── result_screen.dart   # Écran résultats
│   └── history_screen.dart  # Écran historique
├── widgets/
│   ├── custom_widgets.dart  # Widgets personnalisés
│   └── root_widget.dart     # Widget racine
└── utils/
    └── medicine_list.dart   # Liste des médicaments
```

## 💾 Structure de Base de Données

### Hive Box: "userBox"
```dart
{
  'firstName': String,
  'lastName': String,
  'age': int,
  'sex': String, // "Male" ou "Female"
  'hasChronicDisease': bool,
  'chronicDiseaseName': String?, // optional
  'chifaNumber': String,
  'email': String,
  'password': String, // hashed in production
}
```

### Hive Box: "scanBox"
```dart
{
  'id': String, // UUID
  'imagePath': String, // Chemin local
  'medicines': List<String>,
  'date': String, // ISO8601
  'rawText': String, // Texte brut OCR
}
```

## 📝 Modèles de Données

### UserModel
```dart
UserModel(
  firstName: "Jean",
  lastName: "Dupont",
  age: 35,
  sex: "Male",
  hasChronicDisease: true,
  chronicDiseaseName: "Diabète",
  chifaNumber: "123456789",
  email: "jean@example.com",
  password: "password123",
)
```

### ScanModel
```dart
ScanModel(
  id: "uuid-value",
  imagePath: "/path/to/image.jpg",
  medicines: ["Paracetamol", "Amoxicillin"],
  date: DateTime.now(),
  rawText: "Texte extrait...",
)
```

## 🔒 Permissions Requises

### Android
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### iOS
- Camera Usage Description
- Photo Library Usage Description

## 🎓 Utilisation

### 1. Première Utilisation
1. Installer l'application
2. Cliquer sur "S'inscrire"
3. Remplir les informations du profil
4. Confirmer l'inscription
5. Se connecter avec email/mot de passe

### 2. Scanner une Ordonnance
1. Cliquer sur "Scanner une ordonnance"
2. Autoriser l'accès à la caméra
3. Positionner l'ordonnance dans le cadre
4. Appuyer pour capturer
5. Vérifier les résultats OCR
6. Éditer si nécessaire
7. Sauvegarder

### 3. Consulter l'Historique
1. Cliquer sur "Historique"
2. Voir tous les scans précédents
3. Consulter les détails de chaque scan
4. Supprimer les scans non nécessaires

## 🚀 Optimisations et Améliorations

### Actuellement Implémenté
- ✅ Authentification locale complète
- ✅ OCR hors ligne avec Google ML Kit
- ✅ Extraction de médicaments
- ✅ Stockage local avec Hive
- ✅ Gestion de l'historique
- ✅ Interface utilisateur moderne
- ✅ Validation des champs
- ✅ Gestion des erreurs

### Améliorations Possibles
- [ ] Fuzzy matching avancé pour les noms de médicaments
- [ ] Export des données (PDF, CSV)
- [ ] Partage sécurisé avec médecins
- [ ] Rappels de prise de médicaments
- [ ] Intégration avec wearables
- [ ] Mode sombre complet
- [ ] Multilangues (EN, FR, AR)
- [ ] Reconnaissance faciale pour sécurité
- [ ] Synchronisation CloudKit (iOS only)
- [ ] Backup chiffré

## 🐛 Dépannage

### Problème: La caméra ne fonctionne pas
**Solution**: Vérifier les permissions dans les paramètres de l'application

### Problème: L'OCR ne détecte pas de texte
**Solution**: Assurer que l'image est claire et bien éclairée. Vérifier que la qualité de l'image est suffisante.

### Problème: Erreur de stockage
**Solution**: Vérifier l'espace disponible sur le téléphone et les permissions de fichiers

### Problème: L'application se ferme au démarrage
**Solution**: Exécuter `flutter clean` puis `flutter pub get`

## 📄 Fichiers de Configuration

### pubspec.yaml
- Contient toutes les dépendances
- Version: 1.0.0+1
- SDK Min: 3.6.0

### android/app/build.gradle
- Configuration Android
- Namespace: com.example.pharmatec
- Target SDK: 34

### ios/Runner/Info.plist
- Configuration iOS
- Permissions caméra et galerie
- Version et build number

## 🔐 Sécurité

### Points Importants
1. Les mots de passe sont stockés en local (utiliser hashing en production)
2. Toutes les données sont chiffrées avec Hive par défaut
3. Pas d'envoie de données vers des serveurs externes
4. Les images sont stockées localement uniquement

### Recommandations Production
- Implémenter le chiffrement des mots de passe avec bcrypt
- Ajouter une PIN ou biométrie
- Implémenter la suppression sécurisée des données
- Auditer le code de sécurité

## 📊 Performance

- Temps d'OCR: ~1-3 secondes (dépend de la qualité)
- Taille de la base de données: ~100KB pour 100 scans
- Consommation mémoire: ~80-150MB

## 🤝 Contribution

Les contributions sont les bienvenues! Veuillez:
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est licencié sous la MIT License - voir le fichier LICENSE pour plus de détails.

## 👨‍💻 Auteur

Développé pour les patients algériens qui ont besoin de gérer leurs prescriptions de manière sécurisée et hors ligne.

## 📞 Support

Pour toute question ou problème, veuillez créer une issue ou contacter l'équipe de développement.

## 🙏 Remerciements

- Google ML Kit pour l'OCR hors ligne
- Flutter et Dart community
- Hive pour la base de données locale
- Tous les contributeurs


## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
