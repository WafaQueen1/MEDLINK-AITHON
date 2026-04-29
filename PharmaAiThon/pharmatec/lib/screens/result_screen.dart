import 'dart:io';
import 'package:flutter/material.dart';
import 'package:pharmatec/models/scan_model.dart';
import 'package:pharmatec/screens/pharmacy_list_screen.dart';
import 'package:pharmatec/services/hive_service.dart';
import 'package:pharmatec/services/image_service.dart';
import 'package:pharmatec/services/ml_kit_service.dart';
import 'package:pharmatec/utils/pharmacy_inventory.dart';
import 'package:pharmatec/widgets/custom_widgets.dart';
import 'package:uuid/uuid.dart';

/// Result Screen - Shows extracted medicines and allows editing
class ResultScreen extends StatefulWidget {
  final String imagePath;

  const ResultScreen({
    super.key,
    required this.imagePath,
  });

  @override
  State<ResultScreen> createState() => _ResultScreenState();
}

class _ResultScreenState extends State<ResultScreen> {
  List<String> _medicines = [];
  String _rawText = '';
  bool _isLoading = true;
  bool _isSaving = false;
  List<TextEditingController> _medicineControllers = [];
  List<PharmacyMatch> _pharmacyMatches = [];
  bool _isLoadingPharmacies = false;

  @override
  void initState() {
    super.initState();
    _extractMedicines();
  }

