import type { PropsWithChildren } from 'react';

export function AppProviders({ children }: PropsWithChildren) {
    return <>{children}</>
}

{/*
AppProviders.tsx er en “wrapper” for globale providers i appen, 
slik at det ikke skapper rot.

Nå gjør den dette:
Tar imot children (alt innhold i appen).
Returnerer innholdet uendret.

Dette skal være våres faste sted for globale ting senere:
- QueryClientProvider (React Query)
- AuthProvider (innlogging/session)
- tema/lokalisering
*/}

