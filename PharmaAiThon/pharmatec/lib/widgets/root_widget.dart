import 'package:flutter/material.dart';
import 'package:pharmatec/screens/login_screen.dart';
import 'package:pharmatec/screens/home_screen.dart';
import 'package:pharmatec/services/auth_service.dart';
import 'package:pharmatec/theme/app_theme.dart';

/// App entry widget for navigation and theme setup.
class AppRoot extends StatelessWidget {
  const AppRoot({super.key});

  @override
  Widget build(BuildContext context) {
    // Check if user is already logged in
    bool isLoggedIn = AuthService.isLoggedIn();

    return MaterialApp(
      title: 'Smart Prescription Reader',
      theme: AppTheme.lightTheme,
      home: isLoggedIn ? const HomeScreen() : const LoginScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
