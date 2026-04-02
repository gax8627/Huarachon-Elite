---
description: Redactar y Enviar Promo del Día para El Huarachón
---

Este flujo permite crear promociones que resalten el "Sazón Cachanilla."

### Pasos:

1. Elige el tipo de audiencia (Todos, Huarafanes de Asada, Cumpleañeros).

2. Selecciona el ítem promocional:
   `view_file(AbsolutePath: "/Users/gax8627/Huarachon-App/assets/data/menu.json")`

3. Escribe el título "Cachanilla" (ej: "¡Qué chulada! 2x1 en Pastor hoy").

4. Genera el payload de notificación:
   ```json
   {
     "to": "/topics/all",
     "notification": {
       "title": "Huarachón Promo 🔥",
       "body": "¡Qué onda Huarafan! Ven por tu 2x1 en Pastor."
     }
   }
   ```

5. Presenta la promo al usuario para su aprobación final.
