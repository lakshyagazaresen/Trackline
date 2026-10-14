import { NavLink } from 'react-router'
import AuthButton from '../../features/auth/AuthButton'

const navigationItems = [
  {
    label: 'Dashboard',
    path: '/',
  },
  {
    label: 'Tasks',
    path: '/tasks',
  },
  {
    label: 'Goals',
    path: '/goals',
  },
  {
    label: 'Fitness',
    path: '/fitness',
  },
  {
    label: 'Nutrition',
    path: '/nutrition',
  },
  {
    label: 'Finance',
    path: '/finance',
  },
  {
    label: 'Vault',
    path: '/vault',
  },
]

function Sidebar() {
  return (
    <aside className="flex w-64 flex-col border-r border-slate-800 bg-slate-950 p-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Trackline
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Personal dashboard
        </p>
      </div>

      <nav className="mt-10 flex-1">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  [
                    'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-slate-800 pt-5">
        <AuthButton />
      </div>
    </aside>
  )
}

export default Sidebar