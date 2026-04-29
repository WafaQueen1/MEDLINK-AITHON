import 'package:pharmatec/services/api_service.dart';

class PharmacyService {
  /// Get all pharmacies with their medicines from the database
  static Future<List<Map<String, dynamic>>> getPharmacies() async {
    try {
      print('🔍 [PharmacyService] Fetching pharmacies from API...');

      final response = await ApiService.get('/public/pharmacies');

      print('🔍 [PharmacyService] Response: $response');

      if (response['success'] == true && response['data'] != null) {
        final pharmaciesData = response['data'] as List<dynamic>;

        final pharmacies = pharmaciesData
            .map((pharmacy) => Map<String, dynamic>.from(pharmacy))
            .toList();

        print('🔍 [PharmacyService] Found ${pharmacies.length} pharmacies');
        return pharmacies;
      }

      print('🔍 [PharmacyService] No pharmacies found or invalid response');
      return [];
    } catch (error) {
      print('🔍 [PharmacyService] Error fetching pharmacies: $error');
      return [];
    }
  }

  /// Search medicines in nearby pharmacies
  static Future<List<Map<String, dynamic>>> searchMedicines(
    List<String> medicines, {
    double? latitude,
    double? longitude,
    double radiusKm = 10,
  }) async {
    try {
      print('🔍 [PharmacyService] Searching medicines: $medicines');

      final requestBody = {
        'medicines': medicines,
        if (latitude != null) 'latitude': latitude,
        if (longitude != null) 'longitude': longitude,
        'radiusKm': radiusKm,
      };

      final response = await ApiService.post(
        '/public/pharmacies/search',
        body: requestBody,
      );

      print('🔍 [PharmacyService] Search response: $response');

      if (response['success'] == true && response['results'] != null) {
        final results = response['results'] as List<dynamic>;

        final pharmacies = results
            .map((pharmacy) => Map<String, dynamic>.from(pharmacy))
            .toList();

        print(
            '🔍 [PharmacyService] Found ${pharmacies.length} pharmacies with medicines');
        return pharmacies;
      }

      print('🔍 [PharmacyService] No results found');
      return [];
    } catch (error) {
      print('🔍 [PharmacyService] Error searching medicines: $error');
      return [];
    }
  }
}
