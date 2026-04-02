import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../../widgets/liquid_glass_card.dart';
import 'admin_dashboard_page.dart';

class AdminLoginPage extends StatefulWidget {
  const AdminLoginPage({super.key});

  @override
  State<AdminLoginPage> createState() => _AdminLoginPageState();
}

class _AdminLoginPageState extends State<AdminLoginPage> {
  final String _correctPin = '1985'; // Mexicali default
  String _inputPin = '';

  void _onNumberPress(String number) {
    if (_inputPin.length < 4) {
      setState(() => _inputPin += number);
      if (_inputPin.length == 4) {
        if (_inputPin == _correctPin) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const AdminDashboardPage()),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('PIN Incorrecto, ¡qué mala onda!')),
          );
          setState(() => _inputPin = '');
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Acceso Administrativo')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.lock_person_rounded, size: 80, color: AppColors.primaryYellow),
              const SizedBox(height: 24),
              const Text('Modo Gerente', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              const Text('Ingresa el PIN de la sucursal', style: TextStyle(color: Colors.white60)),
              const SizedBox(height: 40),
              
              // PIN Dots
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(4, (index) => Container(
                  margin: const EdgeInsets.symmetric(horizontal: 10),
                  width: 20,
                  height: 20,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: index < _inputPin.length ? AppColors.primaryYellow : Colors.white12,
                    border: Border.all(color: Colors.white24),
                  ),
                )),
              ),
              
              const SizedBox(height: 60),
              
              // Keypad
              Expanded(
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    childAspectRatio: 1.5,
                  ),
                  itemCount: 12,
                  itemBuilder: (context, index) {
                    if (index == 9) return const SizedBox.shrink();
                    if (index == 10) return _buildKey('0');
                    if (index == 11) {
                      return IconButton(
                        icon: const Icon(Icons.backspace_rounded, color: Colors.white54),
                        onPressed: () => setState(() {
                          if (_inputPin.isNotEmpty) _inputPin = _inputPin.substring(0, _inputPin.length - 1);
                        }),
                      );
                    }
                    return _buildKey((index + 1).toString());
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildKey(String label) {
    return InkWell(
      onTap: () => _onNumberPress(label),
      borderRadius: BorderRadius.circular(50),
      child: Center(
        child: Text(label, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
      ),
    );
  }
}
