# Huarachón Master Operations Manual v2.1 📘 Taco-Elite

The definitive guide for managing the Huarachón Digital Ecosystem.

---

## 🚀 1. Production Infrastructure

| Resource | Service | URL / ID |
| :--- | :--- | :--- |
| **Source Control** | GitHub | [gax8627/Huarachon-Elite](https://github.com/gax8627/Huarachon-Elite) |
| **Marketing Portal** | Vercel | [huarachon-marketing.vercel.app](https://huarachon-marketing.vercel.app) |
| **Design System** | Stitch MCP | `projects/14778601529225919101` |
| **Backend API** | Sierra POS | `https://api.sierra.com.mx/v1/` |

---

## 🔑 2. Admin & Security Credentials

- **Admin Dashboard PIN:** `1985` (Year of first Huarachón branch).
- **Sierra API Mode:** `SIMULATED_MOCK` (Requires Production Key for live POS).
- **Security Audit Status:** ✅ **PASSED** (2026-04-02).
- **Leak Protection:** `.gitignore` hardened for `.env`, `*.jks`, and `node_modules`.

---

## 🛠️ 3. Deployment & Scaling Logic

### **3.1 Mobile App (Flutter)**
- **Building for Production:**
  ```bash
  flutter build apk --release --obfuscate --split-debug-info=build/app/outputs/symbols
  ```
- **Store Strategy:** Deploy to App Store/Play Store (See `app_store_strategy.md`).

### **3.2 Marketing Page (Huara-Web)**
- **Static Entry Point:** `huara-web/index.html`.
- **Styling:** Tailwind CSS (CDN) for maximum performance.
- **Live Updates:** `git push origin main` triggers automatic Vercel redeployment.

---

## 🛡️ 4. AI Workforce Governance

Refer to [HUARA_AI_STRATEGY.md](file:///Users/gax8627/Huarachon-App/HUARA_AI_STRATEGY.md) for agent roles:
- **Concierge:** Account and points support.
- **Auditor:** PII and vulnerability monitoring.
- **Marketing:** Promotion generation.

---
*Manual Version: 2.1 (2026-04-02)*
*Authorized by Antigravity v3.0*
- **Plata (Gasto > $1,000):** 8% de Huara-Puntos en cada compra.
- **Oro (Gasto > $5,000):** 12% de Huara-Puntos + Regalos exclusivos.
- **Puntos:** Los puntos acumulados se pueden usar como dinero en efectivo dentro de la app o en caja.

## 3. Huara-Admin (Panel de Gerente) 🔐
1. Ve a la sección de **"Puntos/Billetera"**.
2. Toca el icono de **"Escudo Dorado"** en la esquina superior.
3. Ingresa el **PIN de Seguridad: 1985**.

**Funciones de Gerente:**
- Ver cuántos "Huarafans" han visitado hoy.
- Cambiar la **Promo del Día** (Banner en la Home).
- Enviar **Notificaciones Push** masivas (p. ej. "¡Tacos 2x1 hoy hasta las 6pm!").

## 4. Huara-Web (Preview para Socios) 🌐
Si quieres mostrar la app en una computadora o tablet sin instalarla:
1. Asegúrate de tener Flutter instalado.
2. Ejecuta el comando: `flutter run -d web-server --web-port 8080`.
3. Navega a `http://localhost:8080`.

## 5. Checklist para Lanzamiento (Go-Live) 🚀
Para que la app esté en la App Store/Play Store, falta:
1. **Stripe Production:** Reemplazar las llaves de prueba por las finales en `CheckoutPage.dart`.
2. **Google Maps API:** Activar la facturación en Google Cloud para que los mapas carguen sin errores en iPhone/Android.
3. **Servidor Sierra:** Abrir el puerto de red en tu sucursal para que la app pueda "hablar" con tu sistema Sierra POS actual.

---

© 2026 Taquería El Huarachón - Mexicali, B.C.
"Tecnología con sabor a México"
