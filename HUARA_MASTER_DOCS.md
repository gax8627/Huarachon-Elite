# 🌮 Huara-Master-Docs: Manual de Entrega (v2.0)

Este es el Manual de Operación definitivo para **Taquería El Huarachón**. Describe cómo funciona la app, cómo gestionarla y los pasos finales para el lanzamiento masivo.

---

## 1. Huara-Pay (Pagos y Pedidos) 💳
El sistema permite que los clientes pidan desde casa o en la fila y paguen con tarjeta (Apple/Google Pay Ready).

- **Impuestos (IVA 8%)**: Configurado para la tasa preferencial de la frontera norte (Mexicali).
- **Personalización**: El usuario elige salsa (Verde, Roja, Sin Salsa) para cada taco.
- **Flujo de Cocina**: Cuando un cliente paga, la orden se envía automáticamente a la Terminal Sierra POS (Sucursales: Independencia, Gómez Morín, Lázaro Cárdenas).

## 2. Huara-Elite (Niveles de Lealtad) 🏆
La app premia automáticamente a los clientes más fieles:
- **Bronce:** Registro inicial.
- **Plata (Gasto > $1,000):** 8% de Huara-Puntos en cada compra.
- **Oro (Gasto > $5,000):** 12% de Huara-Puntos + Regalos exclusivos.
- **Puntos:** Los puntos acumulados se pueden usar como dinero en efectivo dentro de la app o en caja.

## 3. Huara-Admin (Panel de Gerente) 🔐
Para acceder al panel de administración desde la app:
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
