# Fonctionnalités Détaillées - Smart Prescription Reader

## Vue d'ensemble des Fonctionnalités

Cette application offre un système complet de gestion de prescriptions médicales avec OCR basé sur l'IA.

---

## 1. Authentification Locale

### 1.1 Inscription (Sign Up)
**Ecran**: `SignupScreen`

**Champs collectés**:
- **Prénom** (obligatoire) - Texte libre
- **Nom** (obligatoire) - Texte libre
- **Âge** (obligatoire) - Nombre entre 1 et 150
- **Sexe** (obligatoire) - Dropdown (Male/Female)
- **Maladie chronique** (boolean) - Toggle
  - Si Oui → Champ texte pour le nom de la maladie
- **Numéro Chifa** (obligatoire) - Numérique
- **Email** (obligatoire) - Format valide requis
- **Mot de passe** (obligatoire) - Min. 6 caractères

**Validation**:
- Tous les champs obligatoires
- Email au format valide
- Mot de passe >= 6 caractères
- Âge entre 1-150
- Email unique (pas de doublons)

**Stockage**: Hive box `userBox`

**Service**: `AuthService.signup()`

### 1.2 Connexion (Login)
**Ecran**: `LoginScreen`

**Champs**:
- **Email** - Texte
- **Mot de passe** - Sécurisé

**Validation**:
- Email non vide
- Mot de passe non vide
- Vérification des credentials dans Hive

**Redirection**:
- Succès → HomeScreen
- Erreur → Message d'erreur

**Service**: `AuthService.login()`

### 1.3 Gestion de Profil
**Fonctionnalités**:
- Affichage des données utilisateur
- Modification de profil (implémentable)
- Suppression de compte (implémentable)

**Service**: `AuthService.updateProfile()` / `logout()`

---

## 2. Écran d'Accueil

**Ecran**: `HomeScreen`

**Composants**:

### 2.1 Message de Bienvenue
- Affiche le prénom de l'utilisateur
- "Bienvenue, [Prénom]"
- Zone stylisée avec icône

### 2.2 Actions Principales

**Bouton 1: Scanner une ordonnance**
- Texte: "Scanner une ordonnance"
- Icône: camera_alt
- Redirection: CameraScreen
- Style: Principal (vert, grande taille)

**Bouton 2: Historique**
- Texte: "Historique"
- Icône: history
- Redirection: HistoryScreen
- Style: Secondaire

**Bouton 3: Déconnecter**
- Texte: "Déconnecter"
- Icône: logout
- Action: Affiche confirmation
- Redirection: LoginScreen

### 2.3 Informations
- Message sur le mode hors ligne
- Icône information
- Rassure l'utilisateur sur la sécurité

---

## 3. Scanner de Prescriptions

**Ecran**: `CameraScreen`

### 3.1 Initialisation Caméra
- Détecte la caméra disponible
- Résolution haute
- Audio désactivé

### 3.2 Interface Camera
- Aperçu en direct
- Guide de cadrage (cadre de référence)
- Flash toggle en haut
- Bouton capture au bas

### 3.3 Capture Image
- Appui sur le bouton central
- Capture une photo
- Affichage loading
- Redirection vers ResultScreen

### 3.4 Flash Control
- Toggle On/Off
- Indication visuelle
- Icône adaptée

### 3.5 Gestion des Erreurs
- Permission camera refusée → Message
- Initialisation échouée → Affichage erreur
- Capture échouée → Retry

---

## 4. Extraction OCR (Intelligence Artificielle)

**Service**: `MLKitService`

### 4.1 Processus d'Extraction
1. Reçoit le chemin de l'image
2. Charge l'image avec InputImage
3. Utilise TextRecognizer de Google ML Kit
4. Extrait le texte brut

### 4.2 Traitement du Texte
1. **Nettoyage**:
   - Supprime les caractères spéciaux
   - Normalise les espaces
   - Trim des espacements

2. **Correspondance**:
   - Cherche chaque médicament de la liste
   - Utilise matching simple (case-insensitive)
   - Évite les doublons

