import './footer.css'
import { ChevronUp, Settings } from 'lucide-react'

export function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer-div">
        <button
          type="button"
          className="footer-settings-btn"
        >
          <Settings size={24} />
        </button>

        <p className="footer-copy">@2026 Finestra AS - Alle Rettigheter Reservert</p>

        <p className="footer-delivered">Levert av bachelor gruppe 26</p>

        <button
          type="button"
          className="footer-up-btn"
          aria-label="Til toppen"
          onClick={handleScrollToTop}
        >
          <ChevronUp size={20} />
        </button>
      </div>
    </footer>
  )
}
