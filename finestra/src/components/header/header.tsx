import './header.css'


export function Header() {
  return (
    <header className="header-total">
      <div className="header-div">
        <a href="https://chatgpt.com/" target="_blank" rel="noreferrer">
          <img
            className="header-logo"
            src="/finestra_logo.jpg"
            alt="Finestra"
          />
        </a>

        <nav className="header-nav">
          <a className="crumb crumb-active" href="/login">FORSIDE</a>
          <a className="crumb" href="#">OPPRETT SAK</a>
          <a className="crumb" href="#">SE SAK</a>
          <a className="crumb" href="#">KONTAKT FINESTRA</a>
        </nav>
      </div>
    </header>
  )
}
