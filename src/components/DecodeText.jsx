import { useDecodeText } from '../hooks/useDecodeText'

// Renderiza `text` con efecto de decodificado SIN mover el layout: un "fantasma"
// con el texto final (visibility:hidden) fija el ancho/alto desde el frame 0, y
// encima, en position absolute, se muestra el texto que se va resolviendo. Así
// la caja nunca cambia de tamaño ni empuja el resto de la página.
export default function DecodeText({ text, duration, className = '' }) {
  const output = useDecodeText(text, duration ? { duration } : undefined)
  return (
    <span className="decode">
      {/* fantasma: reserva el espacio del texto final (invisible) */}
      <span className="decode__ghost">{text}</span>
      {/* capa animada superpuesta (misma caja, no afecta el flujo) */}
      <span className={`decode__live ${className}`} aria-hidden="true">
        {output}
      </span>
    </span>
  )
}
