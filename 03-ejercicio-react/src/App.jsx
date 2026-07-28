import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { SearchFormSection } from './components/SearchFormSection'
import { SearchResultsSection } from './components/SearchResultsSection'
import { Footer } from './components/Footer'
import jobs from './data.json'

const JOBS_PER_PAGE = 3
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

function filterJobs(jobs, { text, technology, location, level }) {
    return jobs.filter((job) => {
        if (technology && job.data.technology !== technology) return false
        if (location && job.data.modalidad !== location) return false
        if (level && job.data.nivel !== level) return false

        if (text) {
            const search = text.toLowerCase()
            const matches =
                job.titulo.toLowerCase().includes(search) ||
                job.empresa.toLowerCase().includes(search) ||
                job.ubicacion.toLowerCase().includes(search) ||
                job.descripcion.toLowerCase().includes(search)

            if (!matches) return false
        }

        return true
    })
}

function App() {
    const [filters, setFilters] = useState(getInitialFilters)
    const [debouncedText, setDebouncedText] = useState(filters.text)
    const [currentPage, setCurrentPage] = useState(getInitialPage)

    const filteredJobs = filterJobs(jobs, { ...filters, text: debouncedText })
    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE))

    // Si la URL trae una pagina que ya no existe, nos quedamos en la ultima
    const safePage = Math.min(currentPage, totalPages)
    const startIndex = (safePage - 1) * JOBS_PER_PAGE
    const visibleJobs = filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE)

    // Debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedText(filters.text)
        }, DEBOUNCE_DELAY)

        return () => clearTimeout(timeoutId)
    }, [filters.text])

    // Añade parametros de busqueda en la URL
    useEffect(() => {
        const params = new URLSearchParams()

        if (debouncedText) params.set('text', debouncedText)
        if (filters.technology) params.set('technology', filters.technology)
        if (filters.location) params.set('location', filters.location)
        if (filters.level) params.set('level', filters.level)
        if (safePage > 1) params.set('page', String(safePage))

        const query = params.toString()
        window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname)
    }, [debouncedText, filters.technology, filters.location, filters.level, safePage])

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters)
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    return (
        <>
            <Header />
            <main>
                <SearchFormSection initialFilters={filters} onFiltersChange={handleFiltersChange} />
                <SearchResultsSection
                    jobs={visibleJobs}
                    currentPage={safePage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </main>
            <Footer />
        </>
    )
}

export default App
