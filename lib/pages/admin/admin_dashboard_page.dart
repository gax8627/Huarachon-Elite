import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../../widgets/liquid_glass_card.dart';

class AdminDashboardPage extends StatelessWidget {
  const AdminDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Huara-Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Sucursal Mexicali Centro', style: TextStyle(fontSize: 14, color: AppColors.primaryYellow)),
            const SizedBox(height: 8),
            const Text('Resumen del Día 🌮', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 32),
            
            // Metrics Row
            Row(
              children: [
                Expanded(child: _buildMetric('Visitas', '142', Icons.people_rounded)),
                const SizedBox(width: 16),
                Expanded(child: _buildMetric('Puntos', '12.8k', Icons.star_rounded)),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _buildMetric('Favoritos', '89', Icons.favorite_rounded)),
                const SizedBox(width: 16),
                Expanded(child: _buildMetric('Rating', '4.9', Icons.thumb_up_rounded)),
              ],
            ),
            
            const SizedBox(height: 48),
            
            // Promo Center
            const Text('Centro de Promociones (FCM)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            LiquidGlassCard(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  TextField(
                    decoration: InputDecoration(
                      labelText: 'Título de la Promo',
                      labelStyle: TextStyle(color: Colors.white60),
                      focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: AppColors.primaryYellow)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    decoration: InputDecoration(
                      labelText: 'Mensaje Cachanilla',
                      labelStyle: TextStyle(color: Colors.white60),
                      focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: AppColors.primaryYellow)),
                    ),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('¡Promo enviada a todos los Huarafanes! 📣')),
                        );
                      },
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryRed),
                      icon: const Icon(Icons.send_rounded),
                      label: const Text('Enviar Notificación Gratis', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 40),
            
            // Leaderboard
            const Text('Top Huarafanes 🏆', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildUserTile('Gaxiola', 'Level Oro', '3,450 pts'),
            _buildUserTile('Mireles', 'Level Plata', '1,200 pts'),
            _buildUserTile('Castañeda', 'Level Bronce', '450 pts'),
          ],
        ),
      ),
    );
  }

  Widget _buildMetric(String label, String value, IconData icon) {
    return LiquidGlassCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Icon(icon, color: AppColors.primaryYellow, size: 28),
          const SizedBox(height: 12),
          Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.white54)),
        ],
      ),
    );
  }

  Widget _buildUserTile(String name, String level, String points) {
    return Card(
      color: Colors.white.withOpacity(0.05),
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: CircleAvatar(backgroundColor: AppColors.primaryYellow, child: Text(name[0])),
        title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(level, style: const TextStyle(fontSize: 12, color: Colors.white54)),
        trailing: Text(points, style: const TextStyle(color: AppColors.primaryYellow, fontWeight: FontWeight.bold)),
      ),
    );
  }
}
