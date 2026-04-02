import 'package:flutter/material.dart';
import 'user_provider.dart';

class CartItem {
  final String id;
  final String name;
  final double price;
  final int quantity;
  final Map<String, String>? options; // e.g. {"Salsa": "Verde", "Cebolla": "Sin"}

  CartItem({
    required this.id,
    required this.name,
    required this.price,
    this.quantity = 1,
    this.options,
  });

  CartItem copyWith({int? quantity}) {
    return CartItem(
      id: id,
      name: name,
      price: price,
      quantity: quantity ?? this.quantity,
      options: options,
    );
  }

  double get total => price * quantity;
}

class CartProvider extends ChangeNotifier {
  final List<CartItem> _items = [];
  
  List<CartItem> get items => List.unmodifiable(_items);

  void addItem(CartItem item) {
    int index = _items.indexWhere((i) => i.id == item.id && i.options == item.options);
    if (index != -1) {
      _items[index] = _items[index].copyWith(quantity: _items[index].quantity + item.quantity);
    } else {
      _items.add(item);
    }
    notifyListeners();
  }

  void removeItem(String id) {
    _items.removeWhere((item) => item.id == id);
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    notifyListeners();
  }

  double get subtotal => _items.fold(0, (sum, item) => sum + item.total);

  double calculateDiscount(UserProvider user) {
    double rate = 0.0;
    if (user.tier == HuaraTier.oro) rate = 0.12;
    else if (user.tier == HuaraTier.plata) rate = 0.08;
    else if (user.tier == HuaraTier.bronce) rate = 0.05;
    
    return subtotal * rate;
  }

  double get totalWithTax => subtotal * 1.08; // 8% IVA in Border Zone (Mexicali)

  double finalTotal(UserProvider user) {
    return (subtotal + (subtotal * 0.08)) - calculateDiscount(user);
  }

  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);
}
