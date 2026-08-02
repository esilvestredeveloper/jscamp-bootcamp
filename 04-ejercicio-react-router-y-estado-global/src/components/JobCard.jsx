import { useState } from 'react'

import { Link } from './Link.jsx'

export function JobCard({ job }) {
  const [isApplied, setIsApplied] = useState(false)

  const handleApplyClick = () => {
    setIsApplied(true)
  }

  const buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job'
  const buttonText = isApplied ? 'Aplicado' : 'Aplicar'

  return (
      <article
          className="job-listing-card"
          data-modalidad={job.data.modalidad}
          data-nivel={job.data.nivel}
          data-technology={job.data.technology}
      >
        <Link
            href={`/job/${job.id}`}
            className="job-listing-link"
            aria-label={`Ver detalles de ${job.titulo} en ${job.empresa}`}
        >
          <h3>{job.titulo}</h3>
          <small>
            {job.empresa} | {job.ubicacion}
          </small>
          <p>{job.descripcion}</p>
        </Link>

        <div className="job-listing-actions">
          <button className={buttonClasses} onClick={handleApplyClick}>
            {buttonText}
          </button>

          <button className="button-favorite" aria-label={`Agregar ${job.titulo} a favoritos`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Agregar a favoritos
          </button>
        </div>
      </article>
  )
}
