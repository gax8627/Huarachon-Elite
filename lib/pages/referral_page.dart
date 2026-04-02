import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../theme/app_colors.dart';
import '../services/user_provider.dart';
import '../widgets/liquid_glass_card.dart';

class ReferralPage extends StatelessWidget {
  const ReferralPage({super.key});

  void _shareViaWhatsApp(String code) {
    final message = '¡Te invito unos tacos! Regístrate en la app de El Huarachón con mi código $code y ambos ganamos puntos para comer gratis. 🌮🔥';
    final url = 'whatsapp://send?text=${Uri.encodeComponent(message)}';
    launchUrl(Uri.parse(url));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Invita y Gana')),
      body: Consumer<UserProvider>(
        builder: (context, user, child) {
          return Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              children: [
                const Icon(Icons.group_add_rounded, size: 80, color: AppColors.primaryYellow),
                const SizedBox(height: 24),
                const Text(
                  '¡Huarefans Unidos!',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                const Text(
                  'Comparte tu código con amigos. Cuando usen la app por primera vez, ¡les regalamos \$20 MXN a ambos!',
                  style: TextStyle(fontSize: 16, color: Colors.white70),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 48),
                
                // Referral Code Card
                LiquidGlassCard(
                  padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 24),
                  child: Column(
                    children: [
                      const Text('TU CÓDIGO:', style: TextStyle(fontSize: 14, color: Colors.white54, letterSpacing: 2)),
                      const SizedBox(height: 12),
                      Text(
                        user.referralCode,
                        style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: AppColors.primaryYellow),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton.icon(
                        onPressed: () => _shareViaWhatsApp(user.referralCode),
                        icon: const Icon(Icons.share_rounded),
                        label: const Text('Compartir en WhatsApp', style: TextStyle(fontWeight: FontWeight.bold)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green.shade600,
                          foregroundColor: Colors.white,
                          minimumSize: const Size(double.infinity, 50),
                        ),
                      ),
                    ],
                  ),
                ),
                
                const Spacer(),
                const Text('Válido para nuevos registros únicamente.', style: TextStyle(fontSize: 12, color: Colors.white24)),
              ],
            ),
          );
        },
      ),
    );
  }
}
