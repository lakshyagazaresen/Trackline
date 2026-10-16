import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import UserMenu from './UserMenu'
import {
  Dumbbell,
  Ellipsis,
  Goal,
  Home,
  ListTodo,
  LockKeyhole,
  Salad,
  WalletCards,
} from 'lucide-react'

import {
  NavLink,
  useLocation,
} from 'react-router'

type NavigationItem = {
  to: string
  label: string
  icon: typeof Home
}

const primaryItems: NavigationItem[] = [
  {
    to: '/',
    label: 'Home',
    icon: Home,
  },
  {
    to: '/tasks',
    label: 'Tasks',
    icon: ListTodo,
  },
  {
    to: '/goals',
    label: 'Goals',
    icon: Goal,
  },
  {
    to: '/fitness',
    label: 'Fitness',
    icon: Dumbbell,
  },
]

const moreItems: NavigationItem[] = [
  {
    to: '/nutrition',
    label: 'Nutrition',
    icon: Salad,
  },
  {
    to: '/finance',
    label: 'Finance',
    icon: WalletCards,
  },
  {
    to: '/vault',
    label: 'Vault',
    icon: LockKeyhole,
  },
]

const desktopItems = [
  ...primaryItems,
  ...moreItems,
]

function Sidebar() {
  const location = useLocation()

  const isMoreActive =
    moreItems.some((item) =>
      location.pathname.startsWith(
        item.to,
      ),
    )

  return (
    <>
      {/* Desktop floating dock */}
      <aside
        className="
          fixed bottom-4 left-4 top-4 z-40
          hidden w-56
          flex-col

          rounded-[28px]
          border border-slate-800
          bg-slate-900/90
          p-3

          shadow-2xl
          shadow-black/20
          backdrop-blur-xl

          lg:flex
        "
      >
        <div className="mb-6 flex items-center gap-3 px-2 pt-2">
          <div
            className="
              flex size-9
              items-center
              justify-center
              rounded-xl
              bg-sky-400
              font-black
              text-slate-950
            "
          >
            T
          </div>

          <div>
            <p className="font-semibold text-slate-100">
              Trackline
            </p>

            <p className="text-xs text-slate-500">
              Your space
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {desktopItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `
                  flex items-center
                  gap-3
                  rounded-2xl
                  px-3 py-2.5
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? `
                        bg-sky-400
                        text-slate-950
                        shadow-md
                      `
                      : `
                        text-slate-400
                        hover:translate-x-1
                        hover:bg-slate-800
                        hover:text-slate-100
                      `
                  }
                `}
              >
                <div
                  className="
                    flex size-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                  "
                >
                  <Icon size={19} />
                </div>

                <span>
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </nav>
        <div className="mt-auto border-t border-slate-800 pt-3">
          <UserMenu />
        </div>
      </aside>

      {/* Mobile floating dock */}
      <nav
        aria-label="Primary navigation"
        style={{
          bottom:
            'calc(env(safe-area-inset-bottom) + 12px)',
        }}
        className="
          fixed left-1/2 z-40
          w-[calc(100%-1.5rem)]
          max-w-md
          -translate-x-1/2

          rounded-[26px]
          border border-slate-800
          bg-slate-900/90
          p-1.5
          shadow-2xl
          shadow-black/30
          backdrop-blur-xl

          lgß:hidden
        "
      >
        <div className="grid grid-cols-5 gap-1">
          {primaryItems.map((item) => (
            <MobileNavItem
              key={item.to}
              item={item}
            />
          ))}

          <MoreMenu
            isActive={isMoreActive}
          />
        </div>
      </nav>
    </>
  )
}

type NavItemProps = {
  item: NavigationItem
}



function MobileNavItem({
  item,
}: NavItemProps) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) => `
        flex min-w-0
        flex-col
        items-center
        justify-center
        gap-1
        rounded-[20px]
        px-1
        py-2
        text-[10px]
        font-medium
        transition-all
        duration-200
        active:scale-95

        ${
          isActive
            ? `
              bg-sky-400
              text-slate-950
              shadow-md
            `
            : `
              text-slate-500
              hover:bg-slate-800
              hover:text-slate-200
            `
        }
      `}
    >
      <Icon size={20} />

      <span className="truncate">
        {item.label}
      </span>
    </NavLink>
  )
}

type MoreMenuProps = {
  isActive: boolean
  desktop?: boolean
}

function MoreMenu({
  isActive,
  desktop = false,
}: MoreMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="More"
          className={`
            flex
            items-center
            justify-center
            gap-1
            font-medium
            outline-none
            transition-all
            active:scale-95

            ${
              desktop
                ? `
                  h-14 w-16
                  flex-col
                  rounded-2xl
                  text-[10px]
                `
                : `
                  min-w-0
                  flex-col
                  rounded-[20px]
                  px-1 py-2
                  text-[10px]
                `
            }

            ${
              isActive
                ? `
                  bg-sky-400
                  text-slate-950
                `
                : `
                  text-slate-500
                  hover:bg-slate-800
                  hover:text-slate-200
                `
            }
          `}
        >
          <Ellipsis size={20} />
          <span>More</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side={
            desktop
              ? 'right'
              : 'top'
          }
          align="end"
          sideOffset={10}
          className="
            z-50
            min-w-48
            rounded-2xl
            border border-slate-700
            bg-slate-900
            p-1.5
            shadow-2xl
            shadow-black/30
          "
        >
          {moreItems.map((item) => {
            const Icon = item.icon

            return (
              <DropdownMenu.Item
                key={item.to}
                asChild
              >
                <NavLink
                  to={item.to}
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                    rounded-xl
                    px-3 py-2.5
                    text-sm
                    text-slate-300
                    outline-none
                    transition
                    hover:bg-slate-800
                    data-[highlighted]:bg-slate-800
                  "
                >
                  <div
                    className="
                      flex size-8
                      items-center
                      justify-center
                      rounded-xl
                      bg-slate-800
                      text-slate-400
                    "
                  >
                    <Icon size={16} />
                  </div>

                  {item.label}
                </NavLink>
              </DropdownMenu.Item>
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default Sidebar