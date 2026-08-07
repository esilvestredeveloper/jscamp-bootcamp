import { useFavoritesStore } from '../store/favoritesStore.js'

export function FavoriteButton({ jobId, jobTitle }) {
  const isFavorite = useFavoritesStore((state) => state.favorites.includes(jobId))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  const buttonClasses = isFavorite ? 'button-favorite is-favorite' : 'button-favorite'
  const buttonText = isFavorite ? 'En favoritos' : 'Agregar a favoritos'
  const label = isFavorite ? `Quitar ${jobTitle} de favoritos` : `Agregar ${jobTitle} a favoritos`

  return (
      <button
          className={buttonClasses}
          onClick={() => toggleFavorite(jobId)}
          aria-pressed={isFavorite}
          aria-label={label}
      >
        <svg
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {buttonText}
      </button>
  )
}
