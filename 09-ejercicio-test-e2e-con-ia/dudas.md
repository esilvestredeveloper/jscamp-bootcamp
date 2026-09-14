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

---

**Respuesta:**

Hola! Lo que hiciste está muy bien: el árbol de accesibilidad llega bien y el problema es la precisión del modelo al elegir el elemento (no es un problema tuyo al escribir las instrucciones).

`act` es la operación más difícil para los modelos pequeños (porque tiene que señalar un elemento exacto del árbol), mientras que `extract` y `observe` son más fáciles de implementar.

Nosotros usamos la API de OpenAI con el mismo modelo que eligió midu. Depende el servicio pero alguno modelos de google, y modelos chinos como DeepSeek v4-flash deberían ir muy bien en esto. No he usado otros en tests para poder decirte: este si y este no.

Para la configuración de tu PC, probaría `llama3.1:8b`, es la otra opción un poco más pesada que `7b` pero no tanto. Y debería de andar mejor.

Siempre cuando mejor es el modelo, mejor van a ir los tests. La limitante en modelos locales es el hardware. Luego hay otros que irían mejor pero ya te quedaría muy limitado.

- `qwen2.5:7b` es ya de lo mejor en 7B; `llama3.1:8b` es la otra opción que te recomiendo probar (sigue instrucciones algo mejor en algunos casos).
- `qwen2.5:14b` sería el salto de precisión, pero pesa ~9 GB: con tu RAM al 60-70 % no cabe cómodo. Solo si cierras todo lo demás.
- Con 3B no vas a conseguir un `act` fiable, como ya comprobaste.