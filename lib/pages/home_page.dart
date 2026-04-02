import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../theme/app_colors.dart';
import '../widgets/liquid_glass_card.dart';
import '../services/user_provider.dart';
import 'qr_scanner_page.dart';
import 'preferences_survey_page.dart';
import 'challenges_page.dart';
import 'referral_page.dart';
import '../widgets/lto_banner_widget.dart';
import '../widgets/pulse_animation.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  void _showLoyaltyQR(BuildContext context, String userName) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => LiquidGlassCard(
        margin: const EdgeInsets.all(24),
        padding: const EdgeInsets.all(32),
        borderRadius: 32,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Escanea en Caja',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryYellow),
            ),
            const SizedBox(height: 24),
            PulseAnimation(
              child: QrImageView(
                data: 'SIERRA-USER-$userName',
                version: QrVersions.auto,
                size: 200.0,
                foregroundColor: Colors.white,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Acomula Huara-puntos al instante',
              style: TextStyle(color: Colors.white54, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Huarafans'),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.notifications_none_rounded),
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.person_outline_rounded),
          ),
        ],
      ),
      body: Stack(
        children: [
          // Background Gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  AppColors.darkRed,
                  AppColors.backgroundDark,
                ],
              ),
            ),
          ),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Balance Card
                  Consumer<UserProvider>(
                    builder: (context, user, child) {
                      final nextTier = user.tier == HuaraTier.bronce ? 'Plata' : 'Oro';
                      final targetVisits = user.tier == HuaraTier.bronce ? 10 : 25;
                      final progress = (user.visitHistory.length / targetVisits).clamp(0.0, 1.0);
                      
                      Color tierColor;
                      LinearGradient tierGradient;
                      String tierName;

                      switch (user.tier) {
                        case HuaraTier.oro:
                          tierColor = const Color(0xFFFFD700);
                          tierGradient = const LinearGradient(colors: [Color(0xFFB8860B), Color(0xFFFFD700), Color(0xFFDAA520)]);
                          tierName = 'Huara-Oro';
                          break;
                        case HuaraTier.plata:
                          tierColor = const Color(0xFFC0C0C0);
                          tierGradient = const LinearGradient(colors: [Color(0xFF708090), Color(0xFFC0C0C0)]);
                          tierName = 'Huara-Plata';
                          break;
                        default:
                          tierColor = const Color(0xFFFFCC33);
                          tierGradient = const LinearGradient(colors: [AppColors.darkRed, AppColors.primaryRed]);
                          tierName = 'Huara-Bronce';
                      }

                      return LiquidGlassCard(
                        padding: const EdgeInsets.all(24),
                        gradient: tierGradient,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      tierName.toUpperCase(),
                                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: tierColor, letterSpacing: 2),
                                    ),
                                    const SizedBox(height: 4),
                                    const Text('Puntos Huarachón', style: TextStyle(fontSize: 14, color: Colors.white70)),
                                    const SizedBox(height: 8),
                                    Text(
                                      '\$${user.balance.toStringAsFixed(2)}',
                                      style: const TextStyle(fontSize: 38, fontWeight: FontWeight.bold, letterSpacing: -1),
                                    ),
                                  ],
                                ),
                                InkWell(
                                  onTap: () {
                                    HapticFeedback.lightImpact();
                                    _showLoyaltyQR(context, user.name);
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(16)),
                                    child: const Icon(Icons.qr_code_2_rounded, size: 32),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 20),
                            if (user.tier != HuaraTier.oro) ...[
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '${targetVisits - user.visitHistory.length} visitas para $nextTier',
                                    style: const TextStyle(fontSize: 11, color: Colors.white60),
                                  ),
                                  Text('${(progress * 100).toInt()}%', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: tierColor)),
                                ],
                              ),
                              const SizedBox(height: 8),
                              ClipRRect(
                                borderRadius: BorderRadius.circular(4),
                                child: LinearProgressIndicator(
                                  value: progress,
                                  backgroundColor: Colors.white10,
                                  color: tierColor,
                                  minHeight: 4,
                                ),
                              ),
                            ] else ...[
                              const Row(
                                children: [
                                  Icon(Icons.workspace_premium_rounded, color: Color(0xFFFFD700), size: 14),
                                  SizedBox(width: 8),
                                  Text('Beneficios Oro: 12% Cashback Activado', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFFFD700))),
                                ],
                              ),
                            ],
                          ],
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 32),
                  const LtoBannerWidget(
                    title: 'PROMO DEL DÍA 🌮',
                    subtitle: 'Gana Doble Puntos en todos los Tacos al Pastor. ¡Solo hoy!',
                    icon: Icons.local_fire_department_rounded,
                    baseColor: AppColors.primaryRed,
                  ),
                  const Text('Gana Más Puntos', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryYellow)),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 120,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      children: [
                        _buildEngagementTile(
                          context,
                          'Retos Huarafan',
                          'Completa rachas y gana \$50',
                          Icons.flash_on_rounded,
                          AppColors.primaryRed,
                          'hero-challenges',
                          () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ChallengesPage())),
                        ),
                        _buildEngagementTile(
                          context,
                          'Invita Amigos',
                          'Gana \$20 por cada invitado',
                          Icons.group_add_rounded,
                          AppColors.darkRed,
                          'hero-referral',
                          () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ReferralPage())),
                        ),
                        _buildEngagementTile(
                          context,
                          'Comparte y Gana',
                          '+\$20 Huara-puntos diario',
                          Icons.share_rounded,
                          const Color(0xFFC2185B),
                          'hero-share',
                          () {
                            final user = Provider.of<UserProvider>(context, listen: false);
                            if (user.canClaimSocialReward) {
                              _showShareDialog(context, user);
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('¡Ya reclamaste tus puntos de hoy! Vuelve mañana.')),
                              );
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  
                  // Favorite Order Section
                  Consumer<UserProvider>(
                    builder: (context, user, child) => _buildFavoriteSection(context, user),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  Consumer<UserProvider>(
                    builder: (context, user, child) {
                      if (user.favoriteMeat == null) return const SizedBox.shrink();
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Especial para tu antojo de ${user.favoriteMeat}',
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryYellow),
                          ),
                          const SizedBox(height: 16),
                          LiquidGlassCard(
                            padding: const EdgeInsets.all(20),
                            gradient: const LinearGradient(colors: [AppColors.primaryRed, AppColors.darkRed]),
                            child: Row(
                              children: [
                                const Icon(Icons.auto_awesome_rounded, color: AppColors.primaryYellow, size: 32),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        '2x1 en todos los Tacos de ${user.favoriteMeat}',
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                      ),
                                      const Text(
                                        'Solo por hoy. ¡Aprovecha tu favorito!',
                                        style: TextStyle(fontSize: 12, color: Colors.white70),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 32),
                        ],
                      );
                    },
                  ),
                  Consumer<UserProvider>(
                    builder: (context, user, child) {
                      if (user.favoriteMeat != null) return const SizedBox.shrink();
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 32),
                        child: InkWell(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const PreferencesSurveyPage()),
                            );
                          },
                          child: LiquidGlassCard(
                            padding: const EdgeInsets.all(20),
                            child: Row(
                              children: [
                                const Icon(Icons.stars_rounded, color: AppColors.primaryYellow, size: 28),
                                const SizedBox(width: 16),
                                const Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('¡Personaliza tu sabor!', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                      Text('Dinos tus gustos y recibe bonos exclusivos.', style: TextStyle(fontSize: 12, color: Colors.white70)),
                                    ],
                                  ),
                                ),
                                Icon(Icons.arrow_forward_ios_rounded, size: 16, color: Colors.white.withOpacity(0.24)),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                  const Text(
                    'Promociones Especiales',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.1,
                    ),
                  ),
                  const SizedBox(height: 20),
                  // Promo Slider Placeholder
                  SizedBox(
                    height: 200,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      children: [
                        _buildPromoCard(
                          'Miércoles de Tacos',
                          '3 TACOS EL HUARACHÓN POR EL PRECIO DE 2',
                          Icons.restaurant,
                        ),
                        _buildPromoCard(
                          'Súper Combo',
                          '1 SÚPER TACO + 1 AGUA FRESH POR \$189',
                          Icons.local_drink_rounded,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  const Text(
                    'Pide y Recoge',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Quick Actions Bar
                  Row(
                    children: [
                      Expanded(
                        child: _buildActionTile(
                          'Independencia',
                          Icons.location_on_rounded,
                          AppColors.primaryRed,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildActionTile(
                          'Gómez Morín',
                          Icons.location_on_rounded,
                          AppColors.primaryYellow.withOpacity(0.8),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPromoCard(String title, String subtitle, IconData icon) {
    return Container(
      width: 280,
      margin: const EdgeInsets.only(right: 16),
      child: LiquidGlassCard(
        padding: EdgeInsets.zero,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: AppColors.primaryRed.withOpacity(0.3),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                ),
                child: Center(
                  child: Icon(icon, size: 64, color: AppColors.primaryYellow),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 4),
                  Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.white60)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionTile(String title, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildEngagementTile(BuildContext context, String title, String subtitle, IconData icon, Color color, String heroTag, VoidCallback onTap) {
    return Container(
      width: 200,
      margin: const EdgeInsets.only(right: 16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(24),
        child: LiquidGlassCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Hero(
                tag: heroTag,
                child: Icon(icon, color: color, size: 28),
              ),
              const SizedBox(height: 12),
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              Text(subtitle, style: const TextStyle(fontSize: 11, color: Colors.white60)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFavoriteSection(BuildContext context, UserProvider user) {
    final bool hasFavorite = user.favoriteItemId != null;
    
    return LiquidGlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Mi Favorito 🌮', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              if (hasFavorite)
                const Icon(Icons.check_circle_rounded, color: AppColors.primaryYellow, size: 20),
            ],
          ),
          const SizedBox(height: 16),
          if (hasFavorite)
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(user.favoriteItemId!, style: const TextStyle(fontWeight: FontWeight.bold)),
                      Text('Cantidad: ${user.favoriteQty}', style: const TextStyle(fontSize: 12, color: Colors.white70)),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: () => _showQrModal(context, user.favoriteOrderQrString, isFavorite: true),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryYellow,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Pedir Ya', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            )
          else
            const Text(
              'Aún no tienes un pedido favorito. ¡Guarda uno para pedir más rápido!',
              style: TextStyle(fontSize: 12, color: Colors.white54),
            ),
        ],
      ),
    );
  }

  void _showQrModal(BuildContext context, String qrData, {bool isFavorite = false}) {
    HapticFeedback.mediumImpact();
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.7,
        decoration: const BoxDecoration(
          color: Color(0xFF1A1A1A),
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.white12, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 32),
            Text(
              isFavorite ? '¡Tu Favorito está listo! 🌮' : 'Mi Huara-ID',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              isFavorite ? 'Escanea en caja para procesar tu orden usual.' : 'Muestra este código en caja.',
              style: const TextStyle(color: Colors.white60),
            ),
            const SizedBox(height: 48),
            LiquidGlassCard(
              padding: const EdgeInsets.all(24),
              child: Image.network(
                'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=$qrData',
                width: 200,
                height: 200,
              ),
            ),
            const SizedBox(height: 48),
            const Text('ID: HUARA-ELITE-V01', style: TextStyle(letterSpacing: 4, color: Colors.white30, fontSize: 10)),
          ],
        ),
      ),
    );
  }

  void _showShareDialog(BuildContext context, UserProvider user) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => LiquidGlassCard(
        margin: const EdgeInsets.all(24),
        padding: const EdgeInsets.all(32),
        borderRadius: 32,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('📣 Comparte el Sabor', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            const Text(
              'Comparte Huarachón con tus amigos y gana \$20 Huara-puntos al instante.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white70),
            ),
            const SizedBox(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildShareOption(Icons.camera_alt_rounded, 'Instagram', const Color(0xFFE1306C), () => _handleShare(context, user)),
                _buildShareOption(Icons.message_rounded, 'WhatsApp', const Color(0xFF25D366), () => _handleShare(context, user)),
              ],
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildShareOption(IconData icon, String label, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: color.withOpacity(0.2), shape: BoxShape.circle),
            child: Icon(icon, color: color, size: 32),
          ),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(fontSize: 12)),
        ],
      ),
    );
  }

  void _handleShare(BuildContext context, UserProvider user) {
    Navigator.pop(context);
    // Simulating share intent
    user.sharePostForPoints();
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('¡Gracias por compartir! Se han añadido \$20 a tu cuenta.'),
        backgroundColor: AppColors.primaryRed,
      ),
    );
  }
}
