import 'dart:math';
import 'package:flutter/material.dart';
import 'cart_provider.dart';
import 'security_service.dart';

class SierraApiService {
  static final SierraApiService _instance = SierraApiService._internal();
  factory SierraApiService() => _instance;
  SierraApiService._internal();

  // Mock Sierra Cloud Endpoints
  final String _sierraEndpoint = 'https://api.sierra.com.mx/v1/';

  /// Syncs the app wallet with the Sierra POS Source of Truth
  Future<double> syncBalance(String userId) async {
    // Simulated network delay
    await Future.delayed(const Duration(milliseconds: 800));
    // In a real scenario, this would call Sierra's Customer API
    return 128.50 + (Random().nextDouble() * 50); 
  }

  /// Sends a digital order to the branch terminal
  Future<bool> submitOrder(Map<String, dynamic> orderData) async {
    await Future.delayed(const Duration(seconds: 1));
    // Sierra expects a specific order object
    final sierraPayload = {
      ...orderData,
      'timestamp': DateTime.now().toIso8601String(),
      'version': '1.0.2-HuaraElite'
    };
    
    // Scrub PII before logging in debug mode
    debugPrint('SIERRA POS SUBMISSION: ${SecurityService.scrubPII(sierraPayload.toString())}');
    return true;
  }
}
