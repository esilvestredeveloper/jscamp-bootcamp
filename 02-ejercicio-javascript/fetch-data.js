
const jobsList = document.querySelector('.jobs-listings')

// Cargamos los empleos
const response = await fetch('./data.json')
const jobs = await response.json()

// Creamos elemento para cada empleo y lo insertamos
// Guardamos los datos del filtro en atributos
jobsList.innerHTML = jobs
  .map(
    (job) => `
      <li>
        <article
          class="job-listing-card"
          data-titulo="${job.titulo.toLowerCase()}"
          data-ubicacion="${job.data.modalidad}"
          data-nivel="${job.data.nivel}"
          data-technology="${job.data.technology.join(',')}"
        >
          <div>
            <h3>${job.titulo}</h3>
            <small>${job.empresa} | ${job.ubicacion}</small>
            <p>${job.descripcion}</p>
          </div>
          <button class="button-apply-job">Aplicar</button>
        </article>
      </li>
    `
  )
  .join('')

// Avisamos a paginatión
document.dispatchEvent(new Event('jobs:rendered'))
