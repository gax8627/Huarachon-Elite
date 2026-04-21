import 'dart:async';

class Rule {
  final List<RegExp> patterns;
  final String response;

  Rule({required this.patterns, required this.response});
}

class AiService {
  static final AiService _instance = AiService._internal();
  factory AiService() => _instance;
  AiService._internal();

  final List<Rule> _rules = [
    Rule(
      patterns: [RegExp(r'punto|puntos|balance|saldo|dinero|cuánto', caseSensitive: false)],
      response: "¡Tus Huara-Puntos son como dinero en el bolsillo! 💛\n\n• **Bronce:** Ganas el 5% de cada compra\n• **Plata:** Ganas el 8% (desde 10 visitas)\n• **Oro:** Ganas el 12% + regalos exclusivos (desde 25 visitas)\n\nPuedes ver tu saldo en la pantalla principal. ¡A acumular se ha dicho!",
    ),
    Rule(
      patterns: [RegExp(r'sucursal|dónde|dirección|ubicación|donde|local', caseSensitive: false)],
      response: "🗺️ Tenemos 3 sucursales en Mexicali para servirte:\n\n📍 **Independencia** — Calz Independencia 303\n📍 **Gómez Morín** — Calz. Manuel Gómez Morín 392\n📍 **Lázaro Cárdenas** — Blvd. Lázaro Cárdenas #701\n\n¡Busca la más cercana en la app!",
    ),
    Rule(
      patterns: [RegExp(r'hora|horario|cierra|abre|abierto|cerrado', caseSensitive: false)],
      response: "⏰ Horarios de El Huarachón:\n\n• **Independencia:** Lun–Jue 11am–1am · Vie–Sáb 11am–4am\n• **Gómez Morín:** Lun–Dom 11am–11pm\n• **Lázaro Cárdenas:** Lun–Dom 11am–12am",
    ),
    Rule(
      patterns: [RegExp(r'menú|menu|qué tienen|qué hay|taco|huarache|orden|pedir|comida', caseSensitive: false)],
      response: "🌮 ¡Lo mejor del menú!\n\n**Tacos:** Asada, Pastor, Tripa, Buche, Cabeza.\n**Huaraches:** El especial de la casa con frijoles, crema, queso y tu carne favorita.\n\nVe a la sección **Menú** para ver precios. ¡Está bien curado todo! 😋",
    ),
    Rule(
      patterns: [RegExp(r'tier|nivel|bronce|plata|oro|categoría', caseSensitive: false)],
      response: "🏆 Sistema de Niveles Huarafan:\n\n🥉 **Bronce** — Inicio (5% cashback)\n🥈 **Plata** — 10+ visitas (8% cashback)\n🥇 **Oro** — 25+ visitas (12% cashback + regalos exclusivos)",
    ),
    Rule(
      patterns: [RegExp(r'hola|hi|buenas|hey|ola', caseSensitive: false)],
      response: "¡Hola Huarafan! 🌮 Soy tu Huara-Concierge. Puedo ayudarte con tus **puntos**, **sucursales**, **horarios** o el **menú**. ¡Qué chulada tenerte por aquí!",
    ),
    Rule(
      patterns: [RegExp(r'ayuda|help|problema|error|no funciona', caseSensitive: false)],
      response: "¡Aquí estoy para ayudarte! 🛎️ Si tienes un problema con la app, puedes contactarnos en ayuda@elhuarachon.mx. ¡Lo resolvemos de boleto!",
    ),
  ];

  final String _fallback = "¡Epa! No entendí muy bien. 😅 Puedo ayudarte con info sobre **puntos**, **sucursales**, **horarios**, **menú** o **promociones**. ¿Qué necesitas saber?";

  /// No longer needs an API key
  void init(String apiKey) {}

  /// Sends a message and gets a mock stream response (unified with web)
  Stream<String> sendMessageStream(String message) async* {
    await Future.delayed(const Duration(milliseconds: 500));
    
    for (final rule in _rules) {
      if (rule.patterns.any((p) => p.hasMatch(message))) {
        // Yield in chunks to simulate typing
        final words = rule.response.split(' ');
        for (var i = 0; i < words.length; i++) {
          yield words[i] + (i == words.length - 1 ? '' : ' ');
          await Future.delayed(const Duration(milliseconds: 30));
        }
        return;
      }
    }

    final fallbackWords = _fallback.split(' ');
    for (var i = 0; i < fallbackWords.length; i++) {
      yield fallbackWords[i] + (i == fallbackWords.length - 1 ? '' : ' ');
      await Future.delayed(const Duration(milliseconds: 30));
    }
  }

  /// Free recommendation logic
  Future<String> getTacoRecommendation(String? favoriteMeat) async {
    if (favoriteMeat != null) {
      return '¡Qué chulada! Como te gusta el $favoriteMeat, te recomiendo pedirte un Huarache Especial con doble ración. ¡Te va a encantar!';
    }
    return '¡Unos tacos de pastor con piña y salsa roja nunca fallan! 🌮';
  }
}
