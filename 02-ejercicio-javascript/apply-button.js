
const jobsList = document.querySelector('.jobs-listings')

// Escuchamos clics en toda la lista (delegación de eventos). también funciona con los elementos creados a posterior
jobsList.addEventListener('click', (event) => {
  const button = event.target.closest('.button-apply-job')
  if (!button) return

  button.textContent = '¡Aplicado!' // cambia texto
  button.classList.add('is-applied') // cambia color a verde
  button.disabled = true // deshabilita botón
})
