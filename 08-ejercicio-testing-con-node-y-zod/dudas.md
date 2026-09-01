En schemas/jobs.js he importado Zod utilizando z:

import { z } from 'zod'

Sé que Midu también lo ha hecho así y que, al ser un fichero tan corto, no genera ninguna duda. Sin embargo, me surge la duda de si sería recomendable utilizar un nombre más descriptivo en lugar de simplemente z.

Por ejemplo, entiendo que en este caso z es perfectamente reconocible porque es la forma habitual de importar Zod, pero pensando en la mantenibilidad del código y, especialmente, en aplicaciones grandes, ¿qué opción consideráis más recomendable?

¿Utilizar z como abreviatura es una buena práctica que mantendríais independientemente del tamaño del proyecto, o tendría sentido utilizar un nombre más descriptivo en determinados casos?