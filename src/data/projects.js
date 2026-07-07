// =============================================================================
//  PROYECTOS — editá libremente este array
// -----------------------------------------------------------------------------
//  Cada objeto es una sección de trabajo. Campos:
//    name    -> nombre del proyecto (título grande)
//    type    -> subtítulo / categoría corta
//    desc    -> descripción breve (una o dos frases)
//    tech    -> array de tecnologías -> se renderizan como chips/píldoras
//    href    -> link real del proyecto ('#' como placeholder)
//    mockup  -> tipo de maqueta abstracta a dibujar en la "ventana":
//               'landing' | 'ecommerce' | 'dashboard' | 'corporate'
//    embed   -> (opcional, booleano) si es true, la "ventana" muestra el sitio
//               REAL embebido en un <iframe> escalado, en vez de la maqueta.
//    image   -> (opcional, ruta) captura usada como fallback.
//
//  Qué se muestra dentro de la ventana, por orden de prioridad:
//    1) embed: true          -> iframe con el sitio real (escalado, "en chico").
//    2) image (sin embed)    -> la captura.
//    3) nada de lo anterior  -> la maqueta abstracta de bloques (default).
//
//  IMPORTANTE: si el sitio embebido NO permite iframes (manda X-Frame-Options
//  o CSP frame-ancestors), el iframe se detecta como bloqueado y se usa
//  AUTOMÁTICAMENTE la imagen de fallback (o la maqueta si no hay imagen).
//
//  Para activar el embed en cualquier trabajo futuro: poné `embed: true` y,
//  opcionalmente, `image: '/captures/loquesea.png'` (poné el archivo en
//  public/captures/) como respaldo por si el sitio no se deja embeber.
//
//  El índice "01 / 0X" se calcula solo a partir de la posición y la cantidad
//  total de proyectos (projects.length): con 1 proyecto muestra "01 / 01", y
//  al sumar más se actualiza solo. No hay que tocar nada al agregar/quitar.
//
//  Para sumar un trabajo, copiá el objeto de abajo y editá sus campos.
// =============================================================================

export const projects = [
  {
    name: 'Página de Ventas',
    type: 'Tienda / página de ventas',
    desc: 'Landing de ventas con catálogo de productos y cierre de compra por WhatsApp. Diseño oscuro con acentos y foco en la conversión.',
    tech: ['Next.js', 'React', 'Vercel'],
    href: 'https://distribucionargentina.vercel.app/',
    embed: true, // muestra el sitio real embebido en la ventana
    image: '/captures/distribucion.png', // fallback si el iframe queda bloqueado
    mockup: 'landing', // se usa como último recurso si iframe e imagen fallan
  },
]
