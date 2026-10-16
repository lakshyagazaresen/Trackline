import { Outlet } from 'react-router'

import UserMenu from './UserMenu'
import Sidebar from './Sidebar'

function AppShell() {
  return (
    <div
      className="
        min-h-dvh
        overflow-x-hidden
        bg-slate-950
        text-slate-100
      "
    >
      <Sidebar />

      <div className="min-w-0 lg:pl-64">
        <header
          className="
            sticky top-0 z-30

            border-b border-slate-800/70
            bg-slate-950/85
            backdrop-blur-xl

            lg:hidden
          "
        >
          <div
            className="
              flex h-16
              min-w-0
              items-center
              justify-between
              gap-4
              px-4

              sm:px-6
            "
          >
            <div className="flex min-w-0 items-center gap-2">
              <div
                className="
                  flex size-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-sky-400
                  text-sm
                  font-black
                  text-slate-950
                "
              >
                T
              </div>

              <span className="truncate font-semibold tracking-tight text-slate-100">
                Trackline
              </span>
            </div>

            <UserMenu compact />
          </div>
        </header>

        <main
          className="
            min-w-0
            overflow-x-hidden

            px-4
            pb-32
            pt-4

            sm:px-6

            md:px-8
            md:pb-10
            md:pt-6

            lg:px-10
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell