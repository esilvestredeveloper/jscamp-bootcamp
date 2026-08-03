import { useAuthStore } from '../store/authStore.js'

export function AuthButton() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)

  return (
      <button className="button-login" onClick={isLoggedIn ? logout : login}>
        {isLoggedIn ? 'Cerrar sesión' : 'Iniciar sesión'}
      </button>
  )
}
