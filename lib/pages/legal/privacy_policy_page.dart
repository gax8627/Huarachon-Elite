import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../../widgets/liquid_glass_card.dart';

class PrivacyPolicyPage extends StatelessWidget {
  const PrivacyPolicyPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Aviso de Privacidad')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: LiquidGlassCard(
          padding: const EdgeInsets.all(20),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Aviso de Privacidad Integral',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryYellow),
              ),
              SizedBox(height: 16),
              Text(
                'Taquería El Huarachón (en adelante "El Huarachón"), con domicilio en Mexicali, Baja California, México, es el responsable del tratamiento de sus datos personales recolectados a través de la aplicación móvil Huara-Elite.',
                style: TextStyle(height: 1.5),
              ),
              SizedBox(height: 16),
              Text('¿Qué datos recolectamos?', style: TextStyle(fontWeight: FontWeight.bold)),
              Text('• Nombre y apellidos\n• Correo electrónico\n• Fecha de nacimiento (para recompensas de cumpleaños)\n• Ubicación (para localizar sucursales cercanas)\n• Historial de consumos y puntos acumulados', style: TextStyle(height: 1.5)),
              SizedBox(height: 16),
              Text('Finalidades del tratamiento', style: TextStyle(fontWeight: FontWeight.bold)),
              Text('Sus datos serán utilizados para:\n1. Gestión del programa de lealtad Huara-Elite.\n2. Envío de promociones personalizadas según sus gustos (Huara-Algoritmo).\n3. Localización de sucursales a través de geocerca.\n4. Mejora del servicio al cliente.', style: TextStyle(height: 1.5)),
              SizedBox(height: 16),
              Text('Derechos ARCO', style: TextStyle(fontWeight: FontWeight.bold)),
              Text('Usted tiene derecho al Acceso, Rectificación, Cancelación u Oposición de sus datos personales. Para ejercer estos derechos, puede contactarnos en legal@elhuarachon.mx.', style: TextStyle(height: 1.5)),
              SizedBox(height: 24),
              Text('Fecha de última actualización: Mayo 2024', style: TextStyle(fontSize: 12, color: Colors.white24)),
            ],
          ),
        ),
      ),
    );
  }
}
