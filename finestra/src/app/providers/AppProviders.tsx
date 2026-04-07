import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type {PropsWithChildren} from 'react';
import { Toaster } from "sonner";


const queryClient = new QueryClient();

export function AppProviders({ children }: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster richColors position="top-right" />
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


