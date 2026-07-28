import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Route } from './components/Route'
import { useRouter } from './hooks/useRouter'
import { HomePage } from './pages/Home'
import { SearchPage } from './pages/Search'
import { NotFoundPage } from './pages/404'

const ROUTES = [
    { path: '/', component: HomePage },
    { path: '/search', component: SearchPage },
]

function App() {
    const { currentPath } = useRouter()
    const rutaConocida = ROUTES.some((route) => route.path === currentPath)

    return (
        <>
            <Header />

            {ROUTES.map(({ path, component }) => (
                <Route key={path} path={path} component={component} />
            ))}

            {!rutaConocida && <NotFoundPage />}

            <Footer />
        </>
    )
}

export default App