3. **Fuzzy Matching** (optionnel):
   - Active si aucun résultat direct
   - Tolère 70% de correspondance
   - Corrige les fautes de frappe

### 4.3 Résultats Retournés
```dart
{
  'success': bool,
  'rawText': String,        // Texte complet extrait
  'medicines': List<String>, // Médicaments trouvés
  'medicineCount': int,      // Nombre de médicaments
  'message': String          // Message de statut
}
```

### 4.4 Liste de Médicaments (100+)
- Paracetamol, Augmentin, Doliprane, Amoxicillin, Ibuprofen
- Aspirin, Metformin, Lisinopril, Atorvastatin, Omeprazole
- Et 90+ autres médicaments courants

---

## 5. Édition des Résultats

**Ecran**: `ResultScreen`

### 5.1 Affichage des Résultats
- Image capturée (aperçu 250px)
- Nombre de médicaments détectés
- Liste éditable des médicaments
- Texte brut OCR (optionnel)

### 5.2 Édition des Médicaments
- Champs texte éditables pour chaque médicament
- Bouton X pour supprimer
- Bouton + pour ajouter un nouveau
- Validation en temps réel

### 5.3 Actions
- **Sauvegarder**: Enregistre dans Hive
- **Annuler**: Retour sans sauvegarder
- **Ajouter**: Ajoute un champ vide

### 5.4 Validation Avant Sauvegarde
- Au moins 1 médicament requis
- Supprime les champs vides
- Message d'erreur si aucun médicament

---

## 6. Sauvegarde des Scans

**Service**: `HiveService` + `ImageService`

### 6.1 Processus de Sauvegarde
1. Valide les données
2. Copie l'image dans `pharmatec_images/`
3. Crée un objet ScanModel
4. Génère un UUID unique
5. Sauvegarde dans Hive box `scanBox`
6. Affiche confirmation

### 6.2 Structure Sauvegardée
```dart
ScanModel(
  id: "uuid-unique",
  imagePath: "/path/to/image.jpg",
  medicines: ["Paracetamol", "Amoxicillin"],
  date: DateTime.now(),
  rawText: "Texte brut extrait...",
)
```

### 6.3 Chemins de Stockage
- **Android**: `Documents/pharmatec_images/`
- **iOS**: `Documents/pharmatec_images/`
- Format fichier: `prescription_TIMESTAMP.jpg`

### 6.4 Métadonnées
- ID unique (UUID v4)
- Timestamp automatique
- Informations de compression

---

## 7. Historique des Scans

**Ecran**: `HistoryScreen`

### 7.1 Affichage des Scans
- Grille/Liste de tous les scans
- Organisés du plus récent au plus ancien
- Pré-chargement automatique

### 7.2 Informations par Scan
- Image de la prescription
- Date et heure formatées
- Nombre de médicaments
- Tous les médicaments affichés
- Bouton suppression

### 7.3 Actions
- **Supprimer un scan**:
  - Bouton X ou delete
  - Confirmation avant suppression
  - Supprime image et données Hive

- **Supprimer tous les scans**:
  - Menu actions
  - Confirmation double
  - Nettoie Hive et fichiers

### 7.4 Interface Vide
- Message si aucun scan
- Icône vide
- Suggestion pour scanner

### 7.5 Gestion des Fichiers
- Vérification d'existence des images
- Affichage d'un placeholder si manquant
- Suppression des fichiers lors de delete

---

## 8. Services et Modèles de Données

### 8.1 HiveService
**Fonctions principales**:
- `initializeHive()`: Initialisation
- `saveUser()`, `getUser()`, `deleteUser()`
- `saveScan()`, `getScan()`, `getAllScans()`, `deleteScan()`
- `clearAllData()`: Réinitialisation

### 8.2 AuthService
**Fonctions principales**:
- `signup(UserModel)`: Enregistrement
- `login(email, password)`: Connexion
- `logout()`: Déconnexion
- `getCurrentUser()`: Utilisateur actuel
- `isLoggedIn()`: Vérification statut
- `updateProfile(UserModel)`: Modification

