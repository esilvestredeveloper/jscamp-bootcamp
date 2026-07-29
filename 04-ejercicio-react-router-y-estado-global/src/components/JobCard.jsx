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

        <button className={buttonClasses} onClick={handleApplyClick}>
          {buttonText}
        </button>
      </article>
  )
}
