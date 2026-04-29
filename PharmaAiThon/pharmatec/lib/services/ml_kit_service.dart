import 'dart:io';
import 'package:google_ml_kit/google_ml_kit.dart';
import 'package:pharmatec/utils/medicine_list.dart';

/// ML Kit Service for OCR text recognition
class MLKitService {
  static final TextDetector _textRecognizer = GoogleMlKit.vision.textDetector();

  /// Process image for text recognition (OCR)
  static Future<Map<String, dynamic>> recognizeTextFromImage(
      String imagePath) async {
    try {
      final inputImage = InputImage.fromFilePath(imagePath);
      final recognizedText = await _textRecognizer.processImage(inputImage);

      String extractedText = recognizedText.text;

      // Extract medicines from recognized text
      List<String> medicines = MedicineList.extractMedicines(extractedText);

      return {
        'success': true,
        'rawText': extractedText,
        'medicines': medicines,
        'message': 'Texte extrait avec succès',
      };
    } catch (e) {
      return {
        'success': false,
        'rawText': '',
        'medicines': [],
        'message': 'Erreur lors de l\'extraction du texte: $e',
      };
    }
  }

  /// Process image with file object
  static Future<Map<String, dynamic>> recognizeTextFromFile(
      File imageFile) async {
    try {
      final inputImage = InputImage.fromFile(imageFile);
      final recognizedText = await _textRecognizer.processImage(inputImage);

      String extractedText = recognizedText.text;

      // Clean and extract medicines
      String cleanedText = MedicineList.cleanText(extractedText);
      List<String> medicines = MedicineList.extractMedicines(cleanedText);

      // If no medicines found, try fuzzy matching
      if (medicines.isEmpty) {
        medicines = MedicineList.extractMedicinesWithFuzzyMatch(cleanedText);
      }

      return {
        'success': true,
        'rawText': extractedText,
        'medicines': medicines,
        'message': 'Texte extrait avec succès',
      };
    } catch (e) {
      return {
        'success': false,
        'rawText': '',
        'medicines': [],
        'message': 'Erreur lors de l\'extraction du texte: $e',
      };
    }
  }

  /// Close text recognizer (clean up resources)
  static Future<void> closeRecognizer() async {
    await _textRecognizer.close();
  }

  /// Extract text from image with additional processing
  static Future<Map<String, dynamic>> recognizeTextWithProcessing(
    String imagePath, {
    bool useFuzzyMatching = true,
  }) async {
    try {
      final inputImage = InputImage.fromFilePath(imagePath);
      final recognizedText = await _textRecognizer.processImage(inputImage);

      String extractedText = recognizedText.text;

      // Clean text
      String cleanedText = MedicineList.cleanText(extractedText);

      // Extract medicines
      List<String> medicines = MedicineList.extractMedicines(cleanedText);

      // Try fuzzy matching if no results
      if (medicines.isEmpty && useFuzzyMatching) {
        medicines = MedicineList.extractMedicinesWithFuzzyMatch(cleanedText);
      }

      return {
        'success': true,
        'rawText': extractedText,
        'cleanedText': cleanedText,
        'medicines': medicines,
        'medicineCount': medicines.length,
        'message': 'Texte extrait avec succès',
      };
    } catch (e) {
      return {
        'success': false,
        'rawText': '',
        'cleanedText': '',
        'medicines': [],
        'medicineCount': 0,
        'message': 'Erreur lors de l\'extraction du texte: $e',
      };
    }
  }

  /// Extract all text blocks with bounding boxes
  static Future<Map<String, dynamic>> recognizeTextWithBlocks(
      String imagePath) async {
    try {
      final inputImage = InputImage.fromFilePath(imagePath);
      final recognizedText = await _textRecognizer.processImage(inputImage);

      List<Map<String, dynamic>> textBlocks = [];

      for (final TextBlock block in recognizedText.blocks) {
        textBlocks.add({
          'text': block.text,
          'rect': {
            'left': block.rect.left,
            'top': block.rect.top,
            'right': block.rect.right,
            'bottom': block.rect.bottom,
          },
        });
      }

      String fullText = recognizedText.text;
      List<String> medicines = MedicineList.extractMedicines(fullText);

      return {
        'success': true,
        'fullText': fullText,
        'textBlocks': textBlocks,
        'medicines': medicines,
        'blockCount': textBlocks.length,
        'message': 'Texte extrait avec blocs de texte',
      };
    } catch (e) {
      return {
        'success': false,
        'fullText': '',
        'textBlocks': [],
        'medicines': [],
        'blockCount': 0,
        'message': 'Erreur lors de l\'extraction du texte: $e',
      };
    }
  }
}
