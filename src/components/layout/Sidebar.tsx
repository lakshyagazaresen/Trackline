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

import { NavLink } from 'react-router'

function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 p-6">
      <h1 className="text-2xl font-bold text-white">
        Trackline
      </h1>

      <nav className="mt-10">
        <ul className="space-y-2">
  {navigationItems.map((item) => (
    <li key={item.path}>
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `block rounded-lg px-3 py-2 ${
            isActive
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`
        }
      >
        {item.label}
      </NavLink>
    </li>
  ))}
</ul>
      </nav>
    </aside>
  )
}

export default Sidebar