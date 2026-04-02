import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_colors.dart';
import '../services/cart_provider.dart';
import '../widgets/liquid_glass_card.dart';

class ProductCustomizerModal extends StatefulWidget {
  final dynamic item;
  final IconData icon;

  const ProductCustomizerModal({
    super.key,
    required this.item,
    required this.icon,
  });

  @override
  State<ProductCustomizerModal> createState() => _ProductCustomizerModalState();
}

class _ProductCustomizerModalState extends State<ProductCustomizerModal> {
  int _quantity = 1;
  String _selectedSalsa = 'Verde';

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.6,
      minChildSize: 0.4,
      maxChildSize: 0.9,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: Color(0xFF1A1A1A),
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          ),
          child: ListView(
            controller: scrollController,
            padding: const EdgeInsets.all(24),
            children: [
              // Pull Handle
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              
              // Header
              Row(
                children: [
                  Icon(widget.icon, size: 48, color: AppColors.primaryYellow),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.item['name'],
                          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          '\$${widget.item['price'].toStringAsFixed(2)}',
                          style: const TextStyle(fontSize: 18, color: AppColors.primaryYellow, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Text(
                widget.item['desc'],
                style: const TextStyle(color: Colors.white70, fontSize: 16),
              ),
              const SizedBox(height: 32),
              
              // Options
              const Text('Personaliza tu taco:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              const SizedBox(height: 16),
              _buildSalsaOption('Verde'),
              _buildSalsaOption('Roja (Picosa)'),
              _buildSalsaOption('Sin Salsa'),
              
              const SizedBox(height: 32),
              
              // Quantity
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Cantidad:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                  Row(
                    children: [
                      _buildQuantityBtn(Icons.remove, () {
                        if (_quantity > 1) setState(() => _quantity--);
                      }),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Text('$_quantity', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                      ),
                      _buildQuantityBtn(Icons.add, () {
                        setState(() => _quantity++);
                      }),
                    ],
                  ),
                ],
              ),
              
              const SizedBox(height: 48),
              
              // Add to Cart
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () {
                    final cart = Provider.of<CartProvider>(context, listen: false);
                    cart.addItem(CartItem(
                      id: widget.item['name'], // Simplification
                      name: widget.item['name'],
                      price: widget.item['price'].toDouble(),
                      quantity: _quantity,
                      options: {'Salsa': _selectedSalsa},
                    ));
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('¡Añadido! Total en carrito: ${cart.itemCount}'),
                        backgroundColor: AppColors.primaryRed,
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryRed,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: const Text('Añadir al Carrito', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSalsaOption(String salsa) {
    bool isSelected = _selectedSalsa == salsa;
    return InkWell(
      onTap: () => setState(() => _selectedSalsa = salsa),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          border: Border.all(color: isSelected ? AppColors.primaryYellow : Colors.white12),
          borderRadius: BorderRadius.circular(12),
          color: isSelected ? AppColors.primaryYellow.withOpacity(0.1) : Colors.transparent,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(salsa, style: TextStyle(color: isSelected ? AppColors.primaryYellow : Colors.white70)),
            if (isSelected) const Icon(Icons.check_circle_rounded, color: AppColors.primaryYellow, size: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildQuantityBtn(IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white24),
        ),
        child: Icon(icon, size: 20, color: Colors.white),
      ),
    );
  }
}
