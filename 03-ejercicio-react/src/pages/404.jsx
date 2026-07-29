import { Link } from '../components/Link'

export function NotFoundPage() {
    return (
        <main>
            <title>Página no encontrada | DevJobs</title>

            <section>
                <h1>404</h1>

                <p>La página que buscas no existe o ha cambiado de sitio.</p>

                <nav>
                    <Link to="/">Volver al inicio</Link>
                    <Link to="/search">Ver todos los empleos</Link>
                </nav>
            </section>
        </main>
    )
}
