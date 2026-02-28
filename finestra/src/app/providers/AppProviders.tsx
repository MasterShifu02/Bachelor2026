import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type {PropsWithChildren} from 'react';


const queryClient = new QueryClient();

export function AppProviders({ children }: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
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


