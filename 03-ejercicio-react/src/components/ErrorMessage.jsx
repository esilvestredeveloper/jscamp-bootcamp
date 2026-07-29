import styles from './ErrorMessage.module.css'

export function ErrorMessage({ message, onRetry }) {
    return (
        <div className={styles.error} role="alert">
            <p>No hemos podido cargar los empleos. Revisa tu conexión e inténtalo de nuevo.</p>

            {message && <small>{message}</small>}

            {onRetry && (
                <button type="button" className={styles.retry} onClick={onRetry}>
                    Reintentar
                </button>
            )}
        </div>
    )
}
