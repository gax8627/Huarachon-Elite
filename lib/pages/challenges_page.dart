import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_colors.dart';
import '../services/user_provider.dart';
import '../widgets/liquid_glass_card.dart';

class ChallengesPage extends StatelessWidget {
  const ChallengesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Retos Huarafan')),
      body: Consumer<UserProvider>(
        builder: (context, user, child) {
          return ListView(
            padding: const EdgeInsets.all(24),
            children: [
              // Active Streak Challenge
              const Text(
                'Reto Activo',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryYellow),
              ),
              const SizedBox(height: 16),
              LiquidGlassCard(
                padding: const EdgeInsets.all(20),
                gradient: const LinearGradient(colors: [AppColors.darkRed, AppColors.primaryRed]),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Hero(
                          tag: 'hero-challenges',
                          child: Icon(Icons.flash_on_rounded, color: AppColors.primaryYellow, size: 28),
                        ),
                        SizedBox(width: 12),
                        Text('Racha de 3 Visitas', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text('Visita 3 veces en 14 días para ganar \$50 MXN extra.', style: TextStyle(color: Colors.white70)),
                    const SizedBox(height: 20),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: LinearProgressIndicator(
                        value: (user.visitHistory.length % 3) / 3,
                        backgroundColor: Colors.white10,
                        color: AppColors.primaryYellow,
                        minHeight: 10,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text('${user.visitHistory.length % 3}/3 visitas completadas', style: const TextStyle(fontSize: 12, color: Colors.white54)),
                  ],
                ),
              ),
              const SizedBox(height: 40),

              // Badges Section
              const Text(
                'Mis Medallas',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryYellow),
              ),
              const SizedBox(height: 16),
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 3,
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                children: [
                  _buildBadgeCard('Novato', Icons.emoji_events_rounded, true),
                  _buildBadgeCard('Pastor Pro', Icons.local_fire_department_rounded, user.earnedBadges.contains('Pastor Pro')),
                  _buildBadgeCard('Salsa Legend', Icons.whatshot_rounded, user.earnedBadges.contains('Salsa Legend')),
                  _buildBadgeCard('Cachanilla', Icons.location_on_rounded, user.earnedBadges.contains('Cachanilla')),
                  _buildBadgeCard('Noctámbulo', Icons.nights_stay_rounded, user.earnedBadges.contains('Noctámbulo')),
                  _buildBadgeCard('Fiel Huara', Icons.favorite_rounded, user.earnedBadges.contains('Fiel Huara')),
                ],
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildBadgeCard(String name, IconData icon, bool isEarned) {
    return LiquidGlassCard(
      padding: const EdgeInsets.all(8),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 32, color: isEarned ? AppColors.primaryYellow : Colors.white10),
          const SizedBox(height: 8),
          Text(
            name,
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isEarned ? Colors.white : Colors.white10),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
