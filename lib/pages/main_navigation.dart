import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import 'home_page.dart';
import 'menu_page.dart';
import 'rewards_page.dart';
import 'locations_page.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    const HomePage(),
    const MenuPage(),
    const RewardsPage(),
    const LocationsPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(
            top: BorderSide(color: Colors.white.withOpacity(0.1), width: 0.5),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) {
            setState(() {
              _selectedIndex = index;
            });
          },
          backgroundColor: AppColors.backgroundDark,
          selectedItemColor: AppColors.primaryYellow,
          unselectedItemColor: Colors.white38,
          type: BottomNavigationBarType.fixed,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_rounded),
              label: 'Huarafans',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.restaurant_menu_rounded),
              label: 'Menú',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.star_rounded),
              label: 'Puntos',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.store_rounded),
              label: 'Sucursales',
            ),
          ],
        ),
      ),
    );
  }
}
