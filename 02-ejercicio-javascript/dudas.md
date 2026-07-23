## Todo hecho

## Información sobre el ejercicio
He implementado una paginación que divide los empleos en páginas de 5 elementos. La paginación inferior se genera dinámicamente en función del número total de resultados y se recalcula automáticamente al aplicar filtros.

Esta lógica se ha implementado mediante eventos.

## Dudas

- A nivel de estructura de carpetas, suelo tener dudas sobre buenas prácticas.  
  ¿Lo correcto sería colocar los datos en `/assets/data/` y los archivos JavaScript en `/assets/js`?

**Respuesta:**
Hola genio! Como estas? Primero que nada, excelentes preguntas! Ahora, sobre tu duda:
La realidad es que de "buenas prácticas" hay todo un mundo de posibilidades. Algunos te van a decir que agrupes los archivos de una manera, y otros de otra. Lo importante, sobre todas las cosas, es que la agrupación se entienda. Al final del día hacemos código que van a leer otras personas y nosotros en un futuro, lo más importante es facilitarle la vida a esas personas y hacer que las cosas sean fáciles de encontrar.

Si el contenido de `/assets/js`, `/assets/data/` o `/assets/css` tiene pocos archivos cada uno, los archivos tienen nombres claros y el proyecto no es lo suficientemente grande como para tener mucho contenido suelto y de funcionalidades diferentes, entonces lo veo una "buena práctica".

En la respuesta de la siguiente pregunta te voy a dejar un artículo que para mi (subjetivamente), es la mejor manera de organizar proyectos (la usamos con midu en muchos proyectos, hasta en midu.dev, y nos va súper bien).

- ¿Existe alguna documentación o guía recomendada para organizar el código siguiendo estándares y buenas prácticas?

**Respuesta:**
Para mi Screaming Architecture es la mejor, no es estricta, es muy clara a la vista (cuando estás navegando entre carpetas) y tiene mucha libertad para modificarla a tu manera. Te dejo un artículo que está bastante bien sobre eso:
https://dev.to/sergioazoc/screaming-architecture-la-clave-para-un-frontend-escalable-4po

Y te dejo un short de midu explicando un poco esto: https://www.youtube.com/shorts/4DP8mMUjWA8

- En relación con GitHub, ¿cuál es la mejor forma de reorganizar archivos sin perder el historial?  
  ¿Lo correcto sería moverlos mediante comandos (`git mv`) y hacer un commit únicamente de ese cambio, o existe alguna otra práctica recomendada?

**Respuesta:**
Buena pregunta! Sí, `git mv` + un commit dedicado es correcto si :)