import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Pagination } from '../components/Pagination.jsx'
import { SearchFormSection } from '../components/SearchFormSection.jsx'
import { JobListings } from '../components/JobListings.jsx'
import { Loader } from '../components/Loader.jsx'

const RESULTS_PER_PAGE = 4

const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const textToFilter = searchParams.get('text') || ''
  const technology = searchParams.get('technology') || ''
  const location = searchParams.get('type') || ''
  const experienceLevel = searchParams.get('level') || ''
  const currentPage = Number(searchParams.get('page')) || 1

  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const updateSearchParams = (newParams) => {
    setSearchParams((previousParams) => {
      const params = new URLSearchParams(previousParams)

      Object.entries(newParams).forEach(([key, value]) => {
        if (value) params.set(key, value)
        else params.delete(key)
      })

      return params
    })
  }

  useEffect(() => {
    const controller = new AbortController()

    async function fetchJobs() {
      try {
        setLoading(true)

        const params = new URLSearchParams()
        if (textToFilter) params.set('text', textToFilter)
        if (technology) params.set('technology', technology)
        if (location) params.set('type', location)
        if (experienceLevel) params.set('level', experienceLevel)

        params.set('limit', RESULTS_PER_PAGE)
        params.set('offset', (currentPage - 1) * RESULTS_PER_PAGE)

        const response = await fetch(`https://jscamp-api.vercel.app/api/jobs?${params}`, {
          signal: controller.signal,
        })
        const json = await response.json()

        setJobs(json.data)
        setTotal(json.total)
      } catch (error) {
        if (error.name === 'AbortError') return
        console.error('Error fetching jobs:', error)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchJobs()

    return () => controller.abort()
  }, [textToFilter, technology, location, experienceLevel, currentPage])

  const totalPages = Math.ceil(total / RESULTS_PER_PAGE)

  const handlePageChange = (page) => {
    updateSearchParams({ page: page > 1 ? page : '' })
  }

  const handleSearch = (filters) => {
    updateSearchParams({
      technology: filters.technology,
      type: filters.location,
      level: filters.experienceLevel,
      page: '',
    })
  }

  const handleTextFilter = (newTextToFilter) => {
    updateSearchParams({ text: newTextToFilter, page: '' })
  }

  return {
    loading,
    jobs,
    total,
    totalPages,
    currentPage,
    textToFilter,
    filters: { technology, location, experienceLevel },
    handlePageChange,
    handleSearch,
    handleTextFilter,
  }
}

export function SearchPage() {
  const {
    jobs,
    total,
    loading,
    totalPages,
    currentPage,
    textToFilter,
    filters,
    handlePageChange,
    handleSearch,
    handleTextFilter,
  } = useFilters()

  const title = loading
      ? `Cargando... - DevJobs`
      : `Resultados: ${total}, Página ${currentPage} - DevJobs`

  return (
      <main>
        <title>{title}</title>
        <meta
            name="description"
            content="Explora miles de oportunidades laborales en el sector tecnológico. Encuentra tu próximo empleo en DevJobs."
        />

        <SearchFormSection
            initialText={textToFilter}
            initialFilters={filters}
            onSearch={handleSearch}
            onTextFilter={handleTextFilter}
        />

        <section>
          <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

          {loading ? <Loader text="Cargando empleos..." /> : <JobListings jobs={jobs} />}

          <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
          />
        </section>
      </main>
  )
}

export default SearchPage
