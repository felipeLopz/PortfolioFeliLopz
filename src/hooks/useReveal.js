import { useEffect, useRef, useState } from 'react'

// Devuelve una ref y un booleano `visible` que pasa a true la primera vez
// que el elemento entra en el viewport. Respeta prefers-reduced-motion:
// si el usuario pidió menos movimiento, se marca visible de entrada.
export function useReveal(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px', ...options },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [options])

  return [ref, visible]
}
