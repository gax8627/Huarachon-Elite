import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_colors.dart';
import '../widgets/liquid_glass_card.dart';
import '../services/user_provider.dart';
import 'login_page.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, String>> _slides = [
    {
      'title': 'Come Tacos, Gana Puntos',
      'subtitle': 'Cada vez que nos visites, escanea tu Huara-QR y acumula el 5% de tu consumo en cashback.',
      'icon': '🌮',
    },
    {
      'title': 'Sube al Nivel Oro',
      'subtitle': 'Entre más vengas, más ganas. Los Huarafanes Oro reciben hasta el 12% de regalo.',
      'icon': '🏆',
    },
    {
      'title': 'Premios y Tacos Gratis',
      'subtitle': 'Canjea tus puntos por tus favoritos. ¡El mejor sabor de Mexicali te está esperando!',
      'icon': '🎡',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [AppColors.backgroundDark, Colors.black],
              ),
            ),
          ),
          
          SafeArea(
            child: Column(
              children: [
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    onPageChanged: (int page) => setState(() => _currentPage = page),
                    itemCount: _slides.length,
                    itemBuilder: (context, index) {
                      return Padding(
                        padding: const EdgeInsets.all(40),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              _slides[index]['icon']!,
                              style: const TextStyle(fontSize: 100),
                            ),
                            const SizedBox(height: 60),
                            Text(
                              _slides[index]['title']!,
                              style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, letterSpacing: -1),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 24),
                            Text(
                              _slides[index]['subtitle']!,
                              style: const TextStyle(fontSize: 16, color: Colors.white70, height: 1.5),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                
                // Indicators & Buttons
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 40),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                          _slides.length,
                          (index) => Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            width: _currentPage == index ? 24 : 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: _currentPage == index ? AppColors.primaryYellow : Colors.white24,
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 48),
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          onPressed: () {
                            if (_currentPage == _slides.length - 1) {
                              Provider.of<UserProvider>(context, listen: false).completeOnboarding();
                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(builder: (_) => const LoginPage()),
                              );
                            } else {
                              _pageController.nextPage(
                                duration: const Duration(milliseconds: 300),
                                curve: Curves.easeInOut,
                              );
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primaryRed,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                          child: Text(
                            _currentPage == _slides.length - 1 ? 'Empezar ahora' : 'Siguiente',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
