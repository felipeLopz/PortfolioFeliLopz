import { useEffect, useRef } from 'react'

// =============================================================================
//  Fondo decorativo: lluvia "Matrix" (canvas) + tags/símbolos de código (SVG).
//  Va fijo, detrás de todo (z-index negativo) y con pointer-events:none, así
//  no interfiere con clicks/hover/iframe/botones/haces. Ver .bg-fx en styles.css.
// =============================================================================

// ---- AJUSTABLE: intensidad de la lluvia Matrix ------------------------------
// (única fuente de verdad — estos valores no se pisan en ningún otro lado)
const FONT_SIZE = 14 // px
// FADE_ALPHA alto -> cada frame "borra" agresivamente lo anterior, dejando casi
// solo la cabeza cayendo (rastro corto, sin cola larga).
const FADE_ALPHA = 0.38 // estela: alpha del fondo pintado cada frame (más alto = estela más corta)
const HEAD_COLOR = 'rgba(234,242,250,0.22)' // cabeza (blanco azulado) — tenue
const TRAIL_COLOR = 'rgba(58,138,212,0.12)' // carácter detrás (acento acero) — tenue
const BG_RGB = '10,13,17' // #0a0d11 -> color del fade de fondo
// Dibujado FLUIDO (30fps) desacoplado de la velocidad de caída:
const FRAME_MS = 33 // ~30 fps: movimiento suave (sin tironeo)
const FALL_SPEED = 0.25 // filas que baja cada columna por frame (más alto = cae más rápido)
const CHARS = 'アイウエオカキクケコサシスセソ0123456789</>{}[]();=&#'

export default function GraffitiBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let width = 0
    let height = 0
    let columns = 0
    let drops = [] // posición de caída (fila DECIMAL, se acumula por frame)
    let lastRow = [] // última fila entera dibujada -> detecta cambio de fila
    let headChar = [] // carácter estable de la cabeza (no parpadea entre frames)
    let trailChar = [] // carácter estable del acento detrás de la cabeza

    const setup = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      columns = Math.floor(width / FONT_SIZE)
      // cada columna arranca en una fila negativa aleatoria (no sincronizadas)
      drops = new Array(columns).fill(0).map(() => Math.random() * -50)
      lastRow = new Array(columns).fill(Number.NaN)
      headChar = new Array(columns).fill('')
      trailChar = new Array(columns).fill('')
    }
    setup()

    const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)]

    // prefers-reduced-motion: render estático tenue, sin animación
    if (reduce) {
      const renderStatic = () => {
        ctx.clearRect(0, 0, width, height)
        ctx.font = `${FONT_SIZE}px "Spline Sans Mono", monospace`
        ctx.fillStyle = TRAIL_COLOR
        for (let i = 0; i < columns; i++) {
          if (Math.random() > 0.35) continue
          ctx.fillText(randChar(), i * FONT_SIZE, Math.random() * height)
        }
      }
      renderStatic()
      const onResizeStatic = () => {
        setup()
        renderStatic()
      }
      window.addEventListener('resize', onResizeStatic)
      return () => window.removeEventListener('resize', onResizeStatic)
    }

    const draw = () => {
      // estela: rect de fondo semitransparente encima de todo -> desvanece
      ctx.fillStyle = `rgba(${BG_RGB},${FADE_ALPHA})`
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${FONT_SIZE}px "Spline Sans Mono", monospace`

      for (let i = 0; i < columns; i++) {
        let row = Math.floor(drops[i])

        // solo al cruzar a una fila nueva: renovamos los caracteres (así la
        // cabeza no parpadea entre frames) y evaluamos el reinicio.
        if (row !== lastRow[i]) {
          // al pasar el fondo, reinicia al azar (columnas desfasadas)
          if (row * FONT_SIZE > height && Math.random() > 0.975) {
            drops[i] = 0
            row = 0
          }
          trailChar[i] = headChar[i] || randChar() // la cabeza anterior pasa a estela
          headChar[i] = randChar()
          lastRow[i] = row
        }

        const x = i * FONT_SIZE
        const y = row * FONT_SIZE
        // acento justo detrás de la cabeza
        ctx.fillStyle = TRAIL_COLOR
        ctx.fillText(trailChar[i], x, y - FONT_SIZE)
        // cabeza brillante
        ctx.fillStyle = HEAD_COLOR
        ctx.fillText(headChar[i], x, y)

        // avance FRACCIONAL -> caída lenta con fps altos (fluido)
        drops[i] += FALL_SPEED
      }
    }

    const id = setInterval(draw, FRAME_MS)
    const onResize = () => setup()
    window.addEventListener('resize', onResize)

    return () => {
      clearInterval(id)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Tags de graffiti (paths angulares neutros) que se dibujan/borran en loop.
  const tags = [
    { d: 'M0 90 L40 0 L70 70 L120 10 L150 80 L210 20', stroke: '#3a8ad4' },
    { d: 'M0 40 L180 40 M150 12 L184 40 L150 68', stroke: '#7a93ab' },
    {
      d: 'M0 0 C60 -20 80 60 30 70 C-10 78 -6 20 40 30 C90 40 70 110 20 100',
      stroke: '#3a8ad4',
    },
    { d: 'M0 60 L50 0 L60 80 L120 10 L130 90 L200 20', stroke: '#7a93ab' },
    { d: 'M0 0 L60 60 M60 0 L0 60 M-8 30 L68 30 M30 -8 L30 68', stroke: '#3a8ad4' },
  ]
  const tagPos = [
    'translate(90 130) rotate(-12)',
    'translate(150 650) rotate(8)',
    'translate(1200 300) rotate(14)',
    'translate(640 700) rotate(-5)',
    'translate(1180 720) rotate(-8)',
  ]

  // Símbolos de código que aparecen/desaparecen en loop.
  const symbols = [
    { t: '</>', x: 300, y: 250 },
    { t: '{ }', x: 1080, y: 200 },
    { t: '( )', x: 520, y: 520 },
    { t: '[ ]', x: 940, y: 640 },
    { t: '=>', x: 220, y: 780 },
    { t: '&&', x: 1240, y: 470 },
  ]

  return (
    <div className="bg-fx" aria-hidden="true">
      <canvas ref={canvasRef} className="bg-fx__matrix" />
      <svg
        className="bg-fx__svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {tags.map((tag, i) => (
          <g key={`tag-${i}`} transform={tagPos[i]}>
            <path
              className="bg-fx__tag"
              d={tag.d}
              stroke={tag.stroke}
              pathLength="1"
              style={{
                animationDelay: `${i * 2.2}s`,
                animationDuration: `${13 + i * 1.5}s`,
              }}
            />
          </g>
        ))}
        {symbols.map((s, i) => (
          <text
            key={`sym-${i}`}
            className="bg-fx__sym"
            x={s.x}
            y={s.y}
            style={{ animationDelay: `${i * 1.8}s` }}
          >
            {s.t}
          </text>
        ))}
      </svg>
    </div>
  )
}
