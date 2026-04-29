# Guide de Démarrage Rapide - Smart Prescription Reader

## 🚀 Démarrage en 5 minutes

### 1. Installation des Dépendances
```bash
cd pharmatec
flutter pub get
```

### 2. Vérifier la Configuration
```bash
flutter doctor
```

### 3. Lancer l'Application
```bash
flutter run
```

### 4. Premiers Pas
1. **S'inscrire**: Remplissez vos informations
2. **Se connecter**: Email + Mot de passe
3. **Scanner**: Prenez une photo d'une ordonnance
4. **Vérifier**: Confirmez les médicaments détectés
5. **Sauvegarder**: Enregistrez le scan

---

## 📋 Checklist d'Installation

- [ ] Flutter installé (3.6.0+)
- [ ] Dart installé (3.0.0+)
- [ ] Android SDK 21+ ou iOS 13.0+
- [ ] Dépendances récupérées (`flutter pub get`)
- [ ] Permissions configurées (caméra, stockage)
- [ ] Hive initialisé
- [ ] Google ML Kit configuré

---

## 🔧 Configuration Minimale

### pubspec.yaml
```yaml
dependencies:
  flutter: sdk: flutter
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  camera: ^0.10.6
  image_picker: ^1.0.4
  google_ml_kit: ^0.7.3
  path_provider: ^2.1.1
  intl: ^0.19.0
  uuid: ^4.0.0
```

### AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### Info.plist (iOS)
```xml
<key>NSCameraUsageDescription</key>
<string>Accès caméra pour scanner ordonnances</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Accès galerie photo</string>
```

---

## 📁 Structure Clé du Projet

```
lib/
├── main.dart                     # Point d'entrée
├── models/
│   ├── user_model.dart          # Utilisateur
│   └── scan_model.dart          # Scan
├── services/
│   ├── auth_service.dart        # Authentification
│   ├── hive_service.dart        # Base de données
│   ├── ml_kit_service.dart      # OCR
│   └── image_service.dart       # Images
├── screens/
│   ├── login_screen.dart        # Connexion
│   ├── signup_screen.dart       # Inscription
│   ├── home_screen.dart         # Accueil
│   ├── camera_screen.dart       # Caméra
│   ├── result_screen.dart       # Résultats
│   └── history_screen.dart      # Historique
└── widgets/
    ├── custom_widgets.dart      # Composants
    └── root_widget.dart         # App root
```

---

## 🎯 Flux Utilisateur Principal

```
Démarrage
  ↓
Authentification (Login/Signup)
  ↓
Home Screen
  ├─→ Scan Prescription
  │    ├─→ Camera Screen
  │    ├─→ OCR Processing
  │    ├─→ Result Screen (Edit)
  │    └─→ Save → History
  │
  ├─→ View History
  │    ├─→ Voir scans
  │    ├─→ Supprimer scans
  │    └─→ Retour Home
  │
  └─→ Logout → Login Screen
```

---

## 💡 Points Importants

### Hive Database
- Initialisation automatique dans `main()`
- Box "userBox": Stockage utilisateur
- Box "scanBox": Stockage scans
- Pas de serveur requis

### Google ML Kit
- Fonctionne 100% hors ligne
- Reconnaissance textuelle locale
- Pas d'accès Internet requis
- Précision: ~85-95% sur documents clairs

### Image Storage
- Chemin: `Documents/pharmatec_images/`
- Format: JPEG avec compression
- Nettoyage: Suppression manuelle via UI

### Permissions Runtime
- Android: Demandes dynamiques
- iOS: Demandes au premier usage

---

## 🐛 Troubleshooting Rapide

| Problème | Solution |
|----------|----------|
| App plante au démarrage | `flutter clean && flutter pub get` |
| Caméra ne fonctionne pas | Vérifier permissions (Paramètres > Pharmatec) |
| OCR ne détecte rien | Image de mauvaise qualité, relancer |
| Pas d'espace disque | Supprimer scans anciens, vider cache |
| Google ML Kit erreur | Redémarrer l'app, ou réinstaller |

---

## 📚 Documentation

- **README.md**: Vue d'ensemble complète
- **SETUP_GUIDE.md**: Configuration détaillée
- **FEATURES.md**: Toutes les fonctionnalités
- **QUICK_START.md**: Ce fichier (démarrage rapide)

---

## 🎬 Démonstration

### Créer un Compte Test
```
Prénom: Jean
Nom: Dupont
Âge: 35
Sexe: Male
Maladie: Non
Chifa: 123456789
Email: test@example.com
Mot de passe: test123456
```

### Scanner une Ordonnance Test
1. Prenez une photo d'un document texte
2. L'OCR extraira le texte
3. Affichera les médicaments détectés
4. Éditez et sauvegardez

---

## 🔐 Sécurité Basique

- ✅ Données stockées localement uniquement
- ✅ Pas d'envoi vers serveurs externes
- ✅ Pas de connexion Internet requise
- ⚠️ Les mots de passe sont stockés en clair (à améliorer en production)

---

## 📊 Spécifications

| Aspect | Valeur |
|--------|--------|
| Min. SDK Android | 21 |
| Min. iOS | 13.0 |
| Min. Flutter | 3.6.0 |
| Taille App | ~50-80 MB |
| Stockage BD | ~100 KB pour 100 scans |
| Mémoire | 80-150 MB |

---

## 🚀 Prochaines Étapes

1. **Tester localement**: `flutter run`
2. **Créer un compte**: Inscription
3. **Scanner une ordonnance**: Test OCR
4. **Explorer l'historique**: Voir les scans
5. **Personnaliser**: Adapter à vos besoins

---

## ❓ FAQ Rapide

**Q: L'app fonctionne sans Internet?**
A: Oui, 100% offline.

**Q: Où sont stockées les données?**
A: Localement dans Hive et Documents/

**Q: Peut-on exporter les données?**
A: Oui, via les fichiers locaux.

**Q: Comment supprimer toutes les données?**
A: Désinstaller l'app ou utiliser l'option reset.

**Q: La caméra est obligatoire?**
A: Oui, pour scanner les prescriptions.

---

## 📞 Support

- Voir README.md pour documentation complète
- Voir SETUP_GUIDE.md pour configuration
- Voir FEATURES.md pour fonctionnalités détaillées

---

**Bonne utilisation de Smart Prescription Reader! 🎉**
