import { useRouter } from '../hooks/useRouter'

export function Route({ path, component }) {
    const { currentPath } = useRouter()

    if (currentPath !== path) return null

    const Component = component

    return <Component />
}
