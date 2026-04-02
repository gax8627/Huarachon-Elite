import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_colors.dart';
import '../services/auth_service.dart';
import '../widgets/liquid_glass_card.dart';
import 'home_page.dart';
import 'main_navigation.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleSignIn(Future<bool> Function() signInMethod) async {
    final success = await signInMethod();
    if (success && mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const MainNavigation()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Dynamic Background Orbs
          AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return Stack(
                children: [
                  Positioned(
                    top: 100 + (20 * _controller.value),
                    left: -50 + (30 * _controller.value),
                    child: _buildOrb(250, AppColors.primaryRed.withOpacity(0.3)),
                  ),
                  Positioned(
                    bottom: 150 - (40 * _controller.value),
                    right: -80 + (20 * _controller.value),
                    child: _buildOrb(300, AppColors.primaryYellow.withOpacity(0.2)),
                  ),
                ],
              );
            },
          ),
          
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(32),
                child: LiquidGlassCard(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Logo Placeholder
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: const BoxDecoration(
                          color: AppColors.primaryRed,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.restaurant_rounded, size: 48, color: AppColors.primaryYellow),
                      ),
                      const SizedBox(height: 24),
                      const Text(
                        '¡Bienvenido Huarafan!',
                        style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, letterSpacing: -0.5),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Ingresa para acumular puntos y ganar premios.',
                        style: TextStyle(fontSize: 14, color: Colors.white60),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 32),
                      
                      // Social Buttons
                      _buildSocialButton(
                        'Continuar con Google',
                        Icons.g_mobiledata_rounded,
                        Colors.white,
                        Colors.black87,
                        () => _handleSignIn(Provider.of<AuthService>(context, listen: false).signInWithGoogle),
                      ),
                      const SizedBox(height: 16),
                      _buildSocialButton(
                        'Continuar con Apple',
                        Icons.apple_rounded,
                        Colors.black,
                        Colors.white,
                        () => _handleSignIn(Provider.of<AuthService>(context, listen: false).signInWithApple),
                      ),
                      
                      const SizedBox(height: 32),
                      const Row(
                        children: [
                          Expanded(child: Divider(color: Colors.white10)),
                          Padding(
                            padding: EdgeInsets.symmetric(horizontal: 16),
                            child: Text('O con tu correo', style: TextStyle(color: Colors.white24, fontSize: 12)),
                          ),
                          Expanded(child: Divider(color: Colors.white10)),
                        ],
                      ),
                      const SizedBox(height: 32),
                      
                      _buildTextField('Correo Electrónico', Icons.email_outlined, _emailController),
                      const SizedBox(height: 16),
                      _buildTextField('Contraseña', Icons.lock_outline_rounded, _passwordController, isPassword: true),
                      
                      const SizedBox(height: 32),
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          onPressed: () => _handleSignIn(() => Provider.of<AuthService>(context, listen: false).loginWithEmail(_emailController.text, _passwordController.text)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primaryYellow,
                            foregroundColor: Colors.black,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                          child: const Text('Iniciar Sesión', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrb(double size, Color color) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.5),
            blurRadius: 100,
            spreadRadius: 20,
          ),
        ],
      ),
    );
  }

  Widget _buildSocialButton(String label, IconData icon, Color bg, Color text, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: Colors.black26, blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: text, size: 28),
            const SizedBox(width: 12),
            Text(label, style: TextStyle(color: text, fontWeight: FontWeight.bold, fontSize: 15)),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(String hint, IconData icon, TextEditingController controller, {bool isPassword = false}) {
    return TextField(
      controller: controller,
      obscureText: isPassword,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(color: Colors.white30, fontSize: 14),
        prefixIcon: Icon(icon, color: AppColors.primaryYellow, size: 20),
        filled: true,
        fillColor: Colors.white10,
        contentPadding: const EdgeInsets.symmetric(vertical: 18),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}
