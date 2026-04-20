import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:flutter/material.dart';
import 'app_config.dart';

class AiService {
  static final AiService _instance = AiService._internal();
  factory AiService() => _instance;
  AiService._internal();

  GenerativeModel? _model;
  ChatSession? _chat;

  // Personalidad del Huara-Concierge
  final String _systemPrompt = '''
Eres "Huara-Concierge", el asistente virtual de la Taquería "El Huarachón" en Mexicali.
Tu objetivo es ayudar a los "Huarafans" (usuarios de la app) con sus dudas.

Tus rasgos de personalidad:
- Eres amable, entusiasta y orgullosamente Cachanilla.
- Usas expresiones mexicanas y locales de Mexicali (como "¡Qué chulada!", "¡Está bien curado!", "¡Epa!").
- Te encantan los huaraches y los tacos. 

Tus capacidades:
- Explicar cómo funcionan los Huara-puntos (Cashback del 5%, 8% o 12% según el nivel).
- Recomendar sucursales (Centro, Aviación, Carranza, Independencia, Gómez Morín).
- Sugerir tacos (Asada, Pastor, Tripa, Buche) y huaraches especiales.
- Ayudar con problemas de la app.

Restricciones:
- No des recetas secretas.
- No realices cobros directos (di que lo hagan en la sección de 'Pagar').
- Si no sabes algo, di que "le preguntarás al mero mero de la sucursal".
''';

  /// Initializes the Gemini model
  void init(String apiKey) {
    _model = GenerativeModel(
      model: 'gemini-2.0-flash',
      apiKey: apiKey,
    );
    _chat = _model!.startChat(
      history: [
        Content.text(_systemPrompt),
        Content.model([TextPart('¡Hola Huarafan! Soy tu Huara-Concierge. ¿En qué te puedo ayudar hoy? ¡Qué chulada tenerte por aquí!')]),
      ],
    );
  }

  /// Sends a message and gets a stream response
  Stream<String> sendMessageStream(String message) async* {
    if (_chat == null) {
      yield '¡Epa! No estoy listo todavía. Asegúrate de configurar mi llave de acceso.';
      return;
    }

    final response = _chat!.sendMessageStream(Content.text(message));
    await for (final chunk in response) {
      if (chunk.text != null) {
        yield chunk.text!;
      }
    }
  }

  /// Gets a quick taco recommendation
  Future<String> getTacoRecommendation(String? favoriteMeat) async {
    if (_model == null) return '¡Taco de Asada con todo! (Para un consejo más preciso, configura Gemini)';
    
    final prompt = favoriteMeat != null 
      ? 'Basado en que me gusta la carne de $favoriteMeat, recomiéndame algo del menú de El Huarachón brevemente.'
      : 'Dame una recomendación al azar del menú de El Huarachón para un nuevo cliente.';
    
    final response = await _model!.generateContent([Content.text(prompt)]);
    return response.text ?? 'Un buen taco de pastor nunca falla.';
  }
}
