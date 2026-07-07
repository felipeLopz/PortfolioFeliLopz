import { useReveal } from '../hooks/useReveal'
import DevCard from './DevCard'

export default function About() {
  const [ref, visible] = useReveal()

  return (
    <section
      ref={ref}
      id="sobre-mi"
      className={`about reveal${visible ? ' is-visible' : ''}`}
    >
      <div className="about__grid">
        <div className="panel about__panel">
          <p className="kicker">Sobre mí</p>
          <h2 className="about__title chrome-text">Felipe López Ozan</h2>
          <p className="about__text">
            Soy Felipe, desarrollador web freelance. Estoy dando mis primeros
            pasos en el mundo del desarrollo y construyo proyectos propios
            mientras sigo aprendiendo y perfeccionando mi trabajo. Me apasiona
            crear sitios que se vean bien y funcionen mejor. Si tenés una idea
            en mente, hagámosla realidad.
          </p>
        </div>
        <DevCard />
      </div>
    </section>
  )
}