  Future<void> _extractMedicines() async {
    try {
      setState(() {
        _isLoading = true;
      });

      final result = await MLKitService.recognizeTextWithProcessing(
        _imagePath,
        useFuzzyMatching: true,
      );

      if (result['success']) {
        setState(() {
          _medicines = List<String>.from(result['medicines'] ?? []);
          _rawText = result['rawText'] ?? '';
          _medicineControllers = _medicines
              .map((medicine) => TextEditingController(text: medicine))
              .toList();
        });
      } else if (mounted) {
        showSnackbar(context, result['message'] ?? 'Erreur', isError: true);
      }
    } catch (e) {
      if (mounted) {
        showSnackbar(context, 'Erreur: $e', isError: true);
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  String get _imagePath => widget.imagePath;

  void _addMedicineField() {
    setState(() {
      _medicines.add('');
      _medicineControllers.add(TextEditingController());
    });
  }

  void _removeMedicineField(int index) {
    setState(() {
      _medicines.removeAt(index);
      _medicineControllers[index].dispose();
      _medicineControllers.removeAt(index);
    });
  }

  void _updateMedicines() {
    setState(() {
      _medicines = _medicineControllers
          .map((controller) => controller.text.trim())
          .where((text) => text.isNotEmpty)
          .toList();
    });
    _loadPharmacies();
  }

  Future<void> _loadPharmacies() async {
    if (_medicines.isEmpty) {
      setState(() {
        _pharmacyMatches = [];
      });
      return;
    }

    setState(() {
      _isLoadingPharmacies = true;
    });

    try {
      print('🔍 [ResultScreen] Loading pharmacies for medicines: $_medicines');
      final matches = await PharmacyInventory.findMatchesFromApi(_medicines);

      if (mounted) {
        setState(() {
          _pharmacyMatches = matches;
          _isLoadingPharmacies = false;
        });
        print('🔍 [ResultScreen] Loaded ${matches.length} pharmacy matches');
      }
    } catch (e) {
      print('🔍 [ResultScreen] Error loading pharmacies: $e');
      if (mounted) {
        setState(() {
          _isLoadingPharmacies = false;
        });
      }
    }
  }

  void _openPharmacyList() {
    _updateMedicines();

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => PharmacyListScreen(medicines: _medicines),
      ),
    );
  }

  Future<void> _saveScan() async {
    _updateMedicines();

    if (_medicines.isEmpty) {
      showSnackbar(
        context,
        'Veuillez ajouter au moins un medicament',
        isError: true,
      );
      return;
    }

    setState(() {
      _isSaving = true;
    });

    try {
      final savedImagePath = await ImageService.saveImage(_imagePath);

      if (savedImagePath == null) {
        throw Exception('Impossible de sauvegarder l\'image');
      }

      final scan = ScanModel(
        id: const Uuid().v4(),
        imagePath: savedImagePath,
        medicines: List<String>.from(_medicines),
        date: DateTime.now(),
        rawText: _rawText,
      );

      await HiveService.saveScan(scan);

      if (!mounted) {
        return;
      }

      setState(() {
        _isSaving = false;
      });

      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => PharmacyListScreen(
            medicines: List<String>.from(_medicines),
            showSavedBanner: true,
          ),
        ),
      );
    } catch (e) {
      if (mounted) {
        setState(() {
          _isSaving = false;
        });
        showSnackbar(context, 'Erreur: $e', isError: true);
      }
    }
  }

  @override
  void dispose() {
    for (final controller in _medicineControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Resultats du scan'),
        elevation: 0,
      ),
      body: LoadingOverlay(
        isLoading: _isLoading,
        message: 'Extraction du texte en cours...',
        child: SingleChildScrollView(
          child: Column(
            children: [
              Container(
                width: double.infinity,
                height: 250,
                color: Colors.grey[200],
                child: Image.file(
                  File(_imagePath),
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(height: 24),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Medicaments detectes',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFF2E7D32).withOpacity(0.2),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            '${_medicines.length}',
                            style: const TextStyle(
                              color: Color(0xFF2E7D32),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    if (_medicines.isEmpty)
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.orange.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.orange.withOpacity(0.3),
                          ),
                        ),
                        child: Column(
                          children: [
                            Icon(
                              Icons.info_outlined,
                              color: Colors.orange[600],
                              size: 32,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Aucun medicament detecte.\nVeuillez en ajouter manuellement.',
                              style: TextStyle(
                                color: Colors.orange[600],
                                fontSize: 13,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      )
                    else
                      ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _medicines.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          return Row(
                            children: [
                              Expanded(
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 14,
                                  ),
                                  decoration: BoxDecoration(
                                    border: Border.all(
                                      color: Colors.grey[300]!,
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: TextFormField(
                                    controller: _medicineControllers[index],
                                    onChanged: (_) => _updateMedicines(),
                                    decoration: const InputDecoration(
                                      border: InputBorder.none,
                                      isDense: true,
                                      contentPadding: EdgeInsets.zero,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              IconButton(
                                icon:
                                    const Icon(Icons.close, color: Colors.red),
                                onPressed: () => _removeMedicineField(index),
                              ),
                            ],
                          );
                        },
                      ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        onPressed: _addMedicineField,
                        icon: const Icon(Icons.add),
                        label: const Text('Ajouter un medicament'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFF2E7D32),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          side: const BorderSide(color: Color(0xFF2E7D32)),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Expanded(
                          child: Text(
                            'Pharmacies correspondantes',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.blue.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            '${_pharmacyMatches.length}',
                            style: TextStyle(
                              color: Colors.blue[700],
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    if (_medicines.isEmpty)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.blue.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.blue.withOpacity(0.2),
                          ),
                        ),
                        child: const Text(
                          'Ajoutez ou confirmez les medicaments detectes pour voir les pharmacies disponibles.',
                          style: TextStyle(
                            color: Colors.black87,
                            height: 1.4,
                          ),
                        ),
                      )
                    else if (_isLoadingPharmacies)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const CircularProgressIndicator(),
                            const SizedBox(height: 16),
                            Text(
                              'Recherche des pharmacies...',
                              style: TextStyle(
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      )
                    else if (_pharmacyMatches.isEmpty)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.red.withOpacity(0.2),
                          ),
                        ),
                        child: const Text(
                          'Aucune pharmacie locale ne correspond aux medicaments selectionnes pour le moment.',
                          style: TextStyle(
                            color: Colors.black87,
                            height: 1.4,
                          ),
                        ),
                      )
                    else
                      ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _pharmacyMatches.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final match = _pharmacyMatches[index];

                          return Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: match.hasAllMedicines
                                    ? const Color(0xFF2E7D32).withOpacity(0.4)
                                    : Colors.orange.withOpacity(0.35),
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.04),
                                  blurRadius: 8,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            match.pharmacy.name,
                                            style: const TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.w700,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            match.pharmacy.address,
                                            style: TextStyle(
                                              color: Colors.grey[700],
                                              height: 1.3,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            match.pharmacy.phone,
                                            style: TextStyle(
                                              color: Colors.grey[700],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 10,
                                        vertical: 6,
                                      ),
                                      decoration: BoxDecoration(
                                        color: match.hasAllMedicines
                                            ? const Color(0xFF2E7D32)
                                                .withOpacity(0.12)
                                            : Colors.orange.withOpacity(0.14),
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      child: Text(
                                        match.hasAllMedicines
                                            ? 'Complet'
                                            : '${match.matchingMedicines.length}/${_medicines.length}',
                                        style: TextStyle(
                                          color: match.hasAllMedicines
                                              ? const Color(0xFF2E7D32)
                                              : Colors.orange[800],
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Medicaments disponibles: ${match.matchingMedicines.join(', ')}',
                                  style: const TextStyle(height: 1.4),
                                ),
                                if (match.missingMedicines.isNotEmpty) ...[
                                  const SizedBox(height: 6),
                                  Text(
                                    'Medicaments manquants: ${match.missingMedicines.join(', ')}',
                                    style: TextStyle(
                                      color: Colors.orange[800],
                                      height: 1.4,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          );
                        },
                      ),
                    const SizedBox(height: 24),
                    if (_rawText.isNotEmpty) ...[
                      const Text(
                        'Texte brut extrait',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.grey[100],
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.grey[300]!),
                        ),
                        child: Text(
                          _rawText,
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.grey,
                            height: 1.5,
                          ),
                          maxLines: 5,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(height: 24),
                    ],
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed:
                                _medicines.isEmpty ? null : _openPharmacyList,
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              side: const BorderSide(
                                color: Color(0xFF2E7D32),
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text(
                              'Voir pharmacies',
                              style: TextStyle(
                                color: Color(0xFF2E7D32),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => Navigator.pop(context),
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              side: const BorderSide(color: Colors.grey),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text(
                              'Annuler',
                              style: TextStyle(color: Colors.grey),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: CustomButton(
                            text: 'Enregistrer',
                            onPressed: _saveScan,
                            isLoading: _isSaving,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
