import styles from './Loader.module.css'

export function Loader({ text = 'Cargando...' }) {
    return (
        <div className={styles.loader} role="status" aria-live="polite">
            <div className={styles.spinner} />
            <p>{text}</p>
        </div>
    )
}
