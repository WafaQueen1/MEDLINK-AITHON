import 'package:pharmatec/services/pharmacy_service.dart';

class PharmacyInfo {
  final String id;
  final String name;
  final String address;
  final String phone;
  final double distanceKm;
  final List<String> availableMedicines;
  final double? latitude;
  final double? longitude;

  const PharmacyInfo({
    required this.id,
    required this.name,
    required this.address,
    required this.phone,
    this.distanceKm = 0.0,
    required this.availableMedicines,
    this.latitude,
    this.longitude,
  });

  factory PharmacyInfo.fromApi(Map<String, dynamic> map) {
    final medicinesRaw = map['availableMedicines'] as List<dynamic>? ?? [];
    final medicines = medicinesRaw
        .map((med) {
          if (med is Map<String, dynamic>) {
            return (med['name'] ?? '').toString();
          }
          return med.toString();
        })
        .where((name) => name.isNotEmpty)
        .toList();

    return PharmacyInfo(
      id: map['id']?.toString() ?? '',
      name: map['name']?.toString() ?? 'Pharmacie',
      address: map['address']?.toString() ?? '',
      phone: map['phone']?.toString() ?? '',
      distanceKm: _toDouble(map['distanceKm']) ?? 0.0,
      availableMedicines: medicines,
      latitude: _toDouble(map['latitude']),
      longitude: _toDouble(map['longitude']),
    );
  }

  static double? _toDouble(dynamic value) {
    if (value == null) return null;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    return double.tryParse(value.toString());
  }
}

class PharmacyMatch {
  final PharmacyInfo pharmacy;
  final List<String> matchingMedicines;
  final List<String> missingMedicines;

  const PharmacyMatch({
    required this.pharmacy,
    required this.matchingMedicines,
    required this.missingMedicines,
  });

  bool get hasAllMedicines => missingMedicines.isEmpty;
}

class PharmacyInventory {
  /// Find pharmacy matches from API database
  static Future<List<PharmacyMatch>> findMatchesFromApi(
    List<String> selectedMedicines,
  ) async {
    try {
      print('🔍 [PharmacyInventory] Fetching pharmacies from API...');

      final pharmaciesData =
          await PharmacyService.searchMedicines(selectedMedicines);

      if (pharmaciesData.isEmpty) {
        print('🔍 [PharmacyInventory] No pharmacies found');
        return [];
      }

      print('🔍 [PharmacyInventory] Found ${pharmaciesData.length} pharmacies');

      // Convert API response to PharmacyInfo objects
      final pharmacyInfos =
          pharmaciesData.map((data) => PharmacyInfo.fromApi(data)).toList();

      // Find matches
      return _findMatches(selectedMedicines, pharmacyInfos);
    } catch (error) {
      print('🔍 [PharmacyInventory] Error fetching from API: $error');
      return [];
    }
  }

  /// Find matches from API (primary method)
  /// Internal method to find matches
  static List<PharmacyMatch> _findMatches(
    List<String> selectedMedicines,
    List<PharmacyInfo> pharmacyList,
  ) {
    final normalizedMedicines = selectedMedicines
        .map((medicine) => medicine.trim())
        .where((medicine) => medicine.isNotEmpty)
        .toSet()
        .toList();

    if (normalizedMedicines.isEmpty) {
      return [];
    }

    final matches = pharmacyList
        .map((pharmacy) {
          final stock = pharmacy.availableMedicines.map(_normalize).toSet();

          final matchingMedicines = normalizedMedicines
              .where((medicine) => stock.contains(_normalize(medicine)))
              .toList();

          final missingMedicines = normalizedMedicines
              .where((medicine) => !stock.contains(_normalize(medicine)))
              .toList();

          return PharmacyMatch(
            pharmacy: pharmacy,
            matchingMedicines: matchingMedicines,
            missingMedicines: missingMedicines,
          );
        })
        .where((match) => match.matchingMedicines.isNotEmpty)
        .toList();

    matches.sort((a, b) {
      if (a.hasAllMedicines != b.hasAllMedicines) {
        return a.hasAllMedicines ? -1 : 1;
      }

      final matchCount = b.matchingMedicines.length.compareTo(
        a.matchingMedicines.length,
      );
      if (matchCount != 0) {
        return matchCount;
      }

      return a.pharmacy.distanceKm.compareTo(b.pharmacy.distanceKm);
    });

    return matches;
  }

  static String _normalize(String value) {
    return value.trim().toLowerCase();
  }
}
