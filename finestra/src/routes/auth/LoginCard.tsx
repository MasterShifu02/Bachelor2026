import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function LoginCard() {
  return (
    <Card className="login-card">
      <CardHeader className="login-header">
        <div className="login-copy">
          <CardTitle>Logg inn</CardTitle>
          <CardDescription>
            Skriv inn brukernavn og passord for å logge inn på kontoen din.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="login-content">
        <div className="login-field">
          <label htmlFor="email">Brukernavn</label>
          <input
            className="login-input"
            id="email"
            type="email"
            placeholder="eksempel@eksempel.no"
          />
        </div>
        <div className="login-field">
          <label htmlFor="password">Passord</label>
          <input className="login-input" id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="login-footer">
        <Button asChild className="login-button" size="lg">
          <Link to="/dashboard">Logg inn</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
