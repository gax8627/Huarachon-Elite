import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import '../services/sierra_api_service.dart';
import '../services/security_service.dart';
import '../services/supabase_service.dart';

enum HuaraTier { bronce, plata, oro }

class UserProvider extends ChangeNotifier {
  final SierraApiService _sierra = SierraApiService();
  final SupabaseService _supabase = SupabaseService();
  
  double _balance = 128.50;
  String _name = 'Huarafan';
  DateTime? _birthday;
  DateTime? _lastSocialShareDate;
  String? lastPointsMessage;
  bool _hasSeenOnboarding = false;
  
  String? _favoriteItemId;
  int _favoriteQty = 1;
  final List<Map<String, dynamic>> _digitalOrders = [];

  // Preferences
  String? favoriteMeat;
  String? favoriteTortilla;
  String? favoriteSpice;

  UserProvider() {
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    final profile = await _supabase.getProfile();
    if (profile != null) {
      _name = profile['full_name'] ?? _name;
      favoriteMeat = profile['favorite_meat'];
      // Load other fields as needed
      notifyListeners();
    }
    
    final history = await _supabase.fetchOrderHistory();
    _digitalOrders.clear();
    for (var item in history) {
      _digitalOrders.add(item as Map<String, dynamic>);
    }
    notifyListeners();
  }

  bool get hasSeenOnboarding => _hasSeenOnboarding;
  String? get favoriteItemId => _favoriteItemId;
  int get favoriteQty => _favoriteQty;
  List<Map<String, dynamic>> get digitalOrders => List.unmodifiable(_digitalOrders);
  DateTime? get lastSocialShareDate => _lastSocialShareDate;

  bool get canClaimSocialReward {
    if (_lastSocialShareDate == null) return true;
    final now = DateTime.now();
    return _lastSocialShareDate!.day != now.day || 
           _lastSocialShareDate!.month != now.month || 
           _lastSocialShareDate!.year != now.year;
  }

  void sharePostForPoints() {
    if (!canClaimSocialReward) return;
    _lastSocialShareDate = DateTime.now();
    addPoints(20); 
    lastPointsMessage = '¡Sabor compartido! ✨ +\$20 Huara-Puntos';
    notifyListeners();
  }

  void completeOnboarding() {
    _hasSeenOnboarding = true;
    notifyListeners();
  }

  Future<void> addOrder(Map<String, dynamic> order) async {
    final success = await _supabase.saveOrder(order);
    if (success) {
      _digitalOrders.insert(0, {
        ...order,
        'created_at': DateTime.now().toIso8601String(),
      });
      notifyListeners();
    }
  }

  void setFavoriteOrder(String itemId, int qty) {
    _favoriteItemId = itemId;
    _favoriteQty = qty;
    notifyListeners();
  }

  String get favoriteOrderQrString {
    final userId = _supabase.currentUser?.id ?? "001";
    if (_favoriteItemId == null) return "EL_HUARACHON_USER_$userId";
    return "FAV_ORDER:$_favoriteItemId:$_favoriteQty:$userId";
  }

  void setBirthday(DateTime date) {
    _birthday = date;
    notifyListeners();
  }

  List<DateTime> visitHistory = [];
  String referralCode = 'HUARA-${(1000 + (DateTime.now().millisecond % 8999)).toString()}';
  List<String> earnedBadges = ['Novato'];

  double get balance => _balance;
  String get name => _name;
  DateTime? get birthday => _birthday;

  HuaraTier get tier {
    if (visitHistory.length >= 25) return HuaraTier.oro;
    if (visitHistory.length >= 10) return HuaraTier.plata;
    return HuaraTier.bronce;
  }

  double get cashbackRate {
    switch (tier) {
      case HuaraTier.oro: return 0.12;
      case HuaraTier.plata: return 0.08;
      case HuaraTier.bronce: return 0.05;
    }
  }

  void addBalance(double amount) {
    _balance += amount;
    visitHistory.add(DateTime.now());
    lastPointsMessage = '¡Qué chulada! Acabas de ganar \$${amount.toStringAsFixed(0)} Huara-puntos.';
    HapticFeedback.mediumImpact();
    notifyListeners();
  }

  void manualPointsSync(double amount) => addBalance(amount);

  Future<void> syncBalanceWithSierra() async {
    final officialBalance = await _sierra.syncBalance(_name);
    _balance = officialBalance;
    notifyListeners();
  }

  void spendBalance(double amount) {
    if (_balance >= amount) {
      _balance -= amount;
      notifyListeners();
    }
  }

  bool processQRCode(String code) {
    if (SecurityService.verifySignedQR(code)) {
      final parts = code.split(':');
      final data = parts[1];
      if (data.startsWith('ADD_')) {
        final amountString = data.substring(4);
        final amount = double.tryParse(amountString) ?? 0.0;
        addBalance(amount);
        return true;
      }
    }
    return false;
  }
  void addPoints(double amount) => addBalance(amount);
}
