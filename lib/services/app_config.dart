class AppConfig {
  // Production Endpoints
  static const String sierraBaseUrl = 'https://api.sierra.com.mx/v1';
  static const String firebaseFunctionsUrl = 'https://us-central1-huarachon-elite.cloudfunctions.net';

  // Branding & Program Rules
  static const int pointExpirationDays = 180;
  static const double baseCashbackRate = 0.05;
  static const double plataCashbackRate = 0.08;
  static const double oroCashbackRate = 0.12;

  // Support
  static const String supportEmail = 'ayuda@elhuarachon.mx';
  static const String websiteUrl = 'https://www.elhuarachon.com.mx';

  // Mock Mode (Set to false for real production)
  static const bool useMockData = true;
}
