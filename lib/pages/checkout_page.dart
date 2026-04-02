import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../theme/app_colors.dart';
import '../services/cart_provider.dart';
import '../services/user_provider.dart';
import '../services/sierra_api_service.dart';
import '../widgets/liquid_glass_card.dart';

class CheckoutPage extends StatefulWidget {
  const CheckoutPage({super.key});

  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  final _sierraApi = SierraApiService();
  String _selectedBranch = 'Mexicali Centro';
  bool _isProcessing = false;

  void _processPayment(CartProvider cart, UserProvider user) async {
    setState(() => _isProcessing = true);
    HapticFeedback.lightImpact();

    // Mock Stripe Delay
    await Future.delayed(const Duration(seconds: 2));

    // Submit to POS
    final orderSuccess = await _sierraApi.submitOrder({
      'userId': 'USER_001',
      'branch': _selectedBranch,
      'total': cart.finalTotal(user),
      'items': cart.items.map((i) => {'id': i.id, 'qty': i.quantity}).toList(),
    });

    if (mounted) {
      setState(() => _isProcessing = false);
      if (orderSuccess) {
        HapticFeedback.heavyImpact();
        user.addOrder({
          'items': cart.items.map((i) => i.name).join(', '),
          'total': cart.finalTotal(user),
          'branch': _selectedBranch,
        });
        // Mock points sync
        user.manualPointsSync(cart.subtotal * 0.05); 
        cart.clearCart();
        _showSuccessDialog();
      }
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A1A),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle_outline_rounded, size: 80, color: Colors.greenAccent),
            const SizedBox(height: 24),
            const Text('¡Buen provecho, Huarafan!', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            const Text(
              'Tu orden #882 ha sido recibida en cocina. Te avisaremos cuando esté lista.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white70),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.of(context).popUntil((route) => route.isFirst);
                },
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryYellow, foregroundColor: Colors.black),
                child: const Text('Volver al Inicio', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);
    final user = Provider.of<UserProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Finalizar Pedido')),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Sucursal de Recolección', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                _buildBranchSelector(),
                const SizedBox(height: 32),
                
                const Text('Información de Pago', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                _buildPaymentCard(),
                const SizedBox(height: 32),

                const Text('Resumen del Huara-Pedido', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                LiquidGlassCard(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      _buildSummaryRow('Total a pagar', '\$${cart.finalTotal(user).toStringAsFixed(2)}', isTotal: true),
                      const SizedBox(height: 4),
                      Text('Incluye IVA y Huara-Descuento (${user.tier.name})', style: const TextStyle(fontSize: 10, color: Colors.white38)),
                    ],
                  ),
                ),
                
                const SizedBox(height: 80),
              ],
            ),
          ),
          
          // Sticky Pay Button
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Colors.transparent, Colors.black],
                ),
              ),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: _isProcessing ? null : () => _processPayment(cart, user),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryYellow,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: _isProcessing
                      ? const CircularProgressIndicator(color: Colors.black)
                      : const Text('Pagar y Confirmar', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBranchSelector() {
    return LiquidGlassCard(
      padding: const EdgeInsets.all(8),
      child: Column(
        children: [
          _buildBranchOption('Mexicali Centro', 'Av. Reforma #123'),
          _buildBranchOption('Sucursal Aviación', 'Calz. Aviación #456'),
          _buildBranchOption('Sucursal Carranza', 'Calz. Carranza #789'),
        ],
      ),
    );
  }

  Widget _buildBranchOption(String name, String address) {
    bool isSelected = _selectedBranch == name;
    return ListTile(
      leading: Icon(Icons.location_on_rounded, color: isSelected ? AppColors.primaryYellow : Colors.white24),
      title: Text(name, style: TextStyle(fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
      subtitle: Text(address, style: const TextStyle(fontSize: 12, color: Colors.white30)),
      onTap: () => setState(() => _selectedBranch = name),
      trailing: isSelected ? const Icon(Icons.check_circle, color: AppColors.primaryYellow) : null,
    );
  }

  Widget _buildPaymentCard() {
    return LiquidGlassCard(
      padding: const EdgeInsets.all(20),
      child: const Row(
        children: [
          Icon(Icons.credit_card_rounded, color: AppColors.primaryYellow, size: 32),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Visa **** 4242', style: TextStyle(fontWeight: FontWeight.bold)),
                Text('Vence 12/28', style: TextStyle(fontSize: 12, color: Colors.white54)),
              ],
            ),
          ),
          Text('Cambiar', style: TextStyle(color: AppColors.primaryYellow, fontSize: 12, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(fontWeight: isTotal ? FontWeight.bold : FontWeight.normal)),
        Text(value, style: TextStyle(
          color: isTotal ? AppColors.primaryYellow : Colors.white,
          fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
          fontSize: isTotal ? 22 : 14,
        )),
      ],
    );
  }
}
