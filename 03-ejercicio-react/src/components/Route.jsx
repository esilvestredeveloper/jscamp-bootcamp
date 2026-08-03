import { useRouter } from '../hooks/useRouter'

export function Route({ path, component: Component }) {
    const { currentPath } = useRouter()

    if (currentPath !== path) return null

    // Está genial! También se puede hacer desde las props, te muestro como
    // Ambas opciones están bien
    // const Component = component

    return <Component />
}
