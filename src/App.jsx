import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import BuildABox from './pages/BuildABox.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Cursor from './components/Cursor.jsx'
import Preloader from './components/Preloader.jsx'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      <Cursor />
      <Nav />
      <Routes>
        <Route path="/" element={<Home ready={loaded} />} />
        <Route path="/build-a-box" element={<BuildABox />} />
      </Routes>
      <Footer />
    </>
  )
}
