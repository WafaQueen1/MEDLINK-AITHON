import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:intl/intl.dart';
import 'package:image/image.dart' as img;

/// Image Service for handling prescription image storage
class ImageService {
  /// Get application documents directory for storing images
  static Future<String> getImagesDirectory() async {
    final Directory appDir = await getApplicationDocumentsDirectory();
    final Directory imagesDir = Directory('${appDir.path}/pharmatec_images');

    if (!await imagesDir.exists()) {
      await imagesDir.create(recursive: true);
    }

    return imagesDir.path;
  }

  /// Save image from path to local storage
  static Future<String?> saveImage(String sourcePath) async {
    try {
      final String imagesDir = await getImagesDirectory();
      final String fileName =
          'prescription_${DateTime.now().millisecondsSinceEpoch}.jpg';
      final String destinationPath = '$imagesDir/$fileName';

      final File sourceFile = File(sourcePath);
      final File savedFile = await sourceFile.copy(destinationPath);

      return savedFile.path;
    } catch (e) {
      print('Erreur lors de la sauvegarde de l\'image: $e');
      return null;
    }
  }

  /// Save image from file
  static Future<String?> saveImageFromFile(File imageFile) async {
    try {
      final String imagesDir = await getImagesDirectory();
      final String fileName =
          'prescription_${DateTime.now().millisecondsSinceEpoch}.jpg';
      final String destinationPath = '$imagesDir/$fileName';

      final File savedFile = await imageFile.copy(destinationPath);
      return savedFile.path;
    } catch (e) {
      print('Erreur lors de la sauvegarde de l\'image: $e');
      return null;
    }
  }

  /// Compress image before storing
  static Future<String?> saveCompressedImage(String sourcePath,
      {int quality = 85}) async {
    try {
      final File sourceFile = File(sourcePath);
      final img.Image? image = img.decodeImage(await sourceFile.readAsBytes());

      if (image == null) return null;

      // Resize if too large
      img.Image resized = img.copyResize(
        image,
        width: image.width > 1920 ? 1920 : image.width,
        height: image.height > 1920 ? 1920 : image.height,
      );

      // Encode with specified quality
      final List<int> compressed = img.encodeJpg(resized, quality: quality);

      final String imagesDir = await getImagesDirectory();
      final String fileName =
          'prescription_${DateTime.now().millisecondsSinceEpoch}.jpg';
      final String destinationPath = '$imagesDir/$fileName';

      final File savedFile =
          await File(destinationPath).writeAsBytes(compressed);
      return savedFile.path;
    } catch (e) {
      print('Erreur lors de la compression de l\'image: $e');
      return null;
    }
  }

  /// Delete image from storage
  static Future<bool> deleteImage(String imagePath) async {
    try {
      final File file = File(imagePath);
      if (await file.exists()) {
        await file.delete();
        return true;
      }
      return false;
    } catch (e) {
      print('Erreur lors de la suppression de l\'image: $e');
      return false;
    }
  }

  /// Check if image exists
  static Future<bool> imageExists(String imagePath) async {
    try {
      final File file = File(imagePath);
      return await file.exists();
    } catch (e) {
      return false;
    }
  }

  /// Get image file size in KB
  static Future<double> getImageSizeKB(String imagePath) async {
    try {
      final File file = File(imagePath);
      if (await file.exists()) {
        final int bytes = await file.length();
        return bytes / 1024; // Convert to KB
      }
      return 0;
    } catch (e) {
      return 0;
    }
  }

  /// Get all stored images
  static Future<List<File>> getAllStoredImages() async {
    try {
      final String imagesDir = await getImagesDirectory();
      final Directory dir = Directory(imagesDir);
      final List<FileSystemEntity> files = await dir.list().toList();

      return files
          .where((file) => file is File && _isImageFile(file.path))
          .cast<File>()
          .toList();
    } catch (e) {
      print('Erreur lors de la lecture des images: $e');
      return [];
    }
  }

  /// Check if file is an image
  static bool _isImageFile(String path) {
    final List<String> imageExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp'
    ];
    final String lowerPath = path.toLowerCase();
    return imageExtensions.any((ext) => lowerPath.endsWith(ext));
  }

  /// Clear all stored images
  static Future<bool> clearAllImages() async {
    try {
      final String imagesDir = await getImagesDirectory();
      final Directory dir = Directory(imagesDir);

      if (await dir.exists()) {
        await dir.delete(recursive: true);
        await dir.create(recursive: true);
      }

      return true;
    } catch (e) {
      print('Erreur lors de la suppression des images: $e');
      return false;
    }
  }

  /// Generate unique filename for prescription
  static String generateFileName() {
    final DateTime now = DateTime.now();
    final String formattedDate = DateFormat('yyyyMMdd_HHmmss').format(now);
    return 'prescription_$formattedDate.jpg';
  }

  /// Get storage usage statistics
  static Future<Map<String, dynamic>> getStorageStats() async {
    try {
      final String imagesDir = await getImagesDirectory();
      final List<File> images = await getAllStoredImages();

      int totalBytes = 0;
      for (File file in images) {
        totalBytes += await file.length();
      }

      return {
        'totalImages': images.length,
        'totalSizeBytes': totalBytes,
        'totalSizeKB': totalBytes / 1024,
        'totalSizeMB': totalBytes / (1024 * 1024),
        'directory': imagesDir,
      };
    } catch (e) {
      return {
        'error': 'Erreur lors du calcul des statistiques: $e',
      };
    }
  }
}
