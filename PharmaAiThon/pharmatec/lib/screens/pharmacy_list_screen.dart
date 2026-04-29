import 'package:flutter/material.dart';
import 'package:pharmatec/screens/history_screen.dart';
import 'package:pharmatec/screens/pharmacy_map_screen.dart';
import 'package:pharmatec/utils/pharmacy_inventory.dart';
import 'package:pharmatec/services/location_service.dart';
import 'package:pharmatec/services/pharmacy_service.dart';
import 'package:pharmatec/theme/app_theme.dart';

class PharmacyListScreen extends StatefulWidget {
  final List<String> medicines;
  final bool showSavedBanner;
  final String? scanDateLabel;

  const PharmacyListScreen({
    super.key,
    required this.medicines,
    this.showSavedBanner = false,
    this.scanDateLabel,
  });

  @override
  State<PharmacyListScreen> createState() => _PharmacyListScreenState();
}

class _PharmacyListScreenState extends State<PharmacyListScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  List<PharmacyMatch> _allMatches = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPharmacies();
  }

  Future<void> _loadPharmacies() async {
    try {
      print('🔍 [PharmacyListScreen] Loading pharmacies...');

      // Get user location
      final position = await LocationService.getCurrentLocation();
      double? latitude;
      double? longitude;

      if (position != null) {
        latitude = position.latitude;
        longitude = position.longitude;
        print(
            '🔍 [PharmacyListScreen] Got user location: $latitude, $longitude');
      } else {
        print(
            '🔍 [PharmacyListScreen] Could not get location, showing all pharmacies');
      }

      // Search medicines with location
      final pharmaciesData = await PharmacyService.searchMedicines(
        widget.medicines,
        latitude: latitude,
        longitude: longitude,
      );

      if (pharmaciesData.isEmpty) {
        print('🔍 [PharmacyListScreen] No pharmacies found');
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
        }
        return;
      }

      // Convert to PharmacyMatch objects
      final matches = pharmaciesData.map((data) {
        final pharmacy = PharmacyInfo.fromApi(data);
        return PharmacyMatch(
          pharmacy: pharmacy,
          matchingMedicines:
              (data['availableMedicines'] as List<dynamic>?)?.map((med) {
                    if (med is Map<String, dynamic>) {
                      return (med['name'] ?? '').toString();
                    }
                    return med.toString();
                  }).toList() ??
                  [],
          missingMedicines: [],
        );
      }).toList();

      if (mounted) {
        setState(() {
          _allMatches = matches;
          _isLoading = false;
        });
        print('🔍 [PharmacyListScreen] Loaded ${matches.length} matches');
      }
    } catch (e) {
      print('🔍 [PharmacyListScreen] Error loading pharmacies: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  List<PharmacyMatch> get _matches {
    if (_searchQuery.trim().isEmpty) {
      return _allMatches;
    }

    final query = _searchQuery.trim().toLowerCase();
    return _allMatches.where((match) {
      final matchesMedicine = match.matchingMedicines.any(
        (medicine) => medicine.toLowerCase().contains(query),
      );
      final matchesMissingMedicine = match.missingMedicines.any(
        (medicine) => medicine.toLowerCase().contains(query),
      );
      final matchesPharmacyName =
          match.pharmacy.name.toLowerCase().contains(query);
      return matchesMedicine || matchesMissingMedicine || matchesPharmacyName;
    }).toList();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final matches = _matches;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pharmacies proches'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Success Banner
            if (widget.showSavedBanner)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: AppColors.success.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(AppSpacing.lg),
                  border: Border.all(
                    color: AppColors.success.withOpacity(0.3),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.check_circle,
                      color: AppColors.success,
                      size: 24,
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Text(
                        'Ordonnance enregistrée avec succès!',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.success,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            if (widget.showSavedBanner) const SizedBox(height: AppSpacing.lg),

            // Medicines Info
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.lg),
              decoration: BoxDecoration(
                color: AppColors.secondary.withOpacity(0.08),
                borderRadius: BorderRadius.circular(AppSpacing.lg),
                border: Border.all(
                  color: AppColors.secondary.withOpacity(0.2),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Médicaments de l\'ordonnance',
                    style: AppTypography.titleMedium,
                  ),
                  if (widget.scanDateLabel != null) ...[
                    const SizedBox(height: AppSpacing.xs),
                    Text(
                      'Scan du ${widget.scanDateLabel}',
                      style: AppTypography.labelSmall,
                    ),
                  ],
                  const SizedBox(height: AppSpacing.md),
                  Text(
                    widget.medicines.isEmpty
                        ? 'Aucun médicament'
                        : widget.medicines.join(', '),
                    style: AppTypography.bodySmall,
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.xl),

            // Search
            TextField(
              controller: _searchController,
              onChanged: (value) {
                setState(() {
                  _searchQuery = value;
                });
              },
              decoration: InputDecoration(
                hintText: 'Rechercher',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _searchQuery = '');
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppSpacing.lg),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.xl),

            // Results
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Pharmacies trouvées',
                  style: AppTypography.titleMedium,
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.md,
                    vertical: AppSpacing.xs,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(AppSpacing.lg),
                  ),
                  child: Text(
                    '${matches.length}',
                    style: AppTypography.labelMedium.copyWith(
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.lg),

            // Pharmacy List
            if (_isLoading)
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.xxl),
                  child: const CircularProgressIndicator(),
                ),
              )
            else if (matches.isEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: AppColors.warning.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(AppSpacing.lg),
                ),
                child: Text(
                  _searchQuery.isEmpty
                      ? 'Aucune pharmacie trouvée'
                      : 'Aucun résultat pour "$_searchQuery"',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.warning,
                  ),
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: matches.length,
                separatorBuilder: (_, __) =>
                    const SizedBox(height: AppSpacing.lg),
                itemBuilder: (context, index) {
                  final match = matches[index];
                  return Container(
                    padding: const EdgeInsets.all(AppSpacing.lg),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(AppSpacing.lg),
                      border: Border.all(
                        color: match.hasAllMedicines
                            ? AppColors.success.withOpacity(0.3)
                            : AppColors.warning.withOpacity(0.3),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                match.pharmacy.name,
                                style: AppTypography.titleMedium,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: AppSpacing.md,
                                vertical: AppSpacing.xs,
                              ),
                              decoration: BoxDecoration(
                                color: match.hasAllMedicines
                                    ? AppColors.success.withOpacity(0.1)
                                    : AppColors.warning.withOpacity(0.1),
                                borderRadius:
                                    BorderRadius.circular(AppSpacing.md),
                              ),
                              child: Text(
                                match.hasAllMedicines ? 'Complet' : 'Partiel',
                                style: AppTypography.labelSmall.copyWith(
                                  color: match.hasAllMedicines
                                      ? AppColors.success
                                      : AppColors.warning,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: AppSpacing.md),
                        Text(
                          '📍 ${match.pharmacy.address}',
                          style: AppTypography.bodySmall,
                        ),
                        const SizedBox(height: AppSpacing.xs),
                        Text(
                          '📞 ${match.pharmacy.phone}',
                          style: AppTypography.bodySmall,
                        ),
                        const SizedBox(height: AppSpacing.xs),
                        Text(
                          '📏 ${match.pharmacy.distanceKm.toStringAsFixed(1)} km',
                          style: AppTypography.bodySmall,
                        ),
                        const SizedBox(height: AppSpacing.md),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (_) => PharmacyMapScreen(
                                    pharmacy: match.pharmacy,
                                  ),
                                ),
                              );
                            },
                            icon: const Icon(Icons.location_on, size: 18),
                            label: const Text('Voir sur la carte'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              padding: const EdgeInsets.symmetric(
                                vertical: AppSpacing.md,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            const SizedBox(height: AppSpacing.xl),

            // History Button
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(
                      builder: (_) => const HistoryScreen(),
                    ),
                    (route) => route.isFirst,
                  );
                },
                icon: const Icon(Icons.history),
                label: const Text('Voir l\'historique'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.primary,
                  side: const BorderSide(color: AppColors.primary),
                  padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppSpacing.lg),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
