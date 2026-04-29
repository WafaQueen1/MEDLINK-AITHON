import 'dart:io';
import 'package:flutter/material.dart';
import 'package:pharmatec/screens/pharmacy_list_screen.dart';
import 'package:pharmatec/services/hive_service.dart';
import 'package:pharmatec/widgets/custom_widgets.dart';

/// History Screen - Shows all previous scans
class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  late List<dynamic> _scans;

  @override
  void initState() {
    super.initState();
    _loadScans();
  }

  void _loadScans() {
    setState(() {
      _scans = HiveService.getAllScans();
    });
  }

  void _openPharmaciesForScan(dynamic scan) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => PharmacyListScreen(
          medicines: List<String>.from(scan.medicines),
          scanDateLabel: scan.getFormattedDate(),
        ),
      ),
    );
  }

  Future<void> _deleteScan(String scanId) async {
    final confirmed = await showConfirmDialog(
      context,
      title: 'Supprimer le scan',
      message: 'Etes-vous sur de vouloir supprimer ce scan?',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
    );

    if (confirmed ?? false) {
      await HiveService.deleteScan(scanId);
      _loadScans();
      if (mounted) {
        showSnackbar(context, 'Scan supprime');
      }
    }
  }

  Future<void> _deleteAllScans() async {
    final confirmed = await showConfirmDialog(
      context,
      title: 'Supprimer tous les scans',
      message:
          'Etes-vous sur de vouloir supprimer tous les scans? Cette action est irreversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
    );

    if (confirmed ?? false) {
      await HiveService.deleteAllScans();
      _loadScans();
      if (mounted) {
        showSnackbar(context, 'Tous les scans ont ete supprimes');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Historique des scans'),
        elevation: 0,
        actions: [
          if (_scans.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.delete_sweep),
              onPressed: _deleteAllScans,
            ),
        ],
      ),
      body: _scans.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.inbox,
                    size: 64,
                    color: Colors.grey[400],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Aucun scan pour le moment',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey[600],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Commencez par scanner une ordonnance',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.grey[500],
                    ),
                  ),
                ],
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: _scans.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final scan = _scans[index];
                final imageExists = File(scan.imagePath).existsSync();

                return InkWell(
                  borderRadius: BorderRadius.circular(12),
                  onTap: () => _openPharmaciesForScan(scan),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: Colors.grey[200]!,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (imageExists)
                          ClipRRect(
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(12),
                              topRight: Radius.circular(12),
                            ),
                            child: Image.file(
                              File(scan.imagePath),
                              width: double.infinity,
                              height: 200,
                              fit: BoxFit.cover,
                            ),
                          )
                        else
                          Container(
                            width: double.infinity,
                            height: 200,
                            decoration: BoxDecoration(
                              color: Colors.grey[100],
                              borderRadius: const BorderRadius.only(
                                topLeft: Radius.circular(12),
                                topRight: Radius.circular(12),
                              ),
                            ),
                            child: Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.image_not_supported,
                                    size: 48,
                                    color: Colors.grey[400],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'Image supprimee',
                                    style: TextStyle(
                                      color: Colors.grey[500],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    Icons.calendar_today,
                                    size: 16,
                                    color: Colors.grey[600],
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    scan.getFormattedDate(),
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  const Expanded(
                                    child: Text(
                                      'Medicaments de cette ordonnance',
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.black87,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF2E7D32)
                                          .withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: const Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(
                                          Icons.local_pharmacy,
                                          size: 14,
                                          color: Color(0xFF2E7D32),
                                        ),
                                        SizedBox(width: 6),
                                        Text(
                                          'Voir pharmacies',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: Color(0xFF2E7D32),
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                children: scan.medicines
                                    .map<Widget>(
                                      (medicine) => Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 12,
                                          vertical: 6,
                                        ),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFF2E7D32)
                                              .withOpacity(0.1),
                                          borderRadius:
                                              BorderRadius.circular(20),
                                          border: Border.all(
                                            color: const Color(0xFF2E7D32)
                                                .withOpacity(0.3),
                                          ),
                                        ),
                                        child: Text(
                                          medicine,
                                          style: const TextStyle(
                                            fontSize: 12,
                                            color: Color(0xFF2E7D32),
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                      ),
                                    )
                                    .toList(),
                              ),
                              const SizedBox(height: 12),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  TextButton.icon(
                                    onPressed: () =>
                                        _openPharmaciesForScan(scan),
                                    icon: const Icon(Icons.location_on),
                                    label: const Text('Pharmacies'),
                                    style: TextButton.styleFrom(
                                      foregroundColor: const Color(0xFF2E7D32),
                                    ),
                                  ),
                                  TextButton.icon(
                                    onPressed: () => _deleteScan(scan.id),
                                    icon: const Icon(Icons.delete),
                                    label: const Text('Supprimer'),
                                    style: TextButton.styleFrom(
                                      foregroundColor: Colors.red,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
