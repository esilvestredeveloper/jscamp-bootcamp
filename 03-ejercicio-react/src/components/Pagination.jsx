import styles from './Pagination.module.css'

export function Pagination({ currentPage = 1, totalPages = 1, onPageChange = () => {} }) {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

    const isFirstPage = currentPage === 1
    const isLastPage = currentPage === totalPages

    const handlePageClick = (event, page) => {
        event.preventDefault()
        if (page === currentPage) return
        onPageChange(page)
    }

    const handlePreviousClick = (event) => {
        event.preventDefault()
        if (isFirstPage) return
        onPageChange(currentPage - 1)
    }

    const handleNextClick = (event) => {
        event.preventDefault()
        if (isLastPage) return
        onPageChange(currentPage + 1)
    }

    return (
        <nav className="pagination">
            <a
                href="#"
                aria-label="Página anterior"
                aria-disabled={isFirstPage}
                className={isFirstPage ? styles.disabled : undefined}
                onClick={handlePreviousClick}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M15 6l-6 6l6 6" />
                </svg>
            </a>

            {pages.map((page) => (
                <a
                    key={page}
                    href="#"
                    data-page={page}
                    aria-current={page === currentPage ? 'page' : undefined}
                    className={page === currentPage ? 'is-active' : undefined}
                    onClick={(event) => handlePageClick(event, page)}
                >
                    {page}
                </a>
            ))}

            <a
                href="#"
                aria-label="Página siguiente"
                aria-disabled={isLastPage}
                className={isLastPage ? styles.disabled : undefined}
                onClick={handleNextClick}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 6l6 6l-6 6" />
                </svg>
            </a>
        </nav>
    )
}
