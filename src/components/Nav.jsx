import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StrawberrySVG } from './TreatArt.jsx'

export default function Nav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const goSection = (id) => (e) => {
    e.preventDefault()
    if (pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo" aria-label="Sweets by Summeray — home">
        <StrawberrySVG dip="milk" drizzle="pink" width="30" height="30" />
        Sweets by Summeray
      </Link>
      <div className="nav-links">
        <a className="nav-link" href="#treats" onClick={goSection('treats')}>Treats</a>
        <a className="nav-link" href="#how" onClick={goSection('how')}>How it works</a>
        <a className="nav-link" href="#love" onClick={goSection('love')}>Sweet words</a>
        <Link to="/build-a-box" className="nav-cta">
          Build a Box <span aria-hidden="true">🎁</span>
        </Link>
      </div>
    </nav>
  )
}
