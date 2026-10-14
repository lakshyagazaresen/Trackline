import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react'

import { loginRequest } from '../../auth/authConfig'

function AuthButton() {
  const { instance, accounts } = useMsal()

  const account = accounts[0]

  const claims = account?.idTokenClaims as
    | Record<string, unknown>
    | undefined

  function getClaim(name: string) {
    const value = claims?.[name]

    return typeof value === 'string'
      ? value
      : undefined
  }

  const displayName =
    account?.name ??
    getClaim('name')

  const email =
    account?.username ||
    getClaim('email') ||
    getClaim('preferred_username') ||
    getClaim('login_hint')

  async function handleSignIn() {
    await instance.loginRedirect(loginRequest)
  }

  async function handleSignOut() {
    await instance.logoutRedirect({
      account,
      postLogoutRedirectUri: '/',
    })
  }

  return (
    <div>
      <AuthenticatedTemplate>
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Signed in
            </p>

            {displayName && (
              <p className="mt-1 text-sm font-medium text-white">
                {displayName}
              </p>
            )}

            {email && (
              <p className="mt-1 break-all text-xs text-slate-400">
                {email}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full rounded-lg border border-slate-700 px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <button
          type="button"
          onClick={handleSignIn}
          className="w-full rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200"
        >
          Sign in
        </button>
      </UnauthenticatedTemplate>
    </div>
  )
}

export default AuthButton