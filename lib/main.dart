import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'theme/huarachon_theme.dart';
import 'pages/splash_page.dart';
import 'services/user_provider.dart';
import 'services/auth_service.dart';
import 'services/cart_provider.dart';
import 'services/notification_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Supabase
  await Supabase.initialize(
    url: 'https://dtbsraapjikprvarchyx.supabase.co', // Retrieved from browser state
    anonKey: 'YOUR_SUPABASE_ANON_KEY', // User to provide or retrieve from .env
  );
  
  await NotificationService().init();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => AuthService()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
      ],
      child: const HuarachonApp(),
    ),
  );
}

class HuarachonApp extends StatelessWidget {
  const HuarachonApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Huarachón App',
      debugShowCheckedModeBanner: false,
      theme: HuarachonTheme.darkTheme,
      home: const SplashPage(),
    );
  }
}
