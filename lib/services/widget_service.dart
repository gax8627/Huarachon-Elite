import 'package:home_widget/home_widget.dart';
import 'package:flutter/foundation.dart';

class WidgetService {
  static const String _groupId = 'group.huarachon.elite'; // App Group for iOS
  static const String _androidWidgetName = 'HuarachonWidget';
  
  /// Actualiza los datos del widget (Puntos, Nivel y Promo)
  static Future<void> updateWidgetData({
    required double points,
    required String tier,
    required String dailyPromo,
  }) async {
    if (kIsWeb) return; // Widgets no funcionan en Web
    
    try {
      // Save data locally for the widget to read
      await HomeWidget.saveWidgetData<double>('points', points);
      await HomeWidget.saveWidgetData<String>('tier', tier);
      await HomeWidget.saveWidgetData<String>('promo', dailyPromo);
      
      // Request update from the OS
      await HomeWidget.updateWidget(
        name: _androidWidgetName,
        iOSName: 'HuarachonWidget',
      );
    } catch (e) {
      debugPrint('Error updating widget: $e');
    }
  }

  /// Configura el listener de clicks en el widget (para abrir una página específica)
  static Future<void> initBackgroundUpdate() async {
    if (kIsWeb) return;
    HomeWidget.registerBackgroundCallback(backgroundCallback);
  }
}

// Background callback must be a top-level function
Future<void> backgroundCallback(Uri? uri) async {
  if (uri?.host == 'update_promo') {
    // Logic to refresh promo in background if needed
  }
}
