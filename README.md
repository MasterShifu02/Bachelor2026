# Bachelor2026

{/*  */}

# PAKKER VI BRKER NÅ: 

`react`
Brukes til å bygge brukergrensesnittet i appen med komponenter.

`react-dom`
Brukes til å rendre React-appen i nettleseren.

`typescript`
Brukes for å gjøre koden tryggere, mer oversiktlig og lettere å vedlikeholde.

`vite`
Brukes som utviklingsserver og byggeverktøy for frontend.

`@vitejs/plugin-react`
Gjør at React fungerer riktig sammen med Vite.

`@supabase/supabase-js`
Brukes for å koble frontend til Supabase.  
Denne pakken blir senere brukt til auth, database, storage og andre Supabase-funksjoner.

`react-router-dom`
Brukes for routing i frontend.  
Den gjør at vi kan ha flere sider og URL-er i appen, og skille mellom offentlige sider og dashboard.

`@tanstack/react-query`
Brukes for å håndtere data fra serveren.  
Den gjør det enklere å jobbe med lasting, caching og oppdatering av data.

`vite-tsconfig-paths`
Brukes for at Vite skal forstå alias fra TypeScript-konfigurasjonen vår, som `@/`.


# Pakker vi planlegger å bruke videre:

`react-hook-form`
Skal brukes for å håndtere skjemaer i React på en ryddig måte.

`zod`
Skal brukes for validering av data og regler for hva som er gyldig input.

`@hookform/resolvers`
Skal brukes for å koble `react-hook-form` og `zod` sammen.

`prettier`
Skal brukes for å holde kodeformatet likt og ryddig for hele gruppen.



# MAPPE STRUKTUR  :  (foreløpig plan)

`src/app/`
Her ligger det som gjelder hele frontend-appen.  
Dette er stedet for felles oppsett, som routing, globale providers og layouts.

`src/app/router.tsx`
Her samles alle rutene i appen på ett sted.  
Denne filen bestemmer hvilke sider som skal vises på hvilke URL-er.

Vi bruker den til å skille mellom:
- offentlige sider (for kunde og login)
- dashboard-sider (for butikk og leverandør)


`src/app/providers/`
Her ligger globale providers som brukes i hele appen.  
Dette gjør at felles logikk ikke blir spredd rundt i prosjektet.

`src/app/providers/AppProviders.tsx`
Denne filen samler globale wrappers for appen.  
Akkurat nå brukes den til React Query, men senere kan vi også legge inn auth, tema og annen global logikk her.

`src/app/layouts/`
Her ligger layouts, altså felles rammer for sider.  
En layout er det som omgir innholdet, for eksempel toppseksjon, meny og området der selve siden vises.

`src/app/layouts/PublicLayout.tsx`
Dette er layouten for offentlige sider.  
Den brukes for sider som ikke krever vanlig innlogging, som login og kundeskjema via lenke.

`src/app/layouts/DashboardLayout.tsx`
Dette er layouten for dashboardet.  
Den brukes for interne brukere, altså butikk og leverandør.


`src/routes/`
Her ligger selve sidene i appen, delt opp etter område.

`src/routes/auth/`
Her ligger sider for innlogging.

`src/routes/auth/LoginPage.tsx`
Dette er innloggingssiden (`/login`).  
Den er foreløpig en enkel placeholder.

`src/routes/dashboard/`
Her ligger sidene for det innloggede området.  
Dette er området butikk og leverandør bruker.

`src/routes/dashboard/DashboardPage.tsx`
Dette er hovedsiden i dashboardet (`/dashboard`).

`src/routes/dashboard/CasesPage.tsx`
Dette er oversiktssiden for saker (`/dashboard/cases`).

`src/routes/dashboard/CaseDetailsPage.tsx`
Dette er siden for én spesifikk sak (`/dashboard/cases/:caseId`).

`src/routes/dashboard/StatsPage.tsx`
Dette er statistikk-siden (`/dashboard/stats`).  
Denne er laget for leverandør, siden leverandør skal ha tilgang til mer data enn butikk.

`src/routes/form/`
Her ligger offentlige skjema-sider.

`src/routes/form/CustomerFormPage.tsx`
Dette er kundeskjemaet som åpnes via en unik lenke (`/s/:token`).  
Kunden bruker denne siden uten å logge inn.


`src/features/`
Her organiserer vi kode etter funksjon, ikke etter side.  
Dette gjør prosjektet lettere å holde ryddig når det blir større.

`src/features/cases/`
Her skal alt som handler om servicesaker samles.

`src/features/cases/index.ts`
Foreløpig er dette bare en placeholder, men senere kan denne mappen inneholde logikk, typer, hooks og komponenter for saker.

`src/features/customer-form/`
Her skal alt som handler om kundeskjema samles.

`src/features/customer-form/schemas.ts`
Her skal validering og struktur for kundeskjema ligge.  
Foreløpig er dette bare en enkel placeholder.


`src/lib/`
Her ligger tekniske hjelpefiler og klienter som ikke hører til en bestemt feature.

`src/lib/supabase/`
Her samler vi alt som har med Supabase-klienten å gjøre.

`src/lib/supabase/client.ts`
Dette er hovedfilen for Supabase-klienten i frontend.  
Den bruker miljøvariabler for å koble appen til Supabase på en trygg måte.

`src/supabaseClient.ts`
Denne filen videresender til den nye Supabase-klienten i `src/lib/supabase/client.ts`.  
Den finnes for å gjøre overgangen ryddigere dersom noe fortsatt bruker gammel sti.


`src/App.tsx`
Dette er hovedinngangen til frontend-appen.  
Her pakkes appen inn i globale providers, og routeren kobles til slik at riktige sider vises basert på URL.

`src/main.tsx`
Dette er startpunktet for React-appen.  
Her rendres `App` inn i nettleseren.


`supabase/` (i repo-root)
Denne mappen er for backend-struktur knyttet til Supabase.  
Vi bruker ikke lokal Supabase nå, men mappen gjør prosjektet klart for videre utvikling.

`supabase/README.md`
Denne filen forklarer hvordan Supabase-strukturen er tenkt brukt, og minner om at sensitive operasjoner skal ligge på serversiden.

`supabase/functions/`
Her skal Supabase Edge Functions ligge senere.  
Dette brukes til sensitive operasjoner som:
- token-validering
- e-postsending
- annen server-side logikk

`supabase/migrations/`
Her skal SQL-migrasjoner ligge senere.  
Dette brukes for å holde styr på endringer i databasen, som tabeller, RLS-regler og indekser.


JUSTIFICATION:
Denne strukturen gjør prosjektet enklere å forstå og lettere å bygge videre på.

Den hjelper oss å:
- skille mellom offentlig og innlogget område
- holde butikk og leverandør i samme dashboard-struktur, men med ulik tilgang
- samle lik logikk på ett sted
- gjøre koden lettere å vedlikeholde når systemet blir større.



# SUPABASE:
Frontend bruker public key.
Sensitive ting skal ligge i Edge Functions.
Service role key skal aldri inn i frontend.