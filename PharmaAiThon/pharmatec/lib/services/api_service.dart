import 'dart:convert';
import 'dart:io';

class ApiService {
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://192.168.137.158:5000/api',
  );

  static Future<Map<String, dynamic>> post(
    String path, {
    required Map<String, dynamic> body,
    String? token,
  }) async {
    return _request(
      method: 'POST',
      path: path,
      body: body,
      token: token,
    );
  }

  static Future<Map<String, dynamic>> get(
    String path, {
    String? token,
  }) async {
    return _request(
      method: 'GET',
      path: path,
      token: token,
    );
  }

  static Future<Map<String, dynamic>> _request({
    required String method,
    required String path,
    Map<String, dynamic>? body,
    String? token,
  }) async {
    final client = HttpClient();

    try {
      final fullUrl = '$baseUrl$path';
      print('🔍 [ApiService] Making $method request to: $fullUrl');

      final request = await client.openUrl(method, Uri.parse(fullUrl));
      request.headers.set(HttpHeaders.contentTypeHeader, 'application/json');

      if (token != null && token.isNotEmpty) {
        request.headers.set(HttpHeaders.authorizationHeader, 'Bearer $token');
      }

      if (body != null) {
        final bodyJson = jsonEncode(body);
        print('🔍 [ApiService] Request body: $bodyJson');
        request.write(bodyJson);
      }

      final response = await request.close();
      print('🔍 [ApiService] Response status code: ${response.statusCode}');

      final raw = await utf8.decoder.bind(response).join();
      print('🔍 [ApiService] Response body: $raw');

      final data = raw.isEmpty
          ? <String, dynamic>{}
          : jsonDecode(raw) as Map<String, dynamic>;

      if (response.statusCode >= 200 && response.statusCode < 300) {
        print('🔍 [ApiService] Success! Data: $data');
        return data;
      }

      print(
          '🔍 [ApiService] Error response - Status: ${response.statusCode}, Data: $data');
      throw HttpException(data['message']?.toString() ?? 'Request failed');
    } catch (error) {
      print('🔍 [ApiService] Exception: $error');
      rethrow;
    } finally {
      client.close(force: true);
    }
  }
}
