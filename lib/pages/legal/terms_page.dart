import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../../widgets/liquid_glass_card.dart';

class TermsPage extends StatelessWidget {
  const TermsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Términos y Condiciones')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: LiquidGlassCard(
          padding: const EdgeInsets.all(20),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Condiciones de Huara-Elite',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryYellow),
              ),
              SizedBox(height: 16),
              Text('1. Elegibilidad', style: TextStyle(fontWeight: FontWeight.bold)),
              Text('El programa Huara-Elite es válido en todas las sucursales participantes de El Huarachón en Mexicali, Baja California. La participación es gratuita.', style: TextStyle(height: 1.4)),
              SizedBox(height: 16),
              Text('2. Acumulación de Puntos', style: TextStyle(fontWeight: FontWeight.bold)),
              Text('• Los puntos se acumulan presentando su código QR único al momento del pago.\n• Se otorgará un porcentaje de cashback basado en el nivel actual del usuario (5% Bronce, 8% Plata, 12% Oro).', style: TextStyle(height: 1.4)),
              SizedBox(height: 16),
              Text('3. Vigencia de Puntos', style: TextStyle(fontWeight: FontWeight.bold)),
              Text('Los puntos tendrán una vigencia de 180 días naturales a partir de su última visita. Transcurrido ese tiempo sin actividad, los puntos acumulados serán cancelados.', style: TextStyle(height: 1.4)),
              SizedBox(height: 16),
              Text('4. Canje de Puntos', style: TextStyle(fontWeight: FontWeight.bold)),
              Text('Los puntos no son canjeables por dinero en efectivo. Solo podrán utilizarse para el pago de consumos dentro de las sucursales.', style: TextStyle(height: 1.4)),
              SizedBox(height: 24),
              Text('Al utilizar la aplicación, usted acepta íntegramente estas políticas.', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }
}
