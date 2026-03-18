
import './App.css'
import { useEffect, useState } from "react"
import { getSession } from "./services/authService"
import { LoginPage } from "./routes/auth/LoginPage"
import { DashboardPage } from "./routes/dashboard/DashboardPage"
import LogoutButton from "./Components/Header/LogoutButton"
function App() {

  const [session, setSession] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)

  async function checkSession() {

    const session = await getSession()

    setSession(session)

    setLoading(false)

  }

    useEffect(() => { 
    (async () => {
      await checkSession()
    })()
    }, [])

  if (loading) return <div>Loading...</div>

  if (!session)
    return <LoginPage onLogin={checkSession} />

  return (

    <div>

      <LogoutButton onLogout={() => setSession(null)} />

      <DashboardPage />

    </div>

  )

}


export default App

{/*  
App.tsx er hovedinngangen til frontend-appen
Her pakkes hele appen inn i globale providers,
og RouterProvider sørger for at rutene i appRouter rendres riktig.

AppProviders legger globale wrappers rundt hele appen
RouterProvider leser rutene fra appRouter
Basert på URL-en rendrer React Router riktig layout og side

*/}