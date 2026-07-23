
const searchForm = document.querySelector('#empleos-search-form')
const searchInput = document.querySelector('#empleos-search-input')
const locationSelect = document.querySelector('#filter-location')
const experienceSelect = document.querySelector('#filter-experience-level')
const technologySelect = document.querySelector('#filter-technology')

// Revisa empleos y muestra los que cumplen con filtros
function applyFilters() {
  const search = searchInput.value.trim().toLowerCase()
  const location = locationSelect.value
  const experience = experienceSelect.value
  const technology = technologySelect.value

  const cards = document.querySelectorAll('.job-listing-card')

  cards.forEach((card) => {
    const { titulo, ubicacion, nivel, technology: techs } = card.dataset

    // Si el filtro está vacío, lo cumplen todos
    const matchSearch = titulo.includes(search)
    const matchLocation = location === '' || ubicacion === location
    const matchExperience = experience === '' || nivel === experience
    const matchTechnology = technology === '' || techs.split(',').includes(technology)

    const visible = matchSearch && matchLocation && matchExperience && matchTechnology

    card.classList.toggle('is-hidden', !visible)
  })

  // Avisamos a pagination
  document.dispatchEvent(new Event('filters:changed'))
}

// Cuando cambia un filtro aplicamos todo de nuevo
searchInput.addEventListener('input', applyFilters)
locationSelect.addEventListener('change', applyFilters)
experienceSelect.addEventListener('change', applyFilters)
technologySelect.addEventListener('change', applyFilters)

// Evitamos regarga al pulsar enter
searchForm.addEventListener('submit', (event) => event.preventDefault())
