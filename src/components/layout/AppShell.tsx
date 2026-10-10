import { Outlet } from 'react-router'
import Sidebar from './Sidebar'

function AppShell() {
  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <Sidebar />

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AppShell