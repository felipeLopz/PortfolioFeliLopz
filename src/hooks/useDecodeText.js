import { useEffect, useRef, useState } from 'react'

// Efecto "desencriptado": el texto arranca como caracteres aleatorios y se va
// resolviendo de izquierda a derecha hasta formar `text`. Los espacios se
// mantienen. Respeta prefers-reduced-motion (muestra el texto final directo).
//
// Devuelve el string a renderizar en cada frame. Duración total ≈ `duration` ms.
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%&/<>'

export function useDecodeText(text, { duration = 1200 } = {}) {
  const [output, setOutput] = useState(text)
  const rafRef = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduce) {
      setOutput(text)
      return
    }

    const start = performance.now()
    const rand = () => GLYPHS[(Math.random() * GLYPHS.length) | 0]

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration)
      // cuántos caracteres ya están resueltos (avanza izq -> der)
      const resolved = progress * text.length

      let out = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if (ch === ' ') {
          out += ' '
        } else if (i < resolved) {
          out += ch // ya resuelto -> letra correcta
        } else {
          out += rand() // aún no resuelto -> carácter random
        }
      }
      setOutput(out)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setOutput(text)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [text, duration])

  return output
}
