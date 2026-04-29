import 'package:pharmatec/models/user_model.dart';
import 'package:pharmatec/services/api_service.dart';
import 'package:pharmatec/services/hive_service.dart';

class AuthService {
  static Future<Map<String, dynamic>> signup(UserModel user) async {
    try {
      print('🔍 [AuthService] Starting signup validation');
      final validation = _validateSignup(user);
      if (validation != null) {
        print('🔍 [AuthService] Validation failed: $validation');
        return {
          'success': false,
          'message': validation,
        };
      }

      print('🔍 [AuthService] Sending POST request to /auth/signup');
      print('🔍 [AuthService] Payload: ${user.toSignupPayload()}');

      final response =
          await ApiService.post('/auth/signup', body: user.toSignupPayload());
      print('🔍 [AuthService] Response received: $response');

      return {
        'success': true,
        'message': 'Inscription reussie. Connectez-vous pour continuer.',
      };
    } catch (error) {
      print('🔍 [AuthService] Error caught: $error');
      return {
        'success': false,
        'message': 'Erreur lors de l\'inscription: $error',
      };
    }
  }

  static Future<Map<String, dynamic>> login(
      String email, String password) async {
    try {
      if (email.isEmpty || password.isEmpty) {
        return {
          'success': false,
          'message': 'Veuillez remplir tous les champs',
        };
      }

      final response = await ApiService.post(
        '/auth/login',
        body: {
          'email': email,
          'password': password,
        },
      );

      final token = response['token']?.toString() ?? '';
      final user = UserModel.fromApi(
        Map<String, dynamic>.from(response['user'] ?? {}),
      );

      await HiveService.saveSession(user: user, token: token);

      return {
        'success': true,
        'message': 'Connexion reussie',
      };
    } catch (error) {
      return {
        'success': false,
        'message': 'Erreur lors de la connexion: $error',
      };
    }
  }

  static Future<void> logout() async {
    await HiveService.deleteUser();
  }

  static UserModel? getCurrentUser() {
    return HiveService.getUser();
  }

  static bool isLoggedIn() {
    return HiveService.getUser() != null && HiveService.getAuthToken() != null;
  }

  static String? _validateSignup(UserModel user) {
    if (user.firstName.isEmpty) {
      return 'Le prenom est obligatoire';
    }
    if (user.lastName.isEmpty) {
      return 'Le nom de famille est obligatoire';
    }
    if (user.age <= 0 || user.age > 150) {
      return 'L\'age doit etre entre 1 et 150';
    }
    if (user.email.isEmpty || !_isValidEmail(user.email)) {
      return 'Email invalide';
    }
    if (user.password.isEmpty || user.password.length < 6) {
      return 'Le mot de passe doit avoir au moins 6 caracteres';
    }
    if (user.chifaNumber.isEmpty) {
      return 'Le numero Chifa est obligatoire';
    }
    if (user.hasChronicDisease && (user.chronicDiseaseName?.isEmpty ?? true)) {
      return 'Veuillez preciser le nom de la maladie chronique';
    }
    return null;
  }

  static bool _isValidEmail(String email) {
    final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+$');
    return emailRegex.hasMatch(email);
  }

  static Future<Map<String, dynamic>> updateProfile(UserModel user) async {
    try {
      final validation = _validateSignup(user);
      if (validation != null) {
        return {
          'success': false,
          'message': validation,
        };
      }

      await HiveService.updateUser(user);

      return {
        'success': true,
        'message': 'Profil mis a jour localement',
      };
    } catch (error) {
      return {
        'success': false,
        'message': 'Erreur lors de la mise a jour: $error',
      };
    }
  }
}
