import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const UNIDADES = ['B', 'KB', 'MB', 'GB', 'TB']

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'

  const indice = Math.floor(Math.log(bytes) / Math.log(1024))
  const tamaño = bytes / 1024 ** indice

  return `${tamaño.toFixed(2)} ${UNIDADES[indice]}`
}

const esFlag = (argumento) => argumento.startsWith('--')

const argumentos = process.argv.slice(2)
const flags = argumentos.filter(esFlag)
const directorio = argumentos.find((argumento) => !esFlag(argumento)) ?? '.'

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

if (flags.includes('--asc')) {
  elementos.sort((a, b) => a.nombre.localeCompare(b.nombre))
} else if (flags.includes('--desc')) {
  elementos.sort((a, b) => b.nombre.localeCompare(a.nombre))
}

elementos.forEach(({ nombre, esDirectorio, tamaño }) => {
  const icono = esDirectorio ? '📁' : '📄'

  console.log(`${icono} ${nombre.padEnd(26)}${tamaño}`)
})
