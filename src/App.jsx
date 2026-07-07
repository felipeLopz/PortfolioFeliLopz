import { useEffect } from 'react'
import GraffitiBackground from './components/GraffitiBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Work from './components/Work'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { projects } from './data/projects'

// Easter egg de consola: se imprime una sola vez (guard a nivel módulo, así no
// se duplica con el doble montaje de StrictMode en dev).
let eggPrinted = false
function printConsoleEasterEgg() {
  if (eggPrinted) return
  eggPrinted = true
  const steel = 'color:#8395a6'
  const accent = 'color:#3a8ad4;font-weight:700'
  const bright = 'color:#eaf2fa;font-weight:700'
  console.log(
    '%c┌───────────────────────────┐\n' +
      '%c│  %cFL%c · dev portfolio        %c│\n' +
      '%c└───────────────────────────┘',
    accent,
    accent,
    bright,
    accent,
    accent,
    accent,
  )
  console.log('%c¿Curioseando el código? Me gusta.', bright)
  console.log(
    '%c¿Buscás desarrollador? Escribime → %c@Feli_mza %c(instagram.com/Feli_mza)',
    steel,
    accent,
    steel,
  )
}

export default function App() {
  useEffect(() => {
    printConsoleEasterEgg()
  }, [])

  return (
    <>
      <GraffitiBackground />
      <Navbar />
      <main>
        <Hero />
        <Work projects={projects} />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
