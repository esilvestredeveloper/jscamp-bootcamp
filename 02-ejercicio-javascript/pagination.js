/* Lógica de paginación */

const PER_PAGE = 5
let currentPage = 1

const jobsList = document.querySelector('.jobs-listings')
const paginationNav = document.querySelector('.pagination')

// Empleos que pasan filtros
function getMatchingCards() {
  return [...jobsList.querySelectorAll('.job-listing-card:not(.is-hidden)')]
}

// Dibuja la página + botones
function render() {
  const cards = getMatchingCards()
  const totalPages = Math.max(1, Math.ceil(cards.length / PER_PAGE))

  // Si la página actual ya no existe, nos ajustamos
  if (currentPage > totalPages) currentPage = totalPages

  const start = (currentPage - 1) * PER_PAGE

  // Mostramos solo las tarjetas de esta página
  cards.forEach((card, index) => {
    const enEstaPagina = index >= start && index < start + PER_PAGE
    card.classList.toggle('is-page-hidden', !enEstaPagina)
  })

  renderButtons(totalPages)
}

// Genera los números dinámicos + flechas
function renderButtons(totalPages) {
  let html = `<a href="#" data-page="prev" aria-label="Página anterior" title="Anterior">‹</a>`

  for (let n = 1; n <= totalPages; n++) {
    const active = n === currentPage ? 'is-active' : ''
    html += `<a href="#" class="${active}" data-page="${n}">${n}</a>`
  }

  html += `<a href="#" data-page="next" aria-label="Página siguiente" title="Siguiente">›</a>`
  paginationNav.innerHTML = html
}

// Clics en los botones
paginationNav.addEventListener('click', (event) => {
  event.preventDefault()
  const link = event.target.closest('a[data-page]')
  if (!link) return

  const totalPages = Math.max(1, Math.ceil(getMatchingCards().length / PER_PAGE))
  const value = link.dataset.page

  if (value === 'prev') currentPage = Math.max(1, currentPage - 1)
  else if (value === 'next') currentPage = Math.min(totalPages, currentPage + 1)
  else currentPage = Number(value)

  render()
})

// Al cambiar filtros: volvemos a la página 1 y repintamos
document.addEventListener('filters:changed', () => {
  currentPage = 1
  render()
})

// Primera vez: si los empleos ya están pintados, render ya; si no, esperamos el aviso
if (jobsList.querySelector('.job-listing-card')) {
  render()
} else {
  document.addEventListener('jobs:rendered', render, { once: true })
}
