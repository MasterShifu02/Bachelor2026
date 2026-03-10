import { Outlet } from 'react-router-dom'
import { Header } from '@/components/header/header'
import { Footer } from '@/components/footer/footer'

export function PublicLayout() {
  return (
    <section>
      <Header />
      <Outlet />
      <Footer />
    </section>
  )
}
