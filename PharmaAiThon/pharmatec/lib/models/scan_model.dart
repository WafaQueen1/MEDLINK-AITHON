/// Scan Model for storing prescription scan data
class ScanModel {
  final String id;
  final String imagePath;
  final List<String> medicines;
  final DateTime date;
  final String rawText; // Raw OCR extracted text

  ScanModel({
    required this.id,
    required this.imagePath,
    required this.medicines,
    required this.date,
    required this.rawText,
  });

  /// Convert ScanModel to Map for Hive storage
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'imagePath': imagePath,
      'medicines': medicines,
      'date': date.toIso8601String(),
      'rawText': rawText,
    };
  }

  /// Create ScanModel from Map (from Hive)
  factory ScanModel.fromMap(Map<String, dynamic> map) {
    return ScanModel(
      id: map['id'] ?? '',
      imagePath: map['imagePath'] ?? '',
      medicines: List<String>.from(map['medicines'] ?? []),
      date: DateTime.parse(map['date'] ?? DateTime.now().toIso8601String()),
      rawText: map['rawText'] ?? '',
    );
  }

  /// Get formatted date
  String getFormattedDate() {
    return '${date.day}/${date.month}/${date.year} à ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }

  /// Get medicines as single string for display
  String getMedicinesAsString() {
    return medicines.join(', ');
  }
}
