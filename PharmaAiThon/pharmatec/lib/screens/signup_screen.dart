import 'package:flutter/material.dart';
import 'package:pharmatec/models/user_model.dart';
import 'package:pharmatec/services/auth_service.dart';
import 'package:pharmatec/screens/login_screen.dart';
import 'package:pharmatec/widgets/custom_widgets.dart';

/// Sign Up Screen
class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _ageController = TextEditingController();
  final TextEditingController _chifaNumberController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _diseaseController = TextEditingController();

  String? _selectedSex = 'Male';
  bool _hasChronicDisease = false;
  bool _isLoading = false;
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _ageController.dispose();
    _chifaNumberController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _diseaseController.dispose();
    super.dispose();
  }

  /// Handle sign up
  Future<void> _handleSignup() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    final user = UserModel(
      firstName: _firstNameController.text.trim(),
      lastName: _lastNameController.text.trim(),
      age: int.parse(_ageController.text),
      sex: _selectedSex ?? 'Male',
      hasChronicDisease: _hasChronicDisease,
      chronicDiseaseName:
          _hasChronicDisease ? _diseaseController.text.trim() : null,
      chifaNumber: _chifaNumberController.text.trim(),
      email: _emailController.text.trim(),
      password: _passwordController.text,
    );

    print('🔍 [SignUp] Starting signup with user: ${user.toSignupPayload()}');
    final result = await AuthService.signup(user);
    print('🔍 [SignUp] Result: $result');

    setState(() {
      _isLoading = false;
    });

    if (!mounted) return;

    if (result['success']) {
      showSnackbar(context, result['message']);
      // Navigate to login
      Future.delayed(const Duration(seconds: 1), () {
        if (mounted) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const LoginScreen()),
          );
        }
      });
    } else {
      showSnackbar(context, result['message'], isError: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Créer un compte'),
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              const Color(0xFF2E7D32).withOpacity(0.1),
              Colors.white,
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  // First Name
                  CustomTextField(
                    label: 'Prénom',
                    hint: 'Entrez votre prénom',
                    controller: _firstNameController,
                    prefixIcon: const Icon(Icons.person_outlined),
                    validator: (value) {
                      if (value?.isEmpty ?? true)
                        return 'Le prénom est obligatoire';
                      return null;
                    },
                  ),
                  const SizedBox(height: 18),

                  // Last Name
                  CustomTextField(
                    label: 'Nom de famille',
                    hint: 'Entrez votre nom de famille',
                    controller: _lastNameController,
                    prefixIcon: const Icon(Icons.person_outlined),
                    validator: (value) {
                      if (value?.isEmpty ?? true)
                        return 'Le nom est obligatoire';
                      return null;
                    },
                  ),
                  const SizedBox(height: 18),

                  // Age
                  CustomTextField(
                    label: 'Âge',
                    hint: 'Entrez votre âge',
                    controller: _ageController,
                    keyboardType: TextInputType.number,
                    prefixIcon: const Icon(Icons.cake_outlined),
                    validator: (value) {
                      if (value?.isEmpty ?? true)
                        return 'L\'âge est obligatoire';
                      final age = int.tryParse(value!);
                      if (age == null || age <= 0 || age > 150) {
                        return 'L\'âge doit être entre 1 et 150';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 18),

                  // Sex
                  CustomDropdown(
                    label: 'Sexe',
                    value: _selectedSex,
                    items: const ['Male', 'Female'],
                    onChanged: (value) {
                      setState(() {
                        _selectedSex = value;
                      });
                    },
                    prefixIcon: const Icon(Icons.wc_outlined),
                  ),
                  const SizedBox(height: 18),

                  // Chronic Disease Toggle
                  CustomToggle(
                    label: 'Maladie chronique',
                    value: _hasChronicDisease,
                    onChanged: (value) {
                      setState(() {
                        _hasChronicDisease = value;
                      });
                    },
                  ),
                  if (_hasChronicDisease) ...[
                    const SizedBox(height: 18),
                    CustomTextField(
                      label: 'Nom de la maladie',
                      hint: 'Entrez le nom de la maladie',
                      controller: _diseaseController,
                      prefixIcon: const Icon(Icons.health_and_safety_outlined),
                      validator: (value) {
                        if (value?.isEmpty ?? true) {
                          return 'Veuillez préciser le nom de la maladie';
                        }
                        return null;
                      },
                    ),
                  ],
                  const SizedBox(height: 18),

                  // Chifa Number
                  CustomTextField(
                    label: 'Numéro Chifa',
                    hint: 'Entrez votre numéro Chifa',
                    controller: _chifaNumberController,
                    keyboardType: TextInputType.number,
                    prefixIcon: const Icon(Icons.credit_card_outlined),
                    validator: (value) {
                      if (value?.isEmpty ?? true) {
                        return 'Le numéro Chifa est obligatoire';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 18),

                  // Email
                  CustomTextField(
                    label: 'Email',
                    hint: 'Entrez votre email',
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    prefixIcon: const Icon(Icons.email_outlined),
                    validator: (value) {
                      if (value?.isEmpty ?? true)
                        return 'L\'email est obligatoire';
                      if (!RegExp(r'^[^@]+@[^@]+\.[^@]+$').hasMatch(value!)) {
                        return 'Email invalide';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 18),

                  // Password
                  CustomTextField(
                    label: 'Mot de passe',
                    hint: 'Entrez un mot de passe (min. 6 caractères)',
                    controller: _passwordController,
                    obscureText: true,
                    prefixIcon: const Icon(Icons.lock_outlined),
                    validator: (value) {
                      if (value?.isEmpty ?? true)
                        return 'Le mot de passe est obligatoire';
                      if (value!.length < 6) {
                        return 'Le mot de passe doit avoir au moins 6 caractères';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 28),

                  // Sign up button
                  CustomButton(
                    text: 'S\'inscrire',
                    onPressed: _handleSignup,
                    isLoading: _isLoading,
                  ),
                  const SizedBox(height: 16),

                  // Login link
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Vous avez déjà un compte? ',
                        style: TextStyle(color: Colors.grey),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.of(context).pushReplacement(
                            MaterialPageRoute(
                                builder: (_) => const LoginScreen()),
                          );
                        },
                        child: const Text(
                          'Se connecter',
                          style: TextStyle(
                            color: Color(0xFF2E7D32),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
