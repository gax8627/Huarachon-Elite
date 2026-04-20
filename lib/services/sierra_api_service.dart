import 'dart:math';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'app_config.dart';
import 'cart_provider.dart';
import 'security_service.dart';

class SierraApiService {
  static final SierraApiService _instance = SierraApiService._internal();
  factory SierraApiService() => _instance;
  SierraApiService._internal();

  /// Syncs the app wallet with the Sierra POS Source of Truth
  Future<double> syncBalance(String userId) async {
    if (AppConfig.useMockData) {
      await Future.delayed(const Duration(milliseconds: 800));
      return 128.50 + (Random().nextDouble() * 50);
    }

    try {
      final response = await http.get(
        Uri.parse('${AppConfig.sierraBaseUrl}/customers/$userId/balance'),
        headers: {'Authorization': 'Bearer YOUR_PRODUCTION_KEY'},
      );
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return (data['balance'] as num).toDouble();
      }
      return 0.0;
    } catch (e) {
      debugPrint('Sierra API Error: $e');
      return 0.0;
    }
  }

  /// Sends a digital order to the branch terminal
  Future<bool> submitOrder(Map<String, dynamic> orderData) async {
    if (AppConfig.useMockData) {
      await Future.delayed(const Duration(seconds: 1));
      final sierraPayload = {
        ...orderData,
        'timestamp': DateTime.now().toIso8601String(),
        'version': '1.0.2-HuaraElite'
      };
      debugPrint('SIERRA POS MOCK SUBMISSION: ${SecurityService.scrubPII(sierraPayload.toString())}');
      return true;
    }

    try {
      final response = await http.post(
        Uri.parse('${AppConfig.sierraBaseUrl}/orders'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_PRODUCTION_KEY',
        },
        body: json.encode(orderData),
      );
      
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      debugPrint('Sierra Order Error: $e');
      return false;
    }
  }
}
