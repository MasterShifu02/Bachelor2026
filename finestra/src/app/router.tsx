type Route = {
    path: string;
    description: string;
}

export const routes: Route[] = [
  { path: '/', description: 'redirect to /login' },
  { path: '/login', description: 'login page' },
  { path: '/dashboard', description: 'dashboard home' },
  { path: '/dashboard/cases', description: 'cases list' },
  { path: '/dashboard/cases/:caseId', description: 'case details' },
  { path: '/s/:token', description: 'customer form' },
]