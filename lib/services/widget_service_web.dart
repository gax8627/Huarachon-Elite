import 'package:flutter/foundation.dart';

class WidgetService {
  /// No-op implementation for Web
  static Future<void> updateWidgetData({
    required double points,
    required String tier,
    required String dailyPromo,
  }) async {
    debugPrint('Widget data update ignored on Web.');
  }

  /// No-op implementation for Web
  static Future<void> initBackgroundUpdate() async {
    debugPrint('Widget background update ignored on Web.');
  }
}
