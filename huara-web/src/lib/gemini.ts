import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export const HuaraConciergePersona = `
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
`;

export async function getHuaraResponse(message: string, history: any[] = []) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: HuaraConciergePersona }] },
      { role: "model", parts: [{ text: "¡Entendido Huarafan! Soy tu Huara-Concierge listo para servirte con todo el sabor de Mexicali." }] },
      ...history
    ],
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}
