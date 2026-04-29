import 'package:geolocator/geolocator.dart';

class LocationService {
  /// Request location permission
  static Future<bool> requestLocationPermission() async {
    try {
      final permission = await Geolocator.checkPermission();

      if (permission == LocationPermission.denied) {
        final result = await Geolocator.requestPermission();
        return result == LocationPermission.whileInUse ||
            result == LocationPermission.always;
      } else if (permission == LocationPermission.deniedForever) {
        print('🔍 [LocationService] Location permission denied forever');
        return false;
      }

      return true;
    } catch (e) {
      print('🔍 [LocationService] Error requesting permission: $e');
      return false;
    }
  }

  /// Get current user location
  static Future<Position?> getCurrentLocation() async {
    try {
      print('🔍 [LocationService] Getting current location...');

      // Request permission
      final hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        print('🔍 [LocationService] No location permission');
        return null;
      }

      // Get position
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
        timeLimit: const Duration(seconds: 30),
      );

      print(
          '🔍 [LocationService] Got location: ${position.latitude}, ${position.longitude}');
      return position;
    } catch (e) {
      print('🔍 [LocationService] Error getting location: $e');
      return null;
    }
  }

  /// Calculate distance between two coordinates in kilometers
  static double calculateDistance(
    double lat1,
    double lon1,
    double lat2,
    double lon2,
  ) {
    // Haversine formula
    const R = 6371; // Earth's radius in km
    final dLat = _toRad(lat2 - lat1);
    final dLon = _toRad(lon2 - lon1);
    final a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(_toRad(lat1)) *
            Math.cos(_toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    final c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  static double _toRad(double degree) {
    return degree * (3.14159265359 / 180);
  }
}

// Simple Math class for sin/cos/atan2
class Math {
  static double sin(double x) => x.sin();
  static double cos(double x) => x.cos();
  static double sqrt(double x) => x.sqrt();
  static double atan2(double y, double x) {
    return y.atan2(x);
  }
}

extension SinCosAtan on double {
  double sin() {
    // Using dart's math library internally
    return _sin(this);
  }

  double cos() {
    return _cos(this);
  }

  double sqrt() {
    return _sqrt(this);
  }

  double atan2(double x) {
    return _atan2(this, x);
  }

  // Primitive implementations using Taylor series for small angles
  static double _sin(double x) {
    x = x % (2 * 3.14159265359);
    double result = 0;
    double term = x;
    for (int i = 1; i < 20; i++) {
      result += term;
      term *= -x * x / ((2 * i) * (2 * i + 1));
    }
    return result;
  }

  static double _cos(double x) {
    x = x % (2 * 3.14159265359);
    double result = 1;
    double term = 1;
    for (int i = 1; i < 20; i++) {
      term *= -x * x / ((2 * i - 1) * (2 * i));
      result += term;
    }
    return result;
  }

  static double _sqrt(double x) {
    if (x < 0) return double.nan;
    if (x == 0) return 0;
    double guess = x;
    for (int i = 0; i < 20; i++) {
      guess = (guess + x / guess) / 2;
    }
    return guess;
  }

  static double _atan2(double y, double x) {
    if (x > 0) {
      return _atan(y / x);
    } else if (x < 0 && y >= 0) {
      return _atan(y / x) + 3.14159265359;
    } else if (x < 0 && y < 0) {
      return _atan(y / x) - 3.14159265359;
    } else if (x == 0 && y > 0) {
      return 3.14159265359 / 2;
    } else if (x == 0 && y < 0) {
      return -3.14159265359 / 2;
    }
    return 0;
  }

  static double _atan(double x) {
    double result = 0;
    double term = x;
    double x2 = x * x;
    for (int i = 1; i < 50; i += 2) {
      result += term / i;
      term *= -x2 * (i + 1) / (i + 2);
    }
    return result;
  }
}
