import 'dart:math';
import 'notification_service.dart';

class GeofenceService {
  final NotificationService _notificationService = NotificationService();

  static const List<Map<String, dynamic>> branches = [
    {
      'name': 'Independencia',
      'lat': 32.6457,
      'lng': -115.4414,
    },
    {
      'name': 'Gómez Morín',
      'lat': 32.6289,
      'lng': -115.4012,
    },
    {
      'name': 'Lázaro Cárdenas',
      'lat': 32.6391,
      'lng': -115.4678,
    },
  ];

  // Simulated Distance Check (Radius in meters)
  Future<void> checkProximity(double currentLat, double currentLng, {double radius = 500}) async {
    for (var branch in branches) {
      double distance = _calculateDistance(currentLat, currentLng, branch['lat'], branch['lng']);
      if (distance <= radius) {
        await _notificationService.showProximityAlert(branch['name']);
        break; 
      }
    }
  }

  // Haversine formula
  double _calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    const double p = 0.017453292519943295;
    final a = 0.5 - cos((lat2 - lat1) * p) / 2 + 
              cos(lat1 * p) * cos(lat2 * p) * 
              (1 - cos((lon2 - lon1) * p)) / 2;
    return 12742 * asin(sqrt(a)) * 1000; // Result in meters
  }

  // Simulation Trigger for App Testing
  void simulateEnterGeofence(String branchName) {
    _notificationService.showProximityAlert(branchName);
  }
}
