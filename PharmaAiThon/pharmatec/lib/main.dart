import 'package:flutter/material.dart';
import 'package:pharmatec/services/hive_service.dart';
import 'package:pharmatec/widgets/root_widget.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  print('🚀 Starting Pharmatec app...');

  // Initialize Hive database
  print('📦 Initializing Hive database...');
  await HiveService.initializeHive();
  print('✅ Hive database initialized');

  runApp(const AppRoot());
}
