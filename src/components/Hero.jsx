import DecodeText from './DecodeText'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__lightline" aria-hidden="true" />
      <div className="panel hero__panel">
        <p className="kicker">Desarrollo web · Front-end</p>
        <h1 className="hero__title" aria-label="Felipe López">
          <DecodeText
            text="Felipe López"
            duration={1300}
            className="chrome-text"
          />
        </h1>
        <p className="hero__subtitle">
          Desarrollador web freelance. Una selección de los sitios que construí.
        </p>
        <a href="#trabajos" className="hero__scroll">
          ↓ Deslizá para explorar
        </a>
      </div>
    </section>
  )
}
