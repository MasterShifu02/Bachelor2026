import { Outlet } from "react-router-dom";

export function DashboardLayout() {
    return (
        <section>
            <header>Placeholder for DashboardLayout</header>
            <Outlet />
        </section>
    );
}

{/* felles layout for innlogede sider (ikke skjema),
    outlet blir steder der ektra sidene i dashboardet blir vist (layout.wrapper
    /dashboard
    /dashboard/cases
    /dashboard/cases/:caseId
    /dashboard/stats
*/}