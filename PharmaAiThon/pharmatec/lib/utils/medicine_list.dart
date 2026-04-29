/// List of predefined medicines for matching
class MedicineList {
  static const List<String> commonMedicines = [
    'Paracetamol',
    'Augmentin',
    'Doliprane',
    'Amoxicillin',
    'Ibuprofen',
    'Aspirin',
    'Metformin',
    'Lisinopril',
    'Atorvastatin',
    'Omeprazole',
    'Amoxicilline',
    'Cefalexin',
    'Cephalexin',
    'Azithromycin',
    'Ciprofloxacin',
    'Tetracycline',
    'Doxycycline',
    'Fluconazole',
    'Ketoconazole',
    'Tramadol',
    'Codeine',
    'Morphine',
    'Diclofenac',
    'Naproxen',
    'Indomethacin',
    'Piroxicam',
    'Meloxicam',
    'Celecoxib',
    'Atorvastatin',
    'Simvastatin',
    'Pravastatin',
    'Rosuvastatin',
    'Lovastatin',
    'Amlodipine',
    'Diltiazem',
    'Verapamil',
    'Nifedipine',
    'Labetalol',
    'Propranolol',
    'Metoprolol',
    'Atenolol',
    'Bisoprolol',
    'Losartan',
    'Valsartan',
    'Irbesartan',
    'Telmisartan',
    'Olmesartan',
    'Furosemide',
    'Hydrochlorothiazide',
    'Chlorothiazide',
    'Spironolactone',
    'Amiloride',
    'Captopril',
    'Enalapril',
    'Lisinopril',
    'Ramipril',
    'Perindopril',
    'Insulin',
    'Glipizide',
    'Glyburide',
    'Sitagliptin',
    'Metformine',
    'Albuterol',
    'Salbutamol',
    'Terbutaline',
    'Salmeterol',
    'Formoterol',
    'Ipratropium',
    'Theophylline',
    'Prednisone',
    'Prednisolone',
    'Dexamethasone',
    'Methylprednisolone',
    'Hydrocortisone',
    'Fluticasone',
    'Beclomethasone',
    'Triamcinolone',
    'Lansoprazole',
    'Pantoprazole',
    'Rabeprazole',
    'Esomeprazole',
    'Ranitidine',
    'Famotidine',
    'Cimetidine',
    'Sucralfate',
    'Antacid',
    'Loperamide',
    'Bismuth',
    'Metoclopramide',
    'Domperidone',
    'Ondansetron',
    'Granisetron',
    'Loratadine',
    'Cetirizine',
    'Fexofenadine',
    'Desloratadine',
    'Diphenhydramine',
    'Chlorpheniramine',
    'Promethazine',
  ];

  /// Extract medicines from text using simple matching
  static List<String> extractMedicines(String text) {
    List<String> foundMedicines = [];
    String lowerText = text.toLowerCase();

    for (String medicine in commonMedicines) {
      if (lowerText.contains(medicine.toLowerCase())) {
        // Avoid duplicates
        if (!foundMedicines
            .any((m) => m.toLowerCase() == medicine.toLowerCase())) {
          foundMedicines.add(medicine);
        }
      }
    }

    return foundMedicines;
  }

  /// Simple fuzzy matching for spelling variations
  static List<String> extractMedicinesWithFuzzyMatch(String text) {
    List<String> foundMedicines = [];
    String lowerText = text.toLowerCase();

    for (String medicine in commonMedicines) {
      String lowerMedicine = medicine.toLowerCase();

      // Exact match
      if (lowerText.contains(lowerMedicine)) {
        if (!foundMedicines
            .any((m) => m.toLowerCase() == medicine.toLowerCase())) {
          foundMedicines.add(medicine);
        }
        continue;
      }

      // Fuzzy match - check if at least 70% of characters match
      if (_fuzzyMatch(lowerText, lowerMedicine)) {
        if (!foundMedicines
            .any((m) => m.toLowerCase() == medicine.toLowerCase())) {
          foundMedicines.add(medicine);
        }
      }
    }

    return foundMedicines;
  }

  /// Simple fuzzy matching algorithm
  static bool _fuzzyMatch(String text, String pattern) {
    if (pattern.length > text.length) return false;

    int matched = 0;
    int patternIndex = 0;

    for (int i = 0; i < text.length && patternIndex < pattern.length; i++) {
      if (text[i] == pattern[patternIndex]) {
        matched++;
        patternIndex++;
      }
    }

    // If we matched at least 70% of the pattern
    return matched >= (pattern.length * 0.7);
  }

  /// Check if a string is a valid medicine name (with some tolerance)
  static bool isMedicineLike(String text) {
    // Medicine names are usually 3+ characters and start with a letter
    if (text.length < 3) return false;
    if (!text[0].contains(RegExp(r'[a-zA-Z]'))) return false;
    return true;
  }

  /// Clean extracted text to improve medicine extraction
  static String cleanText(String text) {
    // Remove special characters but keep spaces and letters/numbers
    text = text.replaceAll(RegExp(r'[^\w\s\-]'), ' ');
    // Remove multiple spaces
    text = text.replaceAll(RegExp(r'\s+'), ' ');
    // Trim
    text = text.trim();
    return text;
  }
}
