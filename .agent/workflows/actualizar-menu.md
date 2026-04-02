---
description: Actualizar el menú de El Huarachón (Precios y Tacos)
---

Este flujo permite actualizar los precios e ítems del menú de forma segura.

### Pasos:

1. Lee el archivo actual de datos:
   `view_file(AbsolutePath: "/Users/gax8627/Huarachon-App/assets/data/menu.json")`

2. Aplica los cambios solicitados por el usuario (ej: "Sube el Taco de Asada a $60").

3. Valida el JSON resultante para asegurar que no haya errores de sintaxis.

4. Guarda los cambios:
   `write_to_file(TargetFile: "/Users/gax8627/Huarachon-App/assets/data/menu.json", Overwrite: true, ...)`

5. Notifica al usuario que el menú ha sido actualizado y se reflejará al reiniciar la app.

// turbo
6. Ejecuta un análisis rápido para asegurar que no se rompieron dependencias:
   `flutter analyze`
