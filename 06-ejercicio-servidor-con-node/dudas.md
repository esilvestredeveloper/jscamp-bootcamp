## 01. ¿Cómo encontráis los paquetes adecuados para un proyecto?

¿Hay alguna página, herramienta, plugin de IDE o alguna forma de encontrar de manera sencilla qué paquetes encajan mejor con un proyecto?

He visto que Midu, por ejemplo, recomienda paquetes como si fuera un mago sacando trucos de la chistera 😄, pero sí que me gustaría entender cuál suele ser vuestro flujo a la hora de descubrir y elegir dependencias.

Yo normalmente suelo tirar de Google, investigar alternativas y comparar cuál encaja mejor, pero me preguntaba si existe algún proceso o herramienta que pueda simplificar un poco esta parte.

**Respuesta:** Hola! Muy buena pregunta, es verdad que sacamos paquetes de la nada 😅 Mira, midu se que está asociado a un montón de newsletter en donde por mail le llegan novedades de la semana, y en esas novedades aparece algún paquete interesante que está bueno compartir o re-compartir.

Es muy personal, lo que haces de google está muy bien. Lo que hago en mi caso, a diferencia de midu y tú con google es buscar en X (twitter):

Muchos desarrolladores y creadores de contenido comparten librerías/herramientas por ahí. Y X tiene un buen buscador en el que si pones "charts react" te saldrán muchas alternativas, específico para lo que buscas.

En mi caso, me ha ayudado mucho.

## 02. Gestión de ficheros `.env`

Para los ficheros `.env`, te he creado un fichero `.env.example`, ya que sé que el fichero con las variables reales no debe subirse al repositorio y debería estar incluido en el `.gitignore`.

Cualquier feedback sobre cómo soléis gestionar esto en aplicaciones reales es bienvenido. Sé que, por ejemplo, también se puede utilizar un fichero `.env.local` para las variables específicas del entorno local.

De momento, eso es todo. ¡Gracias de antemano por todo!

**Respuesta:** Excelente! Muy bien hecho. Es más, no debería haber ninguna variable de entorno pública subida a github por seguridad.
Tener un `.env.example` es lo correcto, y en ese mismo fichero, que haya comentarios explicando cómo se puede obtener la variable de entorno que se necesita:

```bash
# En supabase ve a dashboard -> settings -> API -> Project API Keys y copia la clave secreta
DATABASE_SECRET_KEY="clave_secreta"
```