import { Outlet } from 'react-router-dom'
import { Header } from '@/components/header/header'
import { Footer } from '@/components/footer/footer'

export function DashboardLayout() {
  return (
    <section>
      <Header />
      <Outlet />
      <Footer />
    </section>
  )
}
