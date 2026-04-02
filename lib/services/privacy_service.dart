import 'package:shared_preferences/shared_preferences.dart';

class PrivacyService {
  static const String _keyLocation = 'consent_location';
  static const String _keyNotifications = 'consent_notifications';
  static const String _keyAnalytics = 'consent_analytics';
  static const String _keyMarketing = 'consent_marketing';

  /// Updates and persists user consent for a specific category
  static Future<void> updateConsent(String category, bool granted) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('consent_$category', granted);
  }

  /// Retrieves user's current consent preference
  static Future<bool> hasConsent(String category) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('consent_$category') ?? false;
  }

  /// Purges all user data (Right to be Forgotten compliance)
  static Future<bool> purgeUserData() async {
    // 1. Clear SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    
    // In a real app, this would trigger a backend API call
    // await _sierra.deleteAccount(_userId);
    
    return true;
  }

  /// Privacy Meta-data for Legal Compliance
  static Map<String, String> getTransparencyDocs() {
    return {
      'gdpr': 'https://elhuarachon.com/privacy-policy-gdpr',
      'ccpa': 'https://elhuarachon.com/privacy-policy-ccpa',
      'data_sharing': 'Data is shared strictly with Sierra POS for transaction processing.',
      'retention': 'In-app data is stored for the duration of the active account.'
    };
  }
}