### 8.3 MLKitService
**Fonctions principales**:
- `recognizeTextFromImage(path)`: OCR simple
- `recognizeTextFromFile(file)`: OCR depuis fichier
- `recognizeTextWithProcessing()`: OCR avancé
- `recognizeTextWithBlocks()`: OCR avec blocs

### 8.4 ImageService
**Fonctions principales**:
- `saveImage(path)`: Enregistrement
- `saveCompressedImage()`: Compression
- `deleteImage(path)`: Suppression
- `imageExists()`: Vérification
- `getStorageStats()`: Statistiques

### 8.5 MedicineList
**Fonctions principales**:
- `extractMedicines(text)`: Extraction simple
- `extractMedicinesWithFuzzyMatch()`: Extraction fuzzy
- `cleanText(text)`: Nettoyage
- `isMedicineLike()`: Validation

---

## 9. Widgets Personnalisés

### 9.1 CustomTextField
- Label au-dessus
- Hint interne
- Icône préfixe optionnelle
- Toggle pour mots de passe
- Validation optionnelle
- Style moderne avec bordures

### 9.2 CustomButton
- Couleur customizable
- État loading avec spinner
- Bordures arrondies
- Padding adaptable
- Hauteur configurable

### 9.3 CustomDropdown
- Label au-dessus
- Sélection parmi liste
- Icône préfixe optionnelle
- Style cohérent

### 9.4 CustomToggle
- Label à gauche
- Switch animé
- Couleur primaire

### 9.5 LoadingOverlay
- Écran semi-transparent
- Spinner centré
- Message optionnel
- Peut-être désactivé

---

## 10. Gestion des Erreurs

### 10.1 Erreurs de Validation
- Champ vide → Message spécifique
- Format invalide → Aide utilisateur
- Doublons → "Utilisateur existe déjà"

### 10.2 Erreurs Caméra
- Permission refusée → Demande d'accès
- Initialisation échouée → Suggestion retry
- Capture échouée → Retry automatique

### 10.3 Erreurs OCR
- Image invalide → "Impossible d'extraire le texte"
- Format non supporté → Message d'erreur
- Aucun texte détecté → Suggestion amélioration

### 10.4 Erreurs de Stockage
- Pas d'espace → Message clair
- Permission refusée → Instructions
- Fichier manquant → Placeholder

---

## 11. Fonctionnalités Avancées

### 11.1 Fuzzy Matching
- Tolère les fautes de frappe
- Seuil de 70% requis
- Active uniquement sans résultats

### 11.2 Compression d'Image
- Redimensionne les grandes images
- Qualité 85% JPEG
- Économise l'espace

### 11.3 Statistiques de Stockage
- Total de scans
- Taille totale
- Répartition des fichiers

### 11.4 Export de Données
- Chemins locaux maintenus
- Possibilité de backup
- Métadonnées préservées

---

## 12. UX/UI Features

### 12.1 Navigation
- Stack-based (MaterialPageRoute)
- Confirmation pour actions importantes
- Messages de feedback via Snackbar

### 12.2 Design System
- Couleur primaire: #2E7D32 (vert médical)
- Material Design 3
- Espacement cohérent
- Gradients subtils

### 12.3 Indicateurs de Chargement
- Spinner pour opérations longues
- Overlay semi-transparent
- Messages explicites

### 12.4 Accessibilité
- Contrastes suffisants
- Icônes claires
- Textes lisibles
- Tailles tactiles adéquates

---

## Résumé des Fonctionnalités

| Catégorie | Statut | Détail |
|-----------|--------|--------|
| Authentification | ✅ | Login/Signup local |
| Scanner | ✅ | Camera + Flash |
| OCR | ✅ | Google ML Kit |
| Extraction | ✅ | 100+ médicaments |
| Édition | ✅ | Modify/Add/Delete |
| Stockage | ✅ | Hive + Local Files |
| Historique | ✅ | Liste avec aperçu |
| Validation | ✅ | Complète |
| Erreurs | ✅ | Gestion robuste |
| Design | ✅ | Material Design 3 |
