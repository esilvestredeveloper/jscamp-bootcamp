import styles from './Loader.module.css'

export function Loader({ text = 'Buscando empleos...' }) {
    return (
        // role="status" + aria-live avisan a los lectores de pantalla del cambio
        <p className={styles.loader} role="status" aria-live="polite">
            <span className={styles.spinner} aria-hidden="true" />
            {text}
        </p>
    )
}
