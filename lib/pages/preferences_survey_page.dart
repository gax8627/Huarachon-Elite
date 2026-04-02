import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_colors.dart';
import '../services/user_provider.dart';
import '../widgets/liquid_glass_card.dart';

class PreferencesSurveyPage extends StatefulWidget {
  const PreferencesSurveyPage({super.key});

  @override
  State<PreferencesSurveyPage> createState() => _PreferencesSurveyPageState();
}

class _PreferencesSurveyPageState extends State<PreferencesSurveyPage> {
  String? _selectedMeat;
  String? _selectedTortilla;
  String? _selectedSpice;

  void _savePreferences() {
    if (_selectedMeat == null || _selectedTortilla == null || _selectedSpice == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor, selecciona todas tus preferencias.')),
      );
      return;
    }

    final userProvider = Provider.of<UserProvider>(context, listen: false);
    userProvider.favoriteMeat = _selectedMeat;
    userProvider.favoriteTortilla = _selectedTortilla;
    userProvider.favoriteSpice = _selectedSpice;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('¡Gracias! Ahora veremos qué tacos son ideales para ti.'),
        backgroundColor: Colors.green,
      ),
    );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [AppColors.darkRed, AppColors.backgroundDark],
              ),
            ),
          ),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '¡Queremos conocerte!',
                    style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: AppColors.primaryYellow),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Cuéntanos tus gustos para darte las mejores promos.',
                    style: TextStyle(fontSize: 16, color: Colors.white70),
                  ),
                  const SizedBox(height: 40),
                  
                  _buildQuestion('¿Tu carne favorita?', ['Asada', 'Pastor', 'Pollo', 'Tripa'], _selectedMeat, (val) => setState(() => _selectedMeat = val)),
                  const SizedBox(height: 32),
                  _buildQuestion('¿Qué tortilla prefieres?', ['Harina', 'Maíz'], _selectedTortilla, (val) => setState(() => _selectedTortilla = val)),
                  const SizedBox(height: 32),
                  _buildQuestion('¿Nivel de picante?', ['Nada', 'Poco', 'Medio', '¡Fuego!'], _selectedSpice, (val) => setState(() => _selectedSpice = val)),
                  const SizedBox(height: 32),
                  
                  const Text('¿Cuándo es tu cumpleaños?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: Colors.white)),
                  const SizedBox(height: 16),
                  InkWell(
                    onTap: () async {
                      final date = await showDatePicker(
                        context: context,
                        initialDate: DateTime(2000),
                        firstDate: DateTime(1930),
                        lastDate: DateTime.now(),
                        locale: const Locale('es', 'MX'),
                      );
                      if (date != null) {
                        Provider.of<UserProvider>(context, listen: false).setBirthday(date);
                      }
                    },
                    child: LiquidGlassCard(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          const Icon(Icons.cake_rounded, color: AppColors.primaryYellow),
                          const SizedBox(width: 16),
                          Consumer<UserProvider>(
                            builder: (context, user, child) => Text(
                              user.birthday == null 
                                ? 'Seleccionar fecha' 
                                : '${user.birthday!.day}/${user.birthday!.month}/${user.birthday!.year}',
                              style: const TextStyle(color: Colors.white),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 60),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _savePreferences,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryYellow,
                        foregroundColor: Colors.black,
                      ),
                      child: const Text('Guardar Preferencias', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            top: 40,
            right: 20,
            child: TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Saltar', style: TextStyle(color: Colors.white54)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuestion(String title, List<String> options, String? selected, Function(String) onSelect) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: Colors.white)),
        const SizedBox(height: 16),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: options.map((opt) {
            final isSelected = selected == opt;
            return InkWell(
              onTap: () => onSelect(opt),
              child: LiquidGlassCard(
                borderRadius: 12,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                gradient: isSelected ? const LinearGradient(colors: [AppColors.primaryYellow, AppColors.lightYellow]) : null,
                child: Text(
                  opt,
                  style: TextStyle(
                    color: isSelected ? Colors.black : Colors.white70,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
