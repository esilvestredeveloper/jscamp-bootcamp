import { useEffect, useState } from 'react'
import { fetchJobs } from '../services/jobs'

export function useJobs({ text, technology, location, level, page, perPage }) {
    const [jobs, setJobs] = useState([])
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    // Cambiar este número es la forma de obligar al efecto a repetirse (botón "Reintentar")
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        // Si el usuario sigue escribiendo o cambia de página, cancelamos la petición
         const controller = new AbortController()

        const loadJobs = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const { jobs, total } = await fetchJobs({
                    text,
                    technology,
                    location,
                    level,
                    limit: perPage,
                    offset: (page - 1) * perPage,
                    signal: controller.signal,
                })

                setJobs(jobs)
                setTotal(total)
            } catch (error) {
                // Una petición cancelada por nosotros no es un error que mostrar
                if (error.name === 'AbortError') return

                setError(error)
                setJobs([])
                setTotal(0)
            } finally {
                // Comprobamos que no la hayamos cancelado: ya hay otra petición en marcha
                if (!controller.signal.aborted) setIsLoading(false)
            }
        }

        loadJobs()

        return () => controller.abort()
    }, [text, technology, location, level, page, perPage, attempt])

    const retry = () => setAttempt((previous) => previous + 1)

    return { jobs, total, isLoading, error, retry }
}
