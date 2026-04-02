import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_colors.dart';
import '../services/cart_provider.dart';
import '../services/user_provider.dart';
import '../widgets/liquid_glass_card.dart';
import 'checkout_page.dart';

class CartPage extends StatelessWidget {
  const CartPage({super.key});

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);
    final user = Provider.of<UserProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Tu Carrito 🌮')),
      body: cart.items.isEmpty
          ? _buildEmptyState(context)
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(24),
                    itemCount: cart.items.length,
                    itemBuilder: (context, index) {
                      final item = cart.items[index];
                      return _buildCartTile(context, item, cart);
                    },
                  ),
                ),
                _buildSummaryCard(context, cart, user),
              ],
            ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.shopping_basket_outlined, size: 80, color: Colors.white24),
          const SizedBox(height: 24),
          const Text('Tu carrito está vacío', style: TextStyle(fontSize: 20, color: Colors.white70)),
          const SizedBox(height: 12),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('¡Vamos por unos tacos!', style: TextStyle(color: AppColors.primaryYellow)),
          ),
        ],
      ),
    );
  }

  Widget _buildCartTile(BuildContext context, CartItem item, CartProvider cart) {
    return LiquidGlassCard(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text('Salsa: ${item.options?['Salsa']}', style: const TextStyle(fontSize: 12, color: Colors.white60)),
                Text('\$${item.price} x ${item.quantity}', style: const TextStyle(fontSize: 12, color: AppColors.primaryYellow)),
              ],
            ),
          ),
          Text('\$${item.total.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(width: 12),
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded, color: Colors.white38),
            onPressed: () => cart.removeItem(item.id),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(BuildContext context, CartProvider cart, UserProvider user) {
    double subtotal = cart.subtotal;
    double discount = cart.calculateDiscount(user);
    double tax = subtotal * 0.08;
    double total = cart.finalTotal(user);

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        border: Border(top: BorderSide(color: Colors.white12)),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: SafeArea(
        child: Column(
          children: [
            _buildSummaryRow('Subtotal', '\$${subtotal.toStringAsFixed(2)}'),
            const SizedBox(height: 8),
            _buildSummaryRow('Descuento (${user.tier.name})', '-\$${discount.toStringAsFixed(2)}', isDiscount: true),
            const SizedBox(height: 8),
            _buildSummaryRow('Impuestos (IVA 8%)', '\$${tax.toStringAsFixed(2)}'),
            const Divider(color: Colors.white12, height: 32),
            _buildSummaryRow('Total', '\$${total.toStringAsFixed(2)}', isTotal: true),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const CheckoutPage()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryRed,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text('Proceder al Pago', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isDiscount = false, bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(
          color: isTotal ? Colors.white : Colors.white70,
          fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
          fontSize: isTotal ? 18 : 14,
        )),
        Text(value, style: TextStyle(
          color: isDiscount ? Colors.greenAccent : (isTotal ? AppColors.primaryYellow : Colors.white),
          fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
          fontSize: isTotal ? 22 : 14,
        )),
      ],
    );
  }
}
