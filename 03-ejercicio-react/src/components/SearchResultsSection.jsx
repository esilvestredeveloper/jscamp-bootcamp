import { JobListings } from './JobListings'
import { Pagination } from './Pagination'

export function SearchResultsSection({ jobs, currentPage, totalPages, onPageChange }) {
    return (
        <section>
            <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

            <JobListings jobs={jobs} />

            {jobs.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </section>
    )
}
