import { useEffect, useRef } from 'react'

// Efecto "imán": el elemento se desplaza suavemente hacia el cursor cuando el
// mouse se acerca, y vuelve a su lugar al salir. Devuelve una ref para poner
// en el botón. La suavidad la da la transición CSS de `transform` del botón.
//
// Se desactiva con prefers-reduced-motion y en dispositivos sin puntero fino
// (touch), para no romper nada en mobile.
export function useMagnetic({ strength = 0.3, max = 10 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (!fine || reduce) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const dx = (e.clientX - (rect.left + rect.width / 2)) * strength
      const dy = (e.clientY - (rect.top + rect.height / 2)) * strength
      const x = Math.max(-max, Math.min(max, dx))
      const y = Math.max(-max, Math.min(max, dy))
      el.style.transform = `translate(${x}px, ${y}px)`
    }
    const onLeave = () => {
      // vacío -> vuelve al control del CSS (posición neutra)
      el.style.transform = ''
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      el.style.transform = ''
    }
  }, [strength, max])

  return ref
}
