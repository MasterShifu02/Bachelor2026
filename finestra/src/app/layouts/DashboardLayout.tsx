import { Outlet } from 'react-router-dom'
import { Header } from '../../Components/Header/header'
import { Footer } from '../../Components/Footer/footer'

export function DashboardLayout() {
  return (
    <section>
      <Header />
      <Outlet />
      <Footer />
    </section>
  )
}
