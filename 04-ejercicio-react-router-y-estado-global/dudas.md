# Aquí puedes dejar tus dudas

## General
1. ¿conviene añadir siempre los ficheros package.json y package-lock al repo?

**Respuesta:** El archivo `package.json` es obligatorio, sin él el proyecto no funcionará. Sirve para identificar las dependencias que necesita el proyecto para funcionar. Sin esto, otros desarrolladores no sabrían que dependencias hay ni en que versión.

El archivo `package-lock.json` es opcional, aunque npm recomienda subirlo siempre, aquí hay opiniones divididas.

Por un lado, si el proyecto es público y famoso, es peligroso tener un archivo `package-lock.json` en el repo, ya que otros desarrolladores podrían instalar dependencias maliciosas. De hecho, ha pasado que, al ser un archivo que no se suele revisar a mano, han habido casos de ataques de usuarios agregando cosas ahí.

Por otro lado, si el proyecto es privado o publico con poco alcance, es más seguro tener un archivo `package-lock.json`. La ventajas son muchas:
- `Builds`: todos (equipo y CI/CD) instalan exactamente las mismas versiones.
- `CI más rápido`: npm ci usa el lock y salta la resolución de versiones, que es instalar todo.
- `Auditoría de seguridad`: permite ver exactamente qué versión de cada paquete está instalada.
- `Diffs visibles en PRs`: cualquier cambio de dependencia queda registrado y revisable.

Son conceptos un poco más complejos que vamos a ver más adelante en el bootcamp, pero para que tengas una idea y algo te suene.

2. He añadido a .gitignore los archivos:
   - dist/
   - dist-ssr/
   - *.local
   - .vite/

**Respuesta:**  Excelente! Algo que podes agregar es el `node_modules`. Esto no es necesario subirlo.

    Ya que entiendo que estos no deben estar en el repo al ser algo que se genera automaticamente para que entienda el navegador

Del resto todo claro, quedo a la espera del feedback :)
## Primera parte

<!-- Dudas de la primera parte del ejercicio -->

## Segunda parte

<!-- Dudas de la segunda parte del ejercicio -->

## Tercera parte

<!-- Dudas de la tercera parte del ejercicio -->

## Cuarta parte

<!-- Dudas de la cuarta parte del ejercicio -->

## Quinta parte

<!-- Dudas de la quinta parte del ejercicio -->

## Sexta parte

<!-- Dudas de la sexta parte del ejercicio -->
