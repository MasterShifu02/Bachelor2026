import { Link } from 'react-router-dom'
import './header.css'


export function Header() {
  return (
    <header className="header-total">
      <div className="header-div">
        <Link to="/dashboard">
          <img
            className="header-logo"
            src="/finestra_logo.jpg"
            alt="Finestra"
          />
        </Link>

        <nav className="header-nav">
          <a className="crumb crumb-active" href="/login">LOGG INN</a>
          <a className="crumb" href="#">OPPRETT SAK</a>
          <a className="crumb" href="#">SE SAK</a>
          <a className="crumb" href="#">KONTAKT FINESTRA</a>
        </nav>
      </div>
    </header>
  )
}
