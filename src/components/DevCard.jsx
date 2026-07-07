import { useEffect, useRef } from 'react'

// Tarjeta tipo credencial de desarrollador con tilt 3D siguiendo el mouse y un
// brillo holográfico que se reposiciona según el cursor. Se desactiva (queda
// estática) con prefers-reduced-motion o en touch (sin puntero fino).
export default function DevCard() {
  const cardRef = useRef(null)
  const enabled = useRef(false)

  useEffect(() => {
    enabled.current =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const onMove = (e) => {
    if (!enabled.current) return
    const el = cardRef.current
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width // 0..1
    const py = (e.clientY - r.top) / r.height // 0..1
    const rotY = (px - 0.5) * 16 // ±8deg
    const rotX = (0.5 - py) * 16 // ±8deg
    el.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`)
  }

  const onLeave = () => {
    const el = cardRef.current
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
    el.style.setProperty('--gx', '50%')
    el.style.setProperty('--gy', '50%')
  }

  return (
    <div className="devcard-wrap">
      <div
        ref={cardRef}
        className="devcard"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div className="devcard__glare" aria-hidden="true" />
        <p className="devcard__role mono">Web Developer</p>
        <h3 className="devcard__name chrome-text">Felipe López</h3>
        <p className="devcard__id mono">FL · 2026 · Mendoza, AR</p>
        <ul className="devcard__chips" aria-label="Tecnologías">
          <li className="chip mono">React</li>
          <li className="chip mono">Next.js</li>
        </ul>
      </div>
    </div>
  )
}
