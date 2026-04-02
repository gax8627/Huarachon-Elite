import 'dart:async';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  Future<void> init() async {
    // Web Stub: Notifications not supported in preview environment
  }

  Future<void> showProximityAlert(String branchName) async {
    // Web Stub: Visual preview only
    print('Notification simulation: Estás cerca de $branchName');
  }
}
