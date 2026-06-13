import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Footer() {
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
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Sweets by Summeray 🍓</div>
            <p>
              Hand-dipped happiness, made to order. Chocolate covered strawberries,
              cake pops, crispy treats &amp; pretzels for every sweet occasion.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/build-a-box">Build a Box</Link></li>
              <li><a href="#treats" onClick={goSection('treats')}>The Treats</a></li>
              <li><a href="#how" onClick={goSection('how')}>How it Works</a></li>
            </ul>
          </div>
          <div>
            <h4>Say hi</h4>
            <ul className="footer-links">
              <li><a href="mailto:hello@sweetsbysummeray.com">hello@sweetsbysummeray.com</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-mega" aria-hidden="true">Sweets by Summeray</div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Sweets by Summeray. Made with love &amp; chocolate.</span>
          <span>Dipped fresh, always. 🍫</span>
        </div>
      </div>
    </footer>
  )
}
