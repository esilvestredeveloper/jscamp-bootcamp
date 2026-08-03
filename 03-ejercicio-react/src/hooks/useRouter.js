import { useEffect, useState } from 'react'

// Evento propio
export const NAVIGATION_EVENT = 'devjobs:navigation'

export function navigateTo(href) {
    window.history.pushState(null, '', href)
    window.dispatchEvent(new Event(NAVIGATION_EVENT))
}

export function useRouter() {
    const [currentPath, setCurrentPath] = useState(() => window.location.pathname)

    useEffect(() => {
        const handleNavigation = () => {
            setCurrentPath(window.location.pathname)
        }

        // popstate: botones atras/adelante del navegador
        window.addEventListener('popstate', handleNavigation)

        // el nuestro: navegaciones hechas con navigateTo()
        window.addEventListener(NAVIGATION_EVENT, handleNavigation)

        return () => {
            window.removeEventListener('popstate', handleNavigation)
            window.removeEventListener(NAVIGATION_EVENT, handleNavigation)
        }
    }, [])

    return { currentPath, navigateTo }
}
