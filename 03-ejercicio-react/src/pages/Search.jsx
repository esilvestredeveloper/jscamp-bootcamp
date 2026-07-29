import { useEffect, useState } from 'react'
import { SearchFormSection } from '../components/SearchFormSection'
import { SearchResultsSection } from '../components/SearchResultsSection'
import { useJobs } from '../hooks/useJobs'

const JOBS_PER_PAGE = 5
const DEBOUNCE_DELAY = 500

function getInitialFilters() {
    const params = new URLSearchParams(window.location.search)

    return {
        text: params.get('text') ?? '',
        technology: params.get('technology') ?? '',
        location: params.get('location') ?? '',
        level: params.get('level') ?? '',
    }
}

function getInitialPage() {
    const params = new URLSearchParams(window.location.search)
    const page = Number(params.get('page'))

    return Number.isInteger(page) && page > 0 ? page : 1
}

export function SearchPage() {
    const [filters, setFilters] = useState(getInitialFilters)
    const [debouncedText, setDebouncedText] = useState(filters.text)
    const [currentPage, setCurrentPage] = useState(getInitialPage)

    // La API se encarga del filtrado y paginación
    const { jobs, total, isLoading, error, retry } = useJobs({
        ...filters,
        text: debouncedText,
        page: currentPage,
        perPage: JOBS_PER_PAGE,
    })

    // El total de páginas viene de la API
    const totalPages = Math.max(1, Math.ceil(total / JOBS_PER_PAGE))

    // Debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedText(filters.text)
        }, DEBOUNCE_DELAY)

        return () => clearTimeout(timeoutId)
    }, [filters.text])

    // Si entramos con una página que ya no existe (URL compartida o editada a mano),
    // nos colocamos en la última válida
    useEffect(() => {
        if (!isLoading && currentPage > totalPages) setCurrentPage(totalPages)
    }, [isLoading, currentPage, totalPages])

    // La URL es la fuente de verdad: refleja filtros, texto y página
    useEffect(() => {
        const params = new URLSearchParams()

        if (debouncedText) params.set('text', debouncedText)
        if (filters.technology) params.set('technology', filters.technology)
        if (filters.location) params.set('location', filters.location)
        if (filters.level) params.set('level', filters.level)
        if (currentPage > 1) params.set('page', String(currentPage))

        const query = params.toString()
        window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname)
    }, [debouncedText, filters.technology, filters.location, filters.level, currentPage])

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters)
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    // Añadimos <Title> dinamico
    const pageTitle = isLoading
        ? 'Buscando empleos... | DevJobs'
        : `Resultados ${total} | Página ${currentPage} | DevJobs`

    return (
        <main>
            <title>{pageTitle}</title>

            <SearchFormSection initialFilters={filters} onFiltersChange={handleFiltersChange} />

            <SearchResultsSection
                jobs={jobs}
                total={total}
                isLoading={isLoading}
                error={error}
                onRetry={retry}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </main>
    )
}
