import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:crypto/crypto.dart';
import 'dart:convert';

class SecurityService {
  static const _storage = FlutterSecureStorage();
  
  // A hidden salt for QR generation (In production, this moves to App Config or Backend)
  static const String _qrSalt = 'HUARA-ELITE-SECRET-2026';

  /// Save sensitive data to the secure hardware vault (Keychain/Keystore)
  static Future<void> saveSecure(String key, String value) async {
    await _storage.write(key: key, value: value);
  }

  /// Retrieve sensitive data from the vault
  static Future<String?> readSecure(String key) async {
    return await _storage.read(key: key);
  }

  /// Delete sensitive data
  static Future<void> deleteSecure(String key) async {
    await _storage.delete(key: key);
  }

  /// Clears all secure data (for logout)
  static Future<void> clearAll() async {
    await _storage.deleteAll();
  }

  /// Generates a signed QR string to prevent tampering
  static String generateSignedQR(String data) {
    final bytes = utf8.encode(data + _qrSalt);
    final digest = sha256.convert(bytes);
    return 'HUARA_V2:$data:${digest.toString().substring(0, 8)}';
  }

  /// Validates a signed QR code
  static bool verifySignedQR(String code) {
    if (!code.startsWith('HUARA_V2:')) return false;
    
    final parts = code.split(':');
    if (parts.length != 3) return false;
    
    final data = parts[1];
    final signature = parts[2];
    
    final expectedBytes = utf8.encode(data + _qrSalt);
    final expectedDigest = sha256.convert(expectedBytes);
    final expectedSignature = expectedDigest.toString().substring(0, 8);
    
    return signature == expectedSignature;
  }

  /// Scrubs sensitive PII from strings before logging
  static String scrubPII(String input) {
    // Simple regex to mask emails
    final emailRegex = RegExp(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+');
    return input.replaceAllMapped(emailRegex, (match) => '***@***.***');
  }
}
