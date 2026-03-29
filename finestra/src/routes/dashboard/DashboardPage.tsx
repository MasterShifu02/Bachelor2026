import { useEffect, useState } from "react"
import { StoreDashboard } from "../../Components/StoreDashboard/StoreDashboard"
import { SupplierDashboard } from "../../Components/SupplierDashboard/SupplierDashboard"
import { getProfile } from "@/services/authService"

export function DashboardPage() {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const profile = await getProfile()
      setRole(profile?.role ?? null)
    }

    load()
  }, [])

  if (!role) return <p>Laster...</p>

  return (
    <main>
      {role === "store" && <StoreDashboard />}
      {role === "supplier" && <SupplierDashboard />}
    </main>
  )
}