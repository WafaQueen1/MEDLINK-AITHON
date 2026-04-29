import 'package:google_generative_ai/google_generative_ai.dart';

/// Gemini AI Service for chatbot interactions
class GeminiService {
  static const String _apiKey = 'AIzaSyDejQR7ZqD9D1pmoRam0PMBGDlXrwL-vYU';
  static const String _modelName =
      'gemini-pro'; // Using stable model compatible with free tier
  static late final GenerativeModel _model;
  static late final ChatSession _chatSession;
  static bool _isInitialized = false;

  /// Initialize Gemini
  static Future<void> initialize() async {
    if (_isInitialized) {
      print('✅ Gemini already initialized');
      return;
    }

    try {
      print('🔧 Initializing GenerativeModel...');
      _model = GenerativeModel(
        model: _modelName,
        apiKey: _apiKey,
      );

      print('💬 Starting chat session...');
      // Start a chat session with system instructions
      _chatSession = _model.startChat(
        history: [
          Content.text(
              '''Vous êtes un assistant utile pour l'application Pharmatec, 
          une application de lecture intelligente d'ordonnances qui aide les utilisateurs à:
          1. Scanner leurs ordonnances médicales
          2. Trouver des pharmacies proches qui ont leurs médicaments
          3. Consulter l'historique de leurs ordonnances
          4. Obtenir des informations sur les médicaments
          
          Répondez toujours en français, soyez amical et professionnel.
          Si l'utilisateur pose des questions non liées à l'application, redirichez-les gentiment vers l'utilisation de l'app.'''),
        ],
      );

      _isInitialized = true;
      print('✅ Gemini AI initialized successfully with model: $_modelName');
    } on FormatException catch (e) {
      print('❌ Format Error during Gemini init: $e');
      throw 'Erreur de configuration API: $e';
    } catch (e) {
      print('❌ Error initializing Gemini: $e');
      throw 'Impossible de connecter au service IA: $e';
    }
  }

  /// Send a message and get a response from Gemini
  static Future<String> sendMessage(String userMessage) async {
    try {
      if (!_isInitialized) {
        print('❌ Gemini not initialized, initializing now...');
        await initialize();
      }

      if (_apiKey == 'YOUR_GEMINI_API_KEY_HERE') {
        print('❌ API Key not configured');
        return 'Erreur: La clé API Gemini n\'est pas configurée.';
      }

      print('📤 Sending to Gemini: $userMessage');
      final response = await _chatSession.sendMessage(
        Content.text(userMessage),
      );

      final responseText = response.text;
      if (responseText == null || responseText.isEmpty) {
        print('❌ Empty response from Gemini');
        return 'Désolé, je n\'ai pas pu générer une réponse. Veuillez réessayer.';
      }

      final preview = responseText.length > 50
          ? responseText.substring(0, 50)
          : responseText;
      print('✅ Response received: $preview...');
      return responseText;
    } on FormatException catch (e) {
      print('❌ Format Error: $e');
      return 'Erreur de format de réponse. Veuillez réessayer.';
    } on Exception catch (e) {
      print('❌ Error sending message to Gemini: $e');
      final errorMsg = e.toString().toLowerCase();

      if (errorMsg.contains('unauthenticated') ||
          errorMsg.contains('permission') ||
          errorMsg.contains('invalid')) {
        return 'Erreur d\'authentification API. Vérifiez que votre clé API est valide et activée sur https://aistudio.google.com/app/apikey';
      } else if (errorMsg.contains('quota') || errorMsg.contains('rate')) {
        return 'Quota d\'utilisation dépassé. Le quota se réinitialise tous les jours à minuit UTC. Réessayez demain ou générez une nouvelle clé API.';
      } else if (errorMsg.contains('network') ||
          errorMsg.contains('connection') ||
          errorMsg.contains('timeout')) {
        return 'Erreur de connexion. Vérifiez votre internet et réessayez.';
      } else {
        return 'Erreur: $e\n\nSi cela persiste, vérifiez votre clé API sur https://console.cloud.google.com/';
      }
    }
  }

  /// Get chat history
  static List<Content> getChatHistory() {
    return _chatSession.history.toList();
  }

  /// Reset chat session
  static void resetChat() {
    try {
      _chatSession.history.toList().clear();
      print('✅ Chat history cleared');
    } catch (e) {
      print('⚠️ Error clearing chat: $e');
    }
  }

  /// Check if API key is configured
  static bool isConfigured() {
    return _apiKey != 'YOUR_GEMINI_API_KEY_HERE';
  }

  /// Validate API key
  static Future<bool> validateApiKey(String apiKey) async {
    try {
      final testModel = GenerativeModel(
        model: _modelName,
        apiKey: apiKey,
      );

      final testResponse = await testModel.generateContent([
        Content.text('Test'),
      ]);

      return testResponse.text != null && testResponse.text!.isNotEmpty;
    } catch (e) {
      print('❌ Invalid API key: $e');
      return false;
    }
  }

  /// Reset initialization flag (useful for testing)
  static void reset() {
    _isInitialized = false;
    print('🔄 Gemini service reset');
  }
}
