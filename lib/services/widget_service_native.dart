import 'package:home_widget/home_widget.dart';
import 'package:flutter/foundation.dart';

class WidgetService {
  static const String _groupId = 'group.huarachon.elite';
  static const String _androidWidgetName = 'HuarachonWidget';
  
  static Future<void> updateWidgetData({
    required double points,
    required String tier,
    required String dailyPromo,
  }) async {
    try {
      await HomeWidget.saveWidgetData<double>('points', points);
      await HomeWidget.saveWidgetData<String>('tier', tier);
      await HomeWidget.saveWidgetData<String>('promo', dailyPromo);
      
      await HomeWidget.updateWidget(
        name: _androidWidgetName,
        iOSName: 'HuarachonWidget',
      );
    } catch (e) {
      debugPrint('Error updating widget: $e');
    }
  }

  static Future<void> initBackgroundUpdate() async {
    HomeWidget.registerBackgroundCallback(backgroundCallback);
  }
}

Future<void> backgroundCallback(Uri? uri) async {
  if (uri?.host == 'update_promo') {
    // Logic to refresh promo in background if needed
  }
}
