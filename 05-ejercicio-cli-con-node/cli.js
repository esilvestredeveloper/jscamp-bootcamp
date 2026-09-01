import { readdir, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'

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

// Muy bien, pero mira, con `.?` podemos simplificar el `if`. Si `process.permission` es undefined, ya daremos `false` como resultado.
// Por otro lado `permission` ya no es experimental, así que podemos usar `--permission` en lugar de `--experimental-permission`.
// if (process.permission && !process.permission.has('fs.read', resolve(directorio))) {
if(!process.permission?.has('fs.read', resolve(directorio))) {
  console.error(`Sin permiso de lectura sobre "${directorio}".`)
  console.error('Vuelve a lanzarlo concediendo el acceso:')
  console.error(`  node --permission --allow-fs-read=${directorio} cli.js ${directorio}`)
  process.exit(1)
}

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

const soloArchivos = flags.includes('--files')
const soloCarpetas = flags.includes('--folders')

const mostrarArchivos = soloArchivos || !soloCarpetas
const mostrarCarpetas = soloCarpetas || !soloArchivos

const visibles = elementos.filter(({ esDirectorio }) =>
  esDirectorio ? mostrarCarpetas : mostrarArchivos
)

if (flags.includes('--asc')) {
  visibles.sort((a, b) => a.nombre.localeCompare(b.nombre))
} else if (flags.includes('--desc')) {
  visibles.sort((a, b) => b.nombre.localeCompare(a.nombre))
}

// Lo que hiciste está genial! No está mal, te voy a mostrar una alternativa con `console.table` para que pruebes y veas como se ve. Para estos casos de lista, puede quedar muy lindo visualmente en la consola.

let logArguments = []

visibles.forEach(({ nombre, esDirectorio, tamaño }) => {
  const icono = esDirectorio ? '📁' : '📄'

  logArguments.push({
    type: icono,
    name: nombre,
    size: tamaño
  })
  // console.log(`${icono} ${nombre.padEnd(26)}${tamaño}`)
})

console.table(logArguments)
