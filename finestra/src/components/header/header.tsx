import "./header.css"
import { useEffect, useState } from "react"
import { getProfile, logout } from "../../services/authService"
import { useNavigate } from "react-router-dom"
import type { Tables } from "../../types/database.types"

type Profile = Tables<"profiles">

export function Header() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [open, setOpen] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const data = await getProfile()
      setProfile(data)
    }
    load()
  }, [])

  async function handleLogout() {
    await logout()
    navigate("/login")
  }

  return (
    <header className="header-total">
      <div className="header-div">

        {/* LOGO */}
        <img
          className="header-logo"
          src="/finestra_logo.jpg"
          alt="Finestra"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        />

        {/* NAV */}
        <nav className="header-nav">
          <span className="crumb" onClick={() => navigate("/dashboard")}>
            HJEM DASHBOARD
          </span>
        </nav>

        {/* PROFIL */}
        <div className="profile-wrapper">
          <button onClick={() => setOpen(!open)} className="profile-btn">
            👤 {profile?.name || "Bruker"} ⌄
          </button>

          {open && (
            <div className="dropdown">
              <button onClick={handleLogout}>Logg ut</button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}