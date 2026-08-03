const API_URL = 'https://jscamp-api.vercel.app/api/jobs'

// Traduce nuestros filtros a los query params que entiende la API.
function buildSearchParams({ text, technology, location, level, limit, offset }) {
    const params = new URLSearchParams()

    // Solo mandamos los filtros que tienen valor
    if (text) params.set('text', text)
    if (technology) params.set('technology', technology)
    if (location) params.set('type', location)
    if (level) params.set('level', level)

    // limit = cuántos empleos por página
    // offset = desde cuál empezamos
    params.set('limit', String(limit))
    params.set('offset', String(offset))

    return params
}

export async function fetchJobs({ signal, ...filters }) {
    const params = buildSearchParams(filters)
    const response = await fetch(`${API_URL}?${params}`, { signal })

    // fetch solo falla si hay error de red: un 404 o un 500 llegan aquí como "ok = false"
    if (!response.ok) {
        throw new Error(`La API ha respondido con un error ${response.status}`)
    }

    const { data, total } = await response.json()

    // "total" son TODOS los empleos que cumplen el filtro, no solo los de esta página
    return { jobs: data, total }
}
