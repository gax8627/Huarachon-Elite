import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:provider/provider.dart';
import '../theme/app_colors.dart';
import '../services/user_provider.dart';
import '../widgets/liquid_glass_card.dart';

class QRScannerPage extends StatefulWidget {
  const QRScannerPage({super.key});

  @override
  State<QRScannerPage> createState() => _QRScannerPageState();
}

class _QRScannerPageState extends State<QRScannerPage> {
  final MobileScannerController controller = MobileScannerController();
  bool _isProcessing = false;

  void _handleDetect(BarcodeCapture capture) {
    if (_isProcessing) return;
    
    final List<Barcode> barcodes = capture.barcodes;
    for (final barcode in barcodes) {
      if (barcode.rawValue != null) {
        _onCodeScanned(barcode.rawValue!);
        break;
      }
    }
  }

  void _onCodeScanned(String code) {
    setState(() => _isProcessing = true);
    
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final success = userProvider.processQRCode(code);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('¡Escaneo Exitoso! Tu saldo ha sido actualizado.', 
            style: const TextStyle(fontWeight: FontWeight.bold)),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.pop(context);
    } else {
      setState(() => _isProcessing = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Código Huarachón no válido.'),
          backgroundColor: AppColors.primaryRed,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Camera View
          MobileScanner(
            controller: controller,
            onDetect: _handleDetect,
          ),
          
          // Scanning Overlay
          _buildOverlay(context),
          
          // Simulation Button (for Dev)
          Positioned(
            bottom: 40,
            left: 20,
            right: 20,
            child: Column(
              children: [
                const Text(
                  'Coloca el código QR dentro del recuadro',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () => _onCodeScanned('HUARA-20.00-MXL'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryYellow.withOpacity(0.9),
                    foregroundColor: Colors.black,
                  ),
                  child: const Text('Simular Escaneo (\$20.00 MXN)'),
                ),
              ],
            ),
          ),

          // Back Button
          Positioned(
            top: 50,
            left: 20,
            child: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOverlay(BuildContext context) {
    return Container(
      decoration: ShapeDecoration(
        shape: QrScannerOverlayShape(
          borderColor: AppColors.primaryYellow,
          borderRadius: 24,
          borderLength: 40,
          borderWidth: 10,
          cutOutSize: 280,
        ),
      ),
    );
  }
}

class QrScannerOverlayShape extends ShapeBorder {
  final Color borderColor;
  final double borderRadius;
  final double borderLength;
  final double borderWidth;
  final double cutOutSize;

  QrScannerOverlayShape({
    this.borderColor = Colors.white,
    this.borderRadius = 0,
    this.borderLength = 40,
    this.borderWidth = 1,
    this.cutOutSize = 250,
  });

  @override
  EdgeInsetsGeometry get dimensions => const EdgeInsets.all(0);

  @override
  Path getInnerPath(Rect rect, {TextDirection? textDirection}) => Path();

  @override
  Path getOuterPath(Rect rect, {TextDirection? textDirection}) {
    final Path path = Path()..addRect(rect);
    final Rect cutOutRect = Rect.fromCenter(
      center: rect.center,
      width: cutOutSize,
      height: cutOutSize,
    );
    path.addRRect(RRect.fromRectAndRadius(cutOutRect, Radius.circular(borderRadius)));
    return path..fillType = PathFillType.evenOdd;
  }

  @override
  void paint(Canvas canvas, Rect rect, {TextDirection? textDirection}) {
    final Paint paint = Paint()
      ..color = Colors.black54
      ..style = PaintingStyle.fill;

    final Rect cutOutRect = Rect.fromCenter(
      center: rect.center,
      width: cutOutSize,
      height: cutOutSize,
    );

    canvas.drawPath(getOuterPath(rect), paint);

    final Paint borderPaint = Paint()
      ..color = borderColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = borderWidth;

    canvas.drawRRect(
      RRect.fromRectAndRadius(cutOutRect, Radius.circular(borderRadius)),
      borderPaint,
    );
  }

  @override
  ShapeBorder scale(double t) => QrScannerOverlayShape();
}
