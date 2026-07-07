export default function Footer() {
  return (
    <footer className="footer footer--minimal">
      <div className="footer__lightline" aria-hidden="true" />
      <a href="#top" className="footer__name chrome-text">
        Felipe López
      </a>
      <p className="footer__legal mono">
        © {new Date().getFullYear()} Felipe López Ozan
      </p>
    </footer>
  )
}
