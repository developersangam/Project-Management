import { AuthGuard } from '../../components/auth/AuthGuard'
import { DashboardLayout } from '../../components/layout/dashboardLayout'

export default function DashboardLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </AuthGuard>
  )
}