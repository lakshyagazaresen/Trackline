import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useMsal } from '@azure/msal-react'

import {
  ChevronDown,
  LogOut,
  UserRound,
} from 'lucide-react'

type UserMenuProps = {
  compact?: boolean
}

function UserMenu({
  compact = false,
}: UserMenuProps) {
  const {
    instance,
    accounts,
  } = useMsal()

  const account = accounts[0]

  if (!account) {
    return null
  }

  const displayName =
    account.name ||
    account.username ||
    'Account'

  const email =
    account.username || ''

  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase(),
      )
      .join('') || 'U'

  async function handleSignOut() {
    await instance.logoutRedirect({
      account,
    })
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={`
            flex items-center
            rounded-2xl
            outline-none
            transition
            hover:bg-slate-800
            active:scale-[0.98]

            ${
              compact
                ? `
                  justify-center
                  p-1
                `
                : `
                  w-full
                  gap-3
                  px-2 py-2
                  text-left
                `
            }
          `}
        >
          <div
            className="
              flex size-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-slate-800
              text-xs
              font-bold
              text-sky-300
            "
          >
            {initials}
          </div>

          {!compact && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-200">
                  {displayName}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {email}
                </p>
              </div>

              <ChevronDown
                size={15}
                className="shrink-0 text-slate-600"
              />
            </>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="
            z-50
            w-64
            rounded-2xl
            border border-slate-700
            bg-slate-900
            p-2
            shadow-2xl
            shadow-black/30
          "
        >
          <div className="px-3 py-3">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-slate-800 text-sm font-bold text-sky-300">
              {initials}
            </div>

            <p className="truncate text-sm font-medium text-slate-100">
              {displayName}
            </p>

            <p className="mt-0.5 truncate text-xs text-slate-500">
              {email}
            </p>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-slate-800" />

          <DropdownMenu.Item
            className="
              flex cursor-default
              items-center gap-3
              rounded-xl
              px-3 py-2.5
              text-sm
              text-slate-400
              outline-none
              data-[highlighted]:bg-slate-800
              data-[highlighted]:text-slate-200
            "
          >
            <UserRound size={16} />
            Account
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={() => {
              void handleSignOut()
            }}
            className="
              flex cursor-pointer
              items-center gap-3
              rounded-xl
              px-3 py-2.5
              text-sm
              text-red-300
              outline-none
              data-[highlighted]:bg-red-950/40
            "
          >
            <LogOut size={16} />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default UserMenu