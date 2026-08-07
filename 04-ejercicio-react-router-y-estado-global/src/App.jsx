import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'

import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { Loader } from './components/Loader.jsx'

const HomePage = lazy(() => import('./pages/Home.jsx'))
const SearchPage = lazy(() => import('./pages/Search.jsx'))
const DetailPage = lazy(() => import('./pages/Detail.jsx'))
const NotFoundPage = lazy(() => import('./pages/404.jsx'))

function App() {
    return (
        <>
            <Header />
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/job/:id" element={<DetailPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
            <Footer />
        </>
    )
}

export default App
