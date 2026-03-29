import { Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <section>
      <Outlet />
    </section>
  )
}
