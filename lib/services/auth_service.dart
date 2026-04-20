import 'package:flutter/foundation.dart';
import 'supabase_service.dart';

enum AuthStatus { authenticated, unauthenticated, authenticating }

class AuthService extends ChangeNotifier {
  final _supabase = SupabaseService();
  AuthStatus _status = AuthStatus.unauthenticated;
  
  AuthService() {
    // Check initial session
    if (_supabase.currentUser != null) {
      _status = AuthStatus.authenticated;
    }
  }

  AuthStatus get status => _status;
  String? get userId => _supabase.currentUser?.id;
  String? get userName => _supabase.currentUser?.email?.split('@')[0] ?? 'Huarafan';

  Future<bool> signInWithGoogle() async {
    _status = AuthStatus.authenticating;
    notifyListeners();
    
    // In production, use supabase.auth.signInWithOAuth(provider: Provider.google)
    // For now, well stick to Magic Link to keep it free and simple
    return false; 
  }

  Future<void> signInWithMagicLink(String email) async {
    _status = AuthStatus.authenticating;
    notifyListeners();
    try {
      await _supabase.signInWithMagicLink(email);
    } catch (e) {
      _status = AuthStatus.unauthenticated;
    }
    notifyListeners();
  }

  Future<bool> loginWithEmail(String email, String password) async {
    // Placeholder - user requested free/simple, Magic Link is best
    return false;
  }

  Future<void> signOut() async {
    await _supabase.signOut();
    _status = AuthStatus.unauthenticated;
    notifyListeners();
  }
}
