import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../theme/app_colors.dart';
import '../services/cart_provider.dart';
import '../widgets/liquid_glass_card.dart';
import '../widgets/product_customizer_modal.dart';
import 'cart_page.dart';

class MenuPage extends StatefulWidget {
  const MenuPage({super.key});

  @override
  State<MenuPage> createState() => _MenuPageState();
}

class _MenuPageState extends State<MenuPage> with SingleTickerProviderStateMixin {
  TabController? _tabController;
  Map<String, dynamic>? _menuData;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadMenu();
  }

  Future<void> _loadMenu() async {
    try {
      final String response = await rootBundle.loadString('assets/data/menu.json');
      final data = await json.decode(response);
      setState(() {
        _menuData = data;
        _tabController = TabController(length: data['categories'].length, vsync: this);
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error loading menu: $e');
    }
  }

  @override
  void dispose() {
    _tabController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator(color: AppColors.primaryYellow)),
      );
    }

    final categories = _menuData!['categories'] as List<dynamic>;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Menú Huarachón'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          indicatorColor: AppColors.primaryYellow,
          labelColor: AppColors.primaryYellow,
          unselectedLabelColor: Colors.white60,
          tabs: categories.map((cat) => Tab(text: cat['name'])).toList(),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: categories.map((cat) => _buildGrid(cat['items'] as List<dynamic>, cat['name'])).toList(),
      ),
      floatingActionButton: Consumer<CartProvider>(
        builder: (context, cart, child) {
          if (cart.itemCount == 0) return const SizedBox.shrink();
          return FloatingActionButton.extended(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CartPage()),
              );
            },
            backgroundColor: AppColors.primaryRed,
            icon: const Icon(Icons.shopping_cart_rounded),
            label: Text('Ver Carrito (${cart.itemCount})'),
          );
        },
      ),
    );
  }

  Widget _buildGrid(List<dynamic> items, String categoryName) {
    return GridView.builder(
      padding: const EdgeInsets.all(24),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.72,
      ),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        IconData categoryIcon = _getIconForCategory(categoryName);
        
        return InkWell(
          onTap: () => _showProductCustomizer(context, item, categoryIcon),
          borderRadius: BorderRadius.circular(24),
          child: LiquidGlassCard(
            padding: EdgeInsets.zero,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: AppColors.primaryRed.withOpacity(0.35),
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                    ),
                    child: item['image'] != null
                      ? ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                          child: Image.network(
                            item['image'],
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => Center(
                              child: Icon(categoryIcon, size: 48, color: AppColors.primaryYellow),
                            ),
                          ),
                        )
                      : Center(
                          child: Icon(categoryIcon, size: 48, color: AppColors.primaryYellow),
                        ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item['name'],
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '\$${item['price'].toStringAsFixed(2)}',
                        style: const TextStyle(color: AppColors.primaryYellow, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        item['desc'],
                        style: const TextStyle(fontSize: 10, color: Colors.white54),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showProductCustomizer(BuildContext context, dynamic item, IconData icon) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return ProductCustomizerModal(item: item, icon: icon);
      },
    );
  }

  IconData _getIconForCategory(String category) {
    if (category.contains('Especialidades')) return Icons.star_rounded;
    if (category.contains('Tacos')) return Icons.restaurant_rounded;
    if (category.contains('Quesadillas')) return Icons.lunch_dining_rounded;
    if (category.contains('Parrilladas')) return Icons.group_rounded;
    if (category.contains('Bebidas')) return Icons.local_drink_rounded;
    return Icons.restaurant_rounded;
  }
}
