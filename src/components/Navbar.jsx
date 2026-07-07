import { useMagnetic } from '../hooks/useMagnetic'

export default function Navbar() {
  const contactRef = useMagnetic({ strength: 0.25, max: 8 })
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a href="#top" className="brand" aria-label="Felipe López — inicio">
          <span className="brand__badge">
            <span className="brand__initials chrome-text">FL</span>
          </span>
        </a>

        <nav className="nav">
          <a href="#trabajos" className="nav__link">
            Trabajos
          </a>
          <span className="nav__dot" aria-hidden="true">
            ·
          </span>
          <a href="#sobre-mi" className="nav__link">
            Sobre mí
          </a>
          <a ref={contactRef} href="#contacto" className="nav__btn">
            Contacto
          </a>
        </nav>
      </div>
    </header>
  )
}
