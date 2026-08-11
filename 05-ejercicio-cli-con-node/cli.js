import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const UNIDADES = ['B', 'KB', 'MB', 'GB', 'TB']

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'

  const indice = Math.floor(Math.log(bytes) / Math.log(1024))
  const tamaño = bytes / 1024 ** indice

  return `${tamaño.toFixed(2)} ${UNIDADES[indice]}`
}

const directorio = process.argv[2] ?? '.'

let nombres

try {
  nombres = await readdir(directorio)
} catch (error) {
  console.error(`No se pudo leer el directorio "${directorio}": ${error.message}`)
  process.exit(1)
}

const elementos = await Promise.all(
  nombres.map(async (nombre) => {
    const info = await stat(join(directorio, nombre))
    const esDirectorio = info.isDirectory()

    return {
      nombre,
      esDirectorio,
      tamaño: esDirectorio ? '-' : formatSize(info.size)
    }
  })
)

elementos.forEach(({ nombre, esDirectorio, tamaño }) => {
  const icono = esDirectorio ? '📁' : '📄'

  console.log(`${icono} ${nombre.padEnd(26)}${tamaño}`)
})
