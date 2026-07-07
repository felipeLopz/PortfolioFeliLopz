import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useMagnetic } from '../hooks/useMagnetic'

// Escala del sitio embebido dentro de la ventana (0.5 = se ve al 50%, "en chico").
// Cambiala para más/menos zoom del preview; el ancho/alto del iframe se compensa solo.
const IFRAME_SCALE = 0.5
// Tiempo de gracia antes de asumir que el iframe fue bloqueado (X-Frame-Options / CSP).
const IFRAME_FALLBACK_MS = 2500

// Deriva el dominio a mostrar en la barra de URL de la ventana simulada.
function domainOf(href) {
  try {
    return new URL(href).hostname
  } catch {
    // href placeholder ('#') u otros -> dominio genérico de ejemplo
    return 'preview.local'
  }
}

// Formatea el índice como "01 / 04".
function pad(n) {
  return String(n).padStart(2, '0')
}

// ---- Maquetas abstractas (solo divs/bloques del tema) ----------------------

function LandingMock() {
  return (
    <div className="mock mock--landing">
      <div className="mock__nav">
        <span className="mock__brand" />
        <span className="mock__navlinks">
          <i /> <i /> <i />
        </span>
      </div>
      <div className="mock__hero">
        <span className="mock__h1" />
        <span className="mock__h1 mock__h1--short" />
        <span className="mock__cta" />
      </div>
      <div className="mock__grid mock__grid--3">
        <span /> <span /> <span />
      </div>
    </div>
  )
}

function EcommerceMock() {
  return (
    <div className="mock mock--ecommerce">
      <div className="mock__nav">
        <span className="mock__brand" />
        <span className="mock__cart" />
      </div>
      <div className="mock__grid mock__grid--cards">
        <span className="card" />
        <span className="card" />
        <span className="card" />
        <span className="card" />
        <span className="card" />
        <span className="card" />
      </div>
    </div>
  )
}

function DashboardMock() {
  return (
    <div className="mock mock--dashboard">
      <div className="mock__sidebar">
        <i /> <i /> <i /> <i />
      </div>
      <div className="mock__main">
        <div className="mock__stats">
          <span /> <span /> <span />
        </div>
        <div className="mock__chart">
          <b style={{ height: '40%' }} />
          <b style={{ height: '70%' }} />
          <b style={{ height: '55%' }} />
          <b style={{ height: '90%' }} />
          <b style={{ height: '35%' }} />
          <b style={{ height: '65%' }} />
          <b style={{ height: '80%' }} />
        </div>
      </div>
    </div>
  )
}

function CorporateMock() {
  return (
    <div className="mock mock--corporate">
      <div className="mock__nav">
        <span className="mock__brand" />
        <span className="mock__navlinks">
          <i /> <i /> <i /> <i />
        </span>
      </div>
      <div className="mock__hero mock__hero--center">
        <span className="mock__h1" />
        <span className="mock__h1 mock__h1--short" />
        <span className="mock__cta" />
      </div>
      <div className="mock__grid mock__grid--2">
        <span /> <span />
      </div>
    </div>
  )
}

const MOCKS = {
  landing: LandingMock,
  ecommerce: EcommerceMock,
  dashboard: DashboardMock,
  corporate: CorporateMock,
}

// ---- Ventana de navegador simulada -----------------------------------------
//
//  Orden de prioridad para el contenido del recuadro:
//    1) project.embed === true -> <iframe> con el sitio REAL, escalado ("en chico").
//       Si el sitio no permite iframes (X-Frame-Options / CSP), se cae solo
//       al fallback: la imagen (si hay) o, en su defecto, la maqueta abstracta.
//    2) project.image (sin embed) -> <img> de captura cubriendo el área.
//    3) ni embed ni image -> maqueta abstracta de bloques (comportamiento previo).
//
//  El marco (barra + 3 puntitos + URL derivada del hostname) se mantiene igual.

