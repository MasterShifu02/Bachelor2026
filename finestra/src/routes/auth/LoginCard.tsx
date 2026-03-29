import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "../../Components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../Components/ui/card"

import { login } from "@/services/authService"

export function LoginCard() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("test@butikk.no")
  const [password, setPassword] = useState("Test@123")

  async function handleLogin() {
    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message)
      } else {
        alert("Login feilet")
      }
    }
  }

  return (
    <Card className="login-card">
      <CardHeader className="login-header">
        <div className="login-copy">
          <CardTitle>Logg inn</CardTitle>
          <CardDescription>
            Skriv inn brukernavn og passord for å logge inn.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="login-content">
        <div className="login-field">
          <label>Brukernavn</label>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login-field">
          <label>Passord</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>

      <CardFooter className="login-footer">
        <Button className="login-button" size="lg" onClick={handleLogin}>
          Logg inn
        </Button>
      </CardFooter>
    </Card>
  )
}