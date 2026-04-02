import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import 'liquid_glass_card.dart';

class LtoBannerWidget extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color baseColor;

  const LtoBannerWidget({
    super.key,
    required this.title,
    required this.subtitle,
    required this.icon,
    this.baseColor = AppColors.primaryRed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      child: LiquidGlassCard(
        padding: const EdgeInsets.all(20),
        gradient: LinearGradient(
          colors: [baseColor.withOpacity(0.8), baseColor.withOpacity(0.4)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: AppColors.primaryYellow, size: 32),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 13,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white24, size: 16),
          ],
        ),
      ),
    );
  }
}
