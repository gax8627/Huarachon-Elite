import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter/material.dart';

class SupabaseService {
  static final SupabaseService _instance = SupabaseService._internal();
  factory SupabaseService() => _instance;
  SupabaseService._internal();

  final SupabaseClient _client = Supabase.instance.client;

  /// Getter for the current user
  User? get currentUser => _client.auth.currentUser;

  /// Signs in a user with Magic Link (Free tier friendly)
  Future<void> signInWithMagicLink(String email) async {
    await _client.auth.signInWithOtp(
      email: email,
      emailRedirectTo: 'io.supabase.huarachon://login-callback/',
    );
  }

  /// Logs out the current user
  Future<void> signOut() async {
    await _client.auth.signOut();
  }

  /// Updates user profile data in 'profiles' table
  Future<void> updateProfile({
    required String name,
    required String favoriteMeat,
    required String phoneNumber,
  }) async {
    final userId = _client.auth.currentUser?.id;
    if (userId == null) return;

    await _client.from('profiles').upsert({
      'id': userId,
      'full_name': name,
      'favorite_meat': favoriteMeat,
      'phone_number': phoneNumber,
      'updated_at': DateTime.now().toIso8601String(),
    });
  }

  /// Fetches the user profile
  Future<Map<String, dynamic>?> getProfile() async {
    final userId = _client.auth.currentUser?.id;
    if (userId == null) return null;

    final response = await _client
        .from('profiles')
        .select()
        .eq('id', userId)
        .single();
    
    return response;
  }

  /// Persists an order to the 'orders' table
  Future<bool> saveOrder(Map<String, dynamic> orderData) async {
    try {
      final userId = _client.auth.currentUser?.id;
      if (userId == null) return false;

      await _client.from('orders').insert({
        'user_id': userId,
        'branch': orderData['branch'],
        'total': orderData['total'],
        'items': orderData['items'], // JSONB in Supabase
        'created_at': DateTime.now().toIso8601String(),
      });
      return true;
    } catch (e) {
      debugPrint('Supabase Save Order Error: $e');
      return false;
    }
  }

  /// Fetches order history
  Future<List<dynamic>> fetchOrderHistory() async {
    final userId = _client.auth.currentUser?.id;
    if (userId == null) return [];

    final response = await _client
        .from('orders')
        .select()
        .eq('user_id', userId)
        .order('created_at', ascending: false);
    
    return response as List<dynamic>;
  }
}
