Buenas Mateo,

Quería contarte que intenté hacer la parte opcional, pero no conseguí que funcionara del todo, sí que me gustaría explicarte lo que he hecho.

Como no tengo API de GPT de momento, probé con Ollama en local. Instalé Ollama con Homebrew y probé dos modelos:

- `qwen2.5:3b`: no conseguía decidir correctamente las acciones.
- `qwen2.5:7b`: bastante mejor, sí devuelve correctamente las llamadas a herramientas.

Con Stagehand conseguí que funcionara la navegación y `extract`, y `observe` funciona a medias. El problema está en `act`, que falla siempre con `"No action found"`.

Revisando el problema, creo que el modelo identifica mal los elementos. Por ejemplo, al pedirle el buscador, devuelve como selector el `div` que lo contiene en lugar del `input`. Con el botón de buscar ocurre algo parecido: señala una sección completa en vez del elemento concreto. El árbol de accesibilidad llega correctamente, así que parece más un problema de precisión del modelo que de configuración.

Mi duda es:

¿Con qué modelo lo probasteis vosotros? ¿Algún modelo que recomiendes? Tengo un Mac M1 Pro con 16 GB de RAM, lo malo es que con todo abierto está al 60-70 % de RAM.

Muchas gracias.