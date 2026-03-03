import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import { Outlet } from "react-router-dom";
export function DashboardLayout() {
  return (
    <section>
      <Header />
      <Outlet />
      <Footer />
    </section>
  );
}

{
  /* felles layout for innlogede sider (ikke skjema),
    outlet blir steder der ektra sidene i dashboardet blir vist (layout.wrapper
    /dashboard
    /dashboard/cases
    /dashboard/cases/:caseId
    /dashboard/stats
*/
}
