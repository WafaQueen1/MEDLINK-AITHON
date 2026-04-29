import 'package:hive_flutter/hive_flutter.dart';
import 'package:pharmatec/models/scan_model.dart';
import 'package:pharmatec/models/user_model.dart';

class HiveService {
  static const String userBoxName = 'userBox';
  static const String scanBoxName = 'scanBox';
  static const String currentUserKey = 'currentUser';
  static const String authTokenKey = 'authToken';

  static Future<void> initializeHive() async {
    await Hive.initFlutter();
    await Hive.openBox<Map>(userBoxName);
    await Hive.openBox<Map>(scanBoxName);
  }

  static Box<Map> getUserBox() {
    return Hive.box<Map>(userBoxName);
  }

  static Box<Map> getScanBox() {
    return Hive.box<Map>(scanBoxName);
  }

  static Future<void> saveUser(UserModel user) async {
    await getUserBox().put(currentUserKey, user.toMap());
  }

  static Future<void> saveSession({
    required UserModel user,
    required String token,
  }) async {
    await getUserBox().put(currentUserKey, user.toMap());
    await getUserBox().put(authTokenKey, {'token': token});
  }

  static UserModel? getUser() {
    final userData = getUserBox().get(currentUserKey);
    if (userData == null) {
      return null;
    }

    return UserModel.fromMap(Map<String, dynamic>.from(userData));
  }

  static String? getAuthToken() {
    final tokenData = getUserBox().get(authTokenKey);
    if (tokenData == null) {
      return null;
    }

    return Map<String, dynamic>.from(tokenData)['token']?.toString();
  }

  static Future<void> updateUser(UserModel user) async {
    await getUserBox().put(currentUserKey, user.toMap());
  }

  static Future<void> deleteUser() async {
    await getUserBox().delete(currentUserKey);
    await getUserBox().delete(authTokenKey);
  }

  static Future<void> saveScan(ScanModel scan) async {
    await getScanBox().put(scan.id, scan.toMap());
  }

  static List<ScanModel> getAllScans() {
    final scans = <ScanModel>[];

    for (final value in getScanBox().values) {
      scans.add(ScanModel.fromMap(Map<String, dynamic>.from(value)));
    }

    scans.sort((a, b) => b.date.compareTo(a.date));
    return scans;
  }

  static ScanModel? getScan(String id) {
    final scanData = getScanBox().get(id);
    if (scanData == null) {
      return null;
    }

    return ScanModel.fromMap(Map<String, dynamic>.from(scanData));
  }

  static Future<void> updateScan(ScanModel scan) async {
    await getScanBox().put(scan.id, scan.toMap());
  }

  static Future<void> deleteScan(String id) async {
    await getScanBox().delete(id);
  }

  static Future<void> deleteAllScans() async {
    await getScanBox().clear();
  }

  static int getTotalScans() {
    return getScanBox().length;
  }

  static Future<void> clearAllData() async {
    await getUserBox().clear();
    await getScanBox().clear();
  }
}
