import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../theme/app_colors.dart';
import '../widgets/liquid_glass_card.dart';
import '../services/geofence_service.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:geolocator/geolocator.dart';

class LocationsPage extends StatefulWidget {
  const LocationsPage({super.key});

  @override
  State<LocationsPage> createState() => _LocationsPageState();
}

class _LocationsPageState extends State<LocationsPage> {
  late GoogleMapController _mapController;
  final Set<Marker> _markers = {};

  final List<Map<String, dynamic>> locations = const [
    {
      'name': 'Independencia',
      'address': 'Calz Independencia 303, Insurgentes Este',
      'lat': 32.6245,
      'lng': -115.4410,
      'phone': '686 567 9254',
    },
    {
      'name': 'Gómez Morín',
      'address': 'Calz. Manuel Gómez Morín 392, Las Hadas',
      'lat': 32.6100,
      'lng': -115.4200,
      'phone': '686 566 9595',
    },
    {
      'name': 'Lázaro Cárdenas',
      'address': '#701 Esquina con Lago Chad, Jardines del Lago',
      'lat': 32.6350,
      'lng': -115.4600,
      'phone': '686 557 2223',
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadCustomMarkers();
  }

  void _loadCustomMarkers() {
    for (var loc in locations) {
      _markers.add(
        Marker(
          markerId: MarkerId(loc['name']),
          position: LatLng(loc['lat'], loc['lng']),
          infoWindow: InfoWindow(title: loc['name'], snippet: 'El Mejor Sazón'),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sucursales')),
      body: Stack(
        children: [
          if (kIsWeb)
            Container(
              color: AppColors.backgroundDark,
              child: const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.map_outlined, color: Colors.white24, size: 60),
                    SizedBox(height: 16),
                    Text('Mapa en construcción para Web', style: TextStyle(color: Colors.white30)),
                    Text('(Usa iOS/Android para vista completa)', style: TextStyle(color: Colors.white10, fontSize: 10)),
                  ],
                ),
              ),
            )
          else
            GoogleMap(
              initialCameraPosition: const CameraPosition(
                target: LatLng(32.6245, -115.4410),
                zoom: 13,
              ),
              onMapCreated: (controller) => _mapController = controller,
              markers: _markers,
              style: _mapStyle,
            ),
          
          DraggableScrollableSheet(
            initialChildSize: 0.35,
            minChildSize: 0.15,
            maxChildSize: 0.8,
            builder: (context, scrollController) {
              return Container(
                decoration: BoxDecoration(
                  color: AppColors.backgroundDark.withOpacity(0.95),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
                  boxShadow: [BoxShadow(color: Colors.black54, blurRadius: 20)],
                ),
                child: ListView.builder(
                  controller: scrollController,
                  padding: const EdgeInsets.all(24),
                  itemCount: locations.length,
                  itemBuilder: (context, index) {
                    final loc = locations[index];
                    return _buildLocationCard(loc);
                  },
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildLocationCard(Map<String, dynamic> loc) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: LiquidGlassCard(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                const Icon(Icons.location_on_rounded, color: AppColors.primaryRed, size: 20),
                const SizedBox(width: 12),
                Text(loc['name'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      _mapController.animateCamera(
                        CameraUpdate.newLatLngZoom(LatLng(loc['lat'], loc['lng']), 16),
                      );
                    },
                    icon: const Icon(Icons.map_rounded, size: 14),
                    label: const Text('Ruta', style: TextStyle(fontSize: 11)),
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryRed, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _handleCheckIn(context, loc),
                    icon: const Icon(Icons.check_circle_outline_rounded, size: 14),
                    label: const Text('¡Estoy Aquí!', style: TextStyle(fontSize: 11)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryYellow,
                      foregroundColor: Colors.black,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _handleCheckIn(BuildContext context, Map<String, dynamic> loc) async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Activa el GPS para hacer check-in.')));
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Permiso de ubicación denegado.')));
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Permisos de ubicación bloqueados permanentemente.')));
      return;
    }

    // Capture position
    final Position position = await Geolocator.getCurrentPosition();
    
    // Calculate distance
    final double distance = Geolocator.distanceBetween(
      position.latitude,
      position.longitude,
      loc['lat'],
      loc['lng'],
    );

    if (distance <= 200) {
      // SUCCESS
      final user = Provider.of<UserProvider>(context, listen: false);
      user.addPoints(50);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('¡Check-in exitoso en ${loc['name']}! +\$50 Huara-puntos.'),
          backgroundColor: Colors.green,
        ),
      );
    } else {
      // TOO FAR
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Estás a ${(distance/1000).toStringAsFixed(1)}km. ¡Acércate más para ganar puntos!'),
          backgroundColor: AppColors.primaryRed,
        ),
      );
    }
  }

  final String _mapStyle = '''
  [
    { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
    { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
    { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] }
  ]
  ''';
}
