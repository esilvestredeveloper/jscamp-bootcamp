import { navigateTo } from '../hooks/useRouter'

export function Link({ to, children, ...props }) {
    const handleClick = (event) => {
        event.preventDefault()
        navigateTo(to)
    }

    return (
        <a href={to} onClick={handleClick} {...props}>
            {children}
        </a>
    )
}
