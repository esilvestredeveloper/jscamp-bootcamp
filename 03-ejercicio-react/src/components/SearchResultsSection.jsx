import { useState } from 'react'
import jobs from '../data.json'
import { JobListings } from './JobListings'
import { Pagination } from './Pagination'

const JOBS_PER_PAGE = 5

export function SearchResultsSection() {
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE)

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    return (
        <section>
            <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

            <JobListings jobs={jobs} />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </section>
    )
}
