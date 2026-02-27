# Bachelor2026

{/*  */}

PAKKER: 
cd /Users/mastershifu/Desktop/bachelor/Bachelor2026/finestra
npm install react-router-dom react-hook-form zod @hookform/resolvers @tanstack/react-query
npm install -D vite-tsconfig-paths prettier



MAPPE STRUKTUR:
src/app/

App-nivå infrastruktur: ting som gjelder hele frontend-appen.
Her legger du router-oppsett, globale providers og layouts.

router.tsx

Én samlet definisjon av ruter.
Gjør navigasjon og route-guarding lett å forstå og vedlikeholde.

src/app/providers/

Globale wrappers (f.eks. React Query, Auth-context, tema, i18n).
Hindrer at provider-logikk blir spredt i mange filer.

src/app/layouts/

Skall for sider: toppbar, meny, innholdsområde med <Outlet />.
Dere har to tydelige soner: offentlig (kunde-link) og innlogget dashboard.

src/routes/auth/

Sider for autentisering (/login).
Holder auth-UI adskilt fra dashboard-funksjoner.

src/routes/dashboard/

Innlogget område for butikk/leverandør.
Matcher flyten i prosjektet: oversikt, saker, saksdetaljer.

src/routes/form/

Offentlig kundeskjema via token-lenke (/s/:token).
Kritisk å holde separat siden dette ikke krever normal innlogging.

src/features/

Domenelogikk per funksjon i stedet for per side.
Bedre skalering: komponenter, hooks, typer og schema samles per feature.

src/features/cases/

Alt om servicesaker (liste, detaljer, status-endringer, API-kall).

src/features/customer-form/

Alt om kundens skjema (validering, mapping, innsending).

src/lib/

Tekniske klienter/hjelpefunksjoner uten domeneansvar.

src/lib/supabase/

Supabase-klient og relaterte wrappers.
Én stabil inngang for database/auth/storage i frontend.

supabase/ (repo-root)

Backend-struktur uten lokal kjøring nå.
Gjør prosjektet klart for edge functions og SQL-migrasjoner senere.

supabase/functions/

Edge Functions for sensitive operasjoner (token-validering, e-post, server-side workflows).

supabase/migrations/

SQL-migrasjoner for tabeller, RLS-policyer, indekser osv.
Gir sporbar, versjonert databaseendring i team.