import { Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <section>
      <header>Placeholder for PublicLayout</header>
      <Outlet />
    </section>
  )
}

{/* felles layout for offentlige sider = skjema (ikke dashbord),
    rendres i Outlet
    /login
    /token
*/}

