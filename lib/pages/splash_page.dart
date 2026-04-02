import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_colors.dart';
import '../services/auth_service.dart';
import '../services/user_provider.dart';
import 'home_page.dart';
import 'main_navigation.dart';
import 'login_page.dart';
import 'onboarding_page.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    );

    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );

    _opacityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.0, 0.5, curve: Curves.easeIn)),
    );

    _controller.forward().then((_) {
      Future.delayed(const Duration(milliseconds: 500), () {
        if (mounted) {
          final auth = Provider.of<AuthService>(context, listen: false);
          final user = Provider.of<UserProvider>(context, listen: false);
          
          Navigator.pushReplacement(
            context,
            PageRouteBuilder(
              pageBuilder: (context, animation, secondaryAnimation) {
                if (!user.hasSeenOnboarding) return const OnboardingPage();
                return auth.status == AuthStatus.authenticated ? const MainNavigation() : const LoginPage();
              },
              transitionsBuilder: (context, animation, secondaryAnimation, child) {
                return FadeTransition(opacity: animation, child: child);
              },
            ),
          );
        }
      });
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: Center(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Opacity(
              opacity: _opacityAnimation.value,
              child: Transform.scale(
                scale: _scaleAnimation.value,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // LOGO placeholder
                    Container(
                      width: 150,
                      height: 150,
                      decoration: BoxDecoration(
                        color: AppColors.primaryRed,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primaryRed.withOpacity(0.4),
                            blurRadius: 40,
                            spreadRadius: 10,
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.restaurant_rounded,
                        size: 80,
                        color: AppColors.primaryYellow,
                      ),
                    ),
                    const SizedBox(height: 32),
                    Text(
                      'EL HUARACHÓN',
                      style: Theme.of(context).textTheme.displayLarge?.copyWith(
                            letterSpacing: 4,
                            color: AppColors.primaryYellow,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'TRADICIÓN Y SABOR',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            letterSpacing: 2,
                            color: Colors.white54,
                          ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
