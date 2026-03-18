import { StoreDashboard } from "../../Components/StoreDashboard/StoreDashboard";
import { SupplierDashboard } from "../../Components/SupplierDashboard/SupplierDashboard";
export function DashboardPage() {
  const userRole = "store"; // Dette er hardkodet for nå
  return (
    <main>
      <SupplierDashboard />
    </main>
  );
}

{
  /* dette er dashboard-route */
}
