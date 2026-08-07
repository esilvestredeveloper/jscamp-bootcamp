import { Link } from './Link.jsx'
import { ApplyButton } from './ApplyButton.jsx'
import { FavoriteButton } from './FavoriteButton.jsx'

export function JobCard({ job }) {
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
          <ApplyButton
              jobId={job.id}
              className="button-apply-job"
              appliedClassName="is-applied"
          />

          <FavoriteButton jobId={job.id} jobTitle={job.titulo} />
        </div>
      </article>
  )
}