function BrowserWindow({ href, name, mockup, embed, image }) {
  const Mock = MOCKS[mockup] || LandingMock
  const isReal = href && href !== '#'

  // Detección de iframe bloqueado: si a los IFRAME_FALLBACK_MS no cargó (o si
  // dispara onError), marcamos `failed` y usamos el fallback.
  const [failed, setFailed] = useState(false)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!embed) return
    loadedRef.current = false
    setFailed(false)
    const t = setTimeout(() => {
      if (!loadedRef.current) setFailed(true)
    }, IFRAME_FALLBACK_MS)
    return () => clearTimeout(t)
  }, [embed, href])

  // Escala inline configurable: al reducir con scale() agrandamos el iframe
  // (width/height inversos) para que se vea la página completa y nítida.
  const scaleStyle = {
    transform: `scale(${IFRAME_SCALE})`,
    width: `${100 / IFRAME_SCALE}%`,
    height: `${100 / IFRAME_SCALE}%`,
  }

  let content
  if (embed && isReal && !failed) {
    content = (
      <div className="embed-scale">
        <iframe
          className="embed-frame"
          src={href}
          title={name}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          style={scaleStyle}
          onLoad={() => {
            loadedRef.current = true
          }}
          onError={() => setFailed(true)}
        />
      </div>
    )
  } else if (image) {
    content = (
      <img
        className="preview-img"
        src={image}
        alt={`Vista previa de ${name}`}
        loading="lazy"
      />
    )
  } else {
    content = (
      <div className="viewport-pad">
        <Mock />
      </div>
    )
  }

  return (
    <div className="browser">
      <div className="browser__bar">
        <span className="browser__dots" aria-hidden="true">
          <i className="dot dot--red" />
          <i className="dot dot--yellow" />
          <i className="dot dot--green" />
        </span>
        <span className="browser__url mono">{domainOf(href)}</span>
      </div>
      <div className="browser__viewport">
        {content}
        {/* Overlay clickeable: evita que el iframe capture el mouse e invita a
            abrir el sitio en una pestaña nueva. Solo con href real. */}
        {isReal && (
          <a
            className="preview-overlay"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir ${name} en una pestaña nueva`}
          >
            <span className="preview-overlay__label mono">Abrir sitio ↗</span>
          </a>
        )}
      </div>
    </div>
  )
}

// ---- Haces de luz que recorren el borde del preview ------------------------
// Dos SVG superpuestos: cada uno traza el perímetro del preview con un <rect>
// (mismo tamaño y esquinas redondeadas). Un segmento corto y brillante recorre
// el contorno vía stroke-dasharray + stroke-dashoffset animado (no translateY).
// El SVG izquierdo es el espejo exacto del derecho (scaleX(-1)) -> un haz baja
// por la derecha y el otro por la izquierda, idénticos y sincronizados.
// pointer-events:none para no interferir con el overlay ni el iframe.
function BeamRects() {
  // pathLength=100 normaliza el perímetro -> el dash es un % del contorno,
  // consistente sin importar el tamaño del preview. non-scaling-stroke mantiene
  // el grosor fino aunque el SVG se estire con preserveAspectRatio="none".
  // El rect ocupa TODO el viewBox (0..100): como el SVG se extiende por fuera
  // del preview (inset negativo en CSS), el trazo queda rodeándolo desde afuera,
  // con el gap = a esa extensión. overflow:visible evita que se recorte el borde.
  const rectProps = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rx: 4,
    pathLength: 100,
    vectorEffect: 'non-scaling-stroke',
  }
  return (
    <>
      <rect className="beam-core" {...rectProps} />
      <rect className="beam-head" {...rectProps} />
    </>
  )
}

function LightBeams() {
  return (
    <>
      <svg
        className="beam-svg beam-svg--right"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <BeamRects />
      </svg>
      <svg
        className="beam-svg beam-svg--left"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <BeamRects />
      </svg>
    </>
  )
}

// ---- Sección de un trabajo --------------------------------------------------

function WorkItem({ project, index, total }) {
  const [ref, visible] = useReveal()
  const btnRef = useMagnetic()
  const isReal = project.href && project.href !== '#'
  // impares (índice 0, 2, ...) -> captura a la izquierda; pares -> invertido
  const reversed = index % 2 === 1

  return (
    <article
      ref={ref}
      className={`work${reversed ? ' work--reversed' : ''}${
        visible ? ' is-visible' : ''
      }`}
    >
      <div className="work__media">
        <LightBeams />
        <BrowserWindow
          href={project.href}
          name={project.name}
          mockup={project.mockup}
          embed={project.embed}
          image={project.image}
        />
      </div>

      <div className="work__data">
        <span className="work__index mono">
          {pad(index + 1)} / {pad(total)}
        </span>
        <h3 className="work__name">{project.name}</h3>
        <p className="work__type">{project.type}</p>
        <p className="work__desc">{project.desc}</p>

        <ul className="chips" aria-label="Tecnologías">
          {project.tech.map((t) => (
            <li key={t} className="chip mono">
              {t}
            </li>
          ))}
        </ul>

        <a
          ref={btnRef}
          className="btn btn--accent"
          href={project.href}
          target={isReal ? '_blank' : undefined}
          rel={isReal ? 'noopener noreferrer' : undefined}
        >
          Ver proyecto ↗
        </a>
      </div>
    </article>
  )
}

export default function Work({ projects }) {
  return (
    <section className="works" id="trabajos">
      {projects.map((project, i) => (
        <WorkItem
          key={project.name}
          project={project}
          index={i}
          total={projects.length}
        />
      ))}
    </section>
  )
}
