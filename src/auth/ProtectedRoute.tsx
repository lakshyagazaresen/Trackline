import { InteractionStatus } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'
import { Navigate, Outlet } from 'react-router'

function ProtectedRoute() {
  const { accounts, inProgress } = useMsal()

  if (inProgress !== InteractionStatus.None) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">
          Checking authentication...
        </p>
      </div>
    )
  }

  if (accounts.length === 0) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute