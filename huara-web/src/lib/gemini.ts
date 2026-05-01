// ============================================================
// Huara-Concierge: Free Rule-Based AI
// No API key required. Zero cost. Works offline.
// ============================================================

export const HuaraConciergePersona = `Eres Huara-Concierge, el asistente de El Huarachón.`;

interface Rule {
  patterns: RegExp[];
  response: string;
}

const RULES: Rule[] = [
  {
    patterns: [/punto|puntos|balance|saldo|dinero|cuánto/i],
    response:
      "¡Tus Huara-Puntos son como dinero en el bolsillo! 💛\n\n• **Bronce:** Ganas el 5% de cada compra\n• **Plata:** Ganas el 8% (desde 10 visitas)\n• **Oro:** Ganas el 12% + regalos exclusivos (desde 25 visitas)\n\nPuedes ver tu saldo en la pantalla principal. ¡A acumular se ha dicho!",
  },
  {
    patterns: [/sucursal|dónde|dirección|ubicación|donde|local/i],
    response:
      "🗺️ Tenemos 3 sucursales en Mexicali para servirte:\n\n📍 **Independencia** — Calz Independencia 303\n   Lun–Jue: 11am–1am · Vie–Sáb: 11am–4am\n   📞 (686) 567-9254\n\n📍 **Gómez Morín** — Calz. Manuel Gómez Morín 392\n   Lun–Dom: 11am–11pm\n   📞 (686) 566-9595\n\n📍 **Lázaro Cárdenas** — Blvd. Lázaro Cárdenas #701\n   Lun–Dom: 11am–12am\n   📞 (686) 557-2223",
  },
  {
    patterns: [/hora|horario|cierra|abre|abierto|cerrado/i],
    response:
      "⏰ Horarios de El Huarachón:\n\n• **Independencia:** Lun–Jue 11am–1am · Vie–Sáb 11am–¡4am! (las noches del viernes son sagradas 🌮)\n• **Gómez Morín:** Lun–Dom 11am–11pm\n• **Lázaro Cárdenas:** Lun–Dom 11am–12am",
  },
  {
    patterns: [/menú|menu|qué tienen|qué hay|taco|huarache|orden|pedir|comida/i],
    response:
      "🌮 ¡Lo mejor del menú!\n\n**Tacos** (los clásicos de siempre):\n• Asada, Pastor, Tripa, Buche, Cabeza\n\n**Huaraches El Huarachón** (nuestra especialidad):\n• Con frijoles, crema, queso y tu carne favorita\n\n**Bebidas:**\n• Aguas frescas hechas en casa 🥤\n\nPara ver precios y hacer tu pedido, ve a la sección **Menú** en la app. ¡Está bien curado todo! 😋",
  },
  {
    patterns: [/tier|nivel|bronce|plata|oro|categoría/i],
    response:
      "🏆 Sistema de Niveles Huarafan:\n\n🥉 **Bronce** — Inicio (5% cashback)\n🥈 **Plata** — 10+ visitas (8% cashback)\n🥇 **Oro** — 25+ visitas (12% cashback + regalos exclusivos)\n\n¡Cada visita te acerca más al nivel Oro! ¡Ándale, Huarafan!",
  },
  {
    patterns: [/referido|referral|invitar|amigos|código|invitado/i],
    response:
      "👥 ¡Comparte el sabor y gana!\n\nCon tu código de referido único:\n• **Tú ganas** puntos cuando un amigo se registra\n• **Tu amigo gana** puntos de bienvenida\n\nEncuentra tu código en la sección **Perfil** de la app. ¡Entre más Huarafans, mejor! 🌮",
  },
  {
    patterns: [/promo|promoción|oferta|descuento|especial/i],
    response:
      "🔥 ¡Checa las promos de hoy!\n\n• **Miércoles de Tacos:** 3 tacos por el precio de 2\n• **Súper Combo:** 1 Taco Grande + 1 Agua Fresca por precio especial\n• **Doble Puntos** en días seleccionados (ve la pantalla principal)\n\nLas promos cambian seguido. ¡Activa notificaciones para no perderte ninguna! 🔔",
  },
  {
    patterns: [/qr|código qr|escanear|caja/i],
    response:
      "📱 Para usar tu QR en caja:\n\n1. Abre la app\n2. Toca **tu saldo** en la pantalla principal\n3. Aparece tu código QR personal\n4. Muéstraselo al cajero para acumular puntos automáticamente\n\n¡Es así de fácil, Huarafan!",
  },
  {
    patterns: [/gracias|muchas gracias|thank/i],
    response:
      "¡De nada, Huarafan! 😄 Con mucho gusto. ¿Hay algo más en lo que te pueda ayudar? Los tacos nos esperan… 🌮",
  },
  {
    patterns: [/hola|hi|buenas|hey|ola/i],
    response:
      "¡Hola Huarafan! 🌮 Soy tu Huara-Concierge. Puedo ayudarte con:\n\n• 💛 Tus **Huara-Puntos** y niveles\n• 📍 **Sucursales** y horarios\n• 🌮 El **menú** y especialidades\n• 🔥 **Promociones** del día\n• 📱 Usar tu **código QR** en caja\n\n¡Pregúntame lo que quieras!",
  },
  {
    patterns: [/ayuda|help|problema|error|no funciona/i],
    response:
      "¡Aquí estoy para ayudarte! 🛎️ Cuéntame qué está pasando y lo resolvemos juntos. Si es un problema técnico grave, puedes contactarnos en:\n📧 ayuda@elhuarachon.mx\n\n¡El Huarachón siempre está pa' ti! 🌮",
  },
];

const FALLBACK =
  "¡Epa! No entendí muy bien esa pregunta. 😅 Puedo ayudarte con info sobre **puntos**, **sucursales**, **horarios**, **menú** o **promociones**. ¿Qué necesitas saber?";

export async function getHuaraResponse(
  message: string
): Promise<string> {
  await new Promise((r) => setTimeout(r, 300)); // Natural feel delay

  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(message))) {
      return rule.response;
    }
  }
  return FALLBACK;
}
