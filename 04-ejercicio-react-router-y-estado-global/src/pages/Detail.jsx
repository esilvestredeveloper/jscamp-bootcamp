import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import snarkdown from 'snarkdown'

import { Link } from '../components/Link.jsx'
import { Loader } from '../components/Loader.jsx'
import styles from './Detail.module.css'

const API_URL = 'https://jscamp-api.vercel.app/api/jobs'

function JobSection({ title, content }) {
    if (!content) return null

    return (
        <section className={styles.section}>
            <h2>{title}</h2>
            <div className={styles.prose} dangerouslySetInnerHTML={{ __html: snarkdown(content) }} />
        </section>
    )
}

export function DetailPage() {
    const { id } = useParams()

    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isApplied, setIsApplied] = useState(false)

    useEffect(() => {
        const controller = new AbortController()

        async function fetchJob() {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch(`${API_URL}/${id}`, { signal: controller.signal })

                if (!response.ok) {
                    throw new Error('No hemos podido encontrar esta oferta de empleo.')
                }

                const json = await response.json()
                setJob(json)
            } catch (error) {
                if (error.name === 'AbortError') return
                setError(error.message)
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        fetchJob()

        return () => controller.abort()
    }, [id])

    useEffect(() => {
        setIsApplied(false)
    }, [id])

    if (loading) {
        return (
            <main className={styles.loadingPage}>
                <title>Cargando oferta... - DevJobs</title>
                <Loader text="Cargando oferta..." />
            </main>
        )
    }

    if (error || !job) {
        return (
            <main className={styles.status}>
                <title>Oferta no encontrada - DevJobs</title>
                <h1>Oferta no encontrada</h1>
                <p>{error}</p>
                <Link href="/search">Volver a la búsqueda</Link>
            </main>
        )
    }

    const buttonClasses = isApplied ? `${styles.applyButton} ${styles.isApplied}` : styles.applyButton
    const buttonText = isApplied ? 'Aplicado' : 'Aplicar ahora'

    return (
        <main className={styles.detail}>
            <title>{`${job.titulo} en ${job.empresa} - DevJobs`}</title>
            <meta name="description" content={job.descripcion} />

            <nav className={styles.breadcrumb} aria-label="Migas de pan">
                <Link href="/search">Empleos</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{job.titulo}</span>
            </nav>

            <header className={styles.jobHeader}>
                <div>
                    <h1>{job.titulo}</h1>
                    <p className={styles.company}>
                        {job.empresa} · {job.ubicacion}
                    </p>
                </div>

                <button className={buttonClasses} onClick={() => setIsApplied(true)}>
                    {buttonText}
                </button>
            </header>

            <JobSection title="Descripción del puesto" content={job.content?.description} />
            <JobSection title="Responsabilidades" content={job.content?.responsibilities} />
            <JobSection title="Requisitos" content={job.content?.requirements} />
            <JobSection title="Acerca de la empresa" content={job.content?.about} />

            <div className={styles.footerActions}>
                <button className={buttonClasses} onClick={() => setIsApplied(true)}>
                    {buttonText}
                </button>
            </div>
        </main>
    )
}

export default DetailPage
