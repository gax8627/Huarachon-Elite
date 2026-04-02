import 'package:flutter/foundation.dart';

enum AuthStatus { authenticated, unauthenticated, authenticating }

class AuthService extends ChangeNotifier {
  // Mock State
  AuthStatus _status = AuthStatus.unauthenticated;
  String? _userId;
  String? _userName;

  AuthStatus get status => _status;
  String? get userId => _userId;
  String? get userName => _userName;

  Future<bool> signInWithGoogle() async {
    _status = AuthStatus.authenticating;
    notifyListeners();

    // Simulating Google Sign-In delay
    await Future.delayed(const Duration(seconds: 2));
    
    _status = AuthStatus.authenticated;
    _userId = 'google-12345';
    _userName = 'Huara-Fan Google';
    notifyListeners();
    return true;
  }

  Future<bool> signInWithApple() async {
    _status = AuthStatus.authenticating;
    notifyListeners();

    // Simulating Apple Sign-In delay
    await Future.delayed(const Duration(seconds: 2));
    
    _status = AuthStatus.authenticated;
    _userId = 'apple-67890';
    _userName = 'Huara-Fan Apple';
    notifyListeners();
    return true;
  }

  Future<bool> loginWithEmail(String email, String password) async {
    _status = AuthStatus.authenticating;
    notifyListeners();

    // Simulating Email Login delay
    await Future.delayed(const Duration(seconds: 1));
    
    _status = AuthStatus.authenticated;
    _userId = 'email-abcde';
    _userName = email.split('@')[0];
    notifyListeners();
    return true;
  }

  Future<void> signOut() async {
    _status = AuthStatus.unauthenticated;
    _userId = null;
    _userName = null;
    notifyListeners();
  }
}
