import { ErrorMessage } from './ErrorMessage'
import { JobListings } from './JobListings'
import { Loader } from './Loader'
import { Pagination } from './Pagination'

export function SearchResultsSection({
                                         jobs,
                                         total,
                                         isLoading,
                                         error,
                                         onRetry,
                                         currentPage,
                                         totalPages,
                                         onPageChange,
                                     }) {
    return (
        <section>
            <h2 style={{ textAlign: 'center' }}>
                Resultados de búsqueda
                {!isLoading && !error && total > 0 && <small> ({total})</small>}
            </h2>

            {/* Tres estados: error, cargando o resultados */}
            {error ? (
                <ErrorMessage message={error.message} onRetry={onRetry} />
            ) : isLoading ? (
                <Loader />
            ) : (
                <>
                    <JobListings jobs={jobs} />

                    {/* Sin resultados no mostramos paginación */}
                    {total > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    )}
                </>
            )}
        </section>
    )
}
