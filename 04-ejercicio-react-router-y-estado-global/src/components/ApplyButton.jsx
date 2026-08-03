import { useAuthStore } from '../store/authStore.js'
import { useApplicationsStore } from '../store/applicationsStore.js'

export function ApplyButton({
                              jobId,
                              className,
                              appliedClassName,
                              textApply = 'Aplicar',
                              textApplied = 'Aplicado',
                              textLoggedOut = 'Inicia sesión',
                            }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const hasApplied = useApplicationsStore((state) => state.applications.includes(jobId))
  const apply = useApplicationsStore((state) => state.apply)

  if (hasApplied) {
    return (
        <button className={`${className} ${appliedClassName}`} aria-disabled="true">
          {textApplied}
        </button>
    )
  }

  if (!isLoggedIn) {
    return (
        <button className={className} disabled title="Inicia sesión para poder aplicar">
          {textLoggedOut}
        </button>
    )
  }

  return (
      <button className={className} onClick={() => apply(jobId)}>
        {textApply}
      </button>
  )
}
