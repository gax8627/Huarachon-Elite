import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_colors.dart';
import '../widgets/liquid_glass_card.dart';
import '../services/user_provider.dart';
import 'admin/admin_login_page.dart';

class RewardsPage extends StatelessWidget {
  const RewardsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mi Billetera'),
        actions: [
          IconButton(
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminLoginPage())),
            icon: const Icon(Icons.admin_panel_settings_rounded, color: AppColors.primaryYellow),
          ),
        ],
      ),
      body: Consumer<UserProvider>(
        builder: (context, user, child) {
          final tierName = user.tier == HuaraTier.oro ? 'ORO' : (user.tier == HuaraTier.plata ? 'PLATA' : 'BRONCE');
          
          return SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Digital Pass Card
                LiquidGlassCard(
                  padding: const EdgeInsets.all(24),
                  gradient: user.tier == HuaraTier.oro 
                    ? const LinearGradient(colors: [Color(0xFFB8860B), Color(0xFFFFD700)]) 
                    : null,
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Icon(Icons.stars_rounded, color: AppColors.primaryYellow, size: 28),
                          Text('NIVEL $tierName', style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2)),
                        ],
                      ),
                      const SizedBox(height: 32),
                      const Text('Saldo Disponible', style: TextStyle(color: Colors.white70)),
                      Text(
                        '\$${user.balance.toStringAsFixed(2)}',
                        style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 32),
                      const Divider(color: Colors.white10),
                      const SizedBox(height: 16),
                      const Text(
                        'Escanea este código en cualquier sucursal para acumular o canjear puntos.',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 12, color: Colors.white54),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // Wallet Buttons
                Row(
                  children: [
                    Expanded(
                      child: _buildWalletButton(
                        'Apple Wallet',
                        Icons.apple,
                        Colors.black,
                        () => _showToast(context, 'Agregando a Apple Wallet...'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildWalletButton(
                        'Google Wallet',
                        Icons.wallet_rounded,
                        const Color(0xFF4285F4),
                        () => _showToast(context, 'Agregando a Google Wallet...'),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 40),
                const Text(
                  'Mis Pedidos Digitales 🌮',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                if (user.digitalOrders.isEmpty)
                  const Text('No has hecho pedidos desde la app aún.', style: TextStyle(color: Colors.white38, fontSize: 13))
                else
                  ...user.digitalOrders.map((order) => _buildOrderTile(order)).toList(),

                const SizedBox(height: 40),
                const Text(
                  'Historial de Puntos',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                _buildHistoryItem('Tacos de Asada - Independencia', '+ \$12.50', 'Hoy, 14:30'),
                _buildHistoryItem('Canje: Taco de Pastor', '- \$56.00', 'Ayer, 20:15'),
                _buildHistoryItem('Bono Huara-Elite', '+ \$50.00', '25 Mar'),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildOrderTile(Map<String, dynamic> order) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: LiquidGlassCard(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            const Icon(Icons.receipt_long_rounded, color: AppColors.primaryYellow),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(order['items'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14), maxLines: 1, overflow: TextOverflow.ellipsis),
                  Text('Sucursal: ${order['branch']}', style: const TextStyle(fontSize: 11, color: Colors.white54)),
                ],
              ),
            ),
            Text('\$${order['total'].toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.greenAccent)),
          ],
        ),
      ),
    );
  }

  Widget _buildWalletButton(String label, IconData icon, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white10),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.white, size: 20),
            const SizedBox(width: 8),
            Text(
              label,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }

  void _showToast(BuildContext context, String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Widget _buildHistoryItem(String title, String amount, String date) {
    final isNegative = amount.startsWith('-');
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: LiquidGlassCard(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(
              isNegative ? Icons.remove_circle_outline : Icons.add_circle_outline,
              color: isNegative ? AppColors.primaryRed : Colors.green,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  Text(date, style: const TextStyle(fontSize: 11, color: Colors.white54)),
                ],
              ),
            ),
            Text(
              amount,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: isNegative ? Colors.white : AppColors.primaryYellow,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
