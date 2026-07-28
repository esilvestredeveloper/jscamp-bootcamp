import { useState } from 'react'
import styles from './JobCard.module.css'

export function JobCard({ job }) {
    const { titulo, empresa, ubicacion, descripcion, data } = job
    const [aplicado, setAplicado] = useState(false)

    return (
        <article
            className="job-listing-card"
            data-modalidad={data.modalidad}
            data-nivel={data.nivel}
            data-technology={data.technology}
        >
            <div>
                <h3>{titulo}</h3>
                <small>
                    {empresa} | {ubicacion}
                </small>
                <p>{descripcion}</p>
            </div>
            <button
                className={`button-apply-job ${aplicado ? styles.applied : ''}`}
                onClick={() => setAplicado(true)}
                disabled={aplicado}
            >
                {aplicado ? 'Aplicado' : 'Aplicar'}
            </button>
        </article>
    )
}
