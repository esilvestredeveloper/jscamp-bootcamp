<!-- Aquí irá el feedback del ejercicio -->
Muy buen ejercicio! Te felicito!
Hicimos cambios a nivel de arquitectura y unas correcciones en el PUT/PATCH/POST para evitar modificar jobs existentes: esto puede afectar tests posteriores que usen datos modificados por estos métodos.

Lo que hicimos fue:
- En esos métodos creamos un job nuevo y ejecutamos la acción sobre él.
- En los tests había mucho código repetido, una de las cosas que hace más tedioso el trabajar con testing. Así que creamos handlers para cada método y los llamamos desde los tests. Así reducimos el código en cada uno, y queda más fácil de leer cada uno.

Cualquier duda nos puedes comentar, si?
Excelente trabajo!