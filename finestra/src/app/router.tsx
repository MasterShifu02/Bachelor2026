import { Navigate, createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from './layouts/DashboardLayout'
import { PublicLayout } from './layouts/PublicLayout'
import { LoginPage } from '../routes/auth/LoginPage'
import { DashboardPage } from '../routes/dashboard/DashboardPage'
import { CasesPage } from '../routes/dashboard/CasesPage'
import { CaseDetailsPage } from '../routes/dashboard/CaseDetailsPage'
import { StatsPage } from '../routes/dashboard/StatsPage'
import { CustomerFormPage } from '../routes/form/CustomerFormPage'

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
    handle: {
      description: 'Redirect to login',
    },
  },
  {
    element: <PublicLayout />,
    handle: {
      description: 'Public layout for login and customer form',
    },
    children: [
      {
        path: '/login',
        element: <LoginPage />,
        handle: {
          description: 'Login page',
        },
      },
      {
        path: '/s/:token',
        element: <CustomerFormPage />,
        handle: {
          description: 'Customer form page opened from token link',
        },
      },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    handle: {
      description: 'Dashboard layout for store users(butikk) and supplier users(leverandør)',
    },
    children: [
      {
        index: true,
        element: <DashboardPage />,
        handle: {
          description: 'Dashboard home',
        },
      },
      {
        path: 'cases',
        element: <CasesPage />,
        handle: {
          description: 'Cases list',
        },
      },
      {
        path: 'cases/:caseId',
        element: <CaseDetailsPage />,
        handle: {
          description: 'Case details',
        },
      },
      {
        path: 'stats',
        element: <StatsPage />,
        handle: {
          description: 'Supplier statistics page',
        },
      },
    ],
  },
])

{/*  
Sentral route-konfigurasjon for finestra.
Public-ruter brukes av kunde og innlogging.
Dashboard-ruter er kun for interne brukere (butikk og leverandør),
og inkluderer en statistikk-side for leverandør som skal tilgangsstyres senere.
*/}