import { useCallback } from 'react'
import { useMsal } from '@azure/msal-react'

import { apiRequest } from '../auth/authConfig'

export function useApiClient() {
  const { instance, accounts } = useMsal()

  const account = accounts[0]

  const apiFetch = useCallback(
    async (
      url: string,
      options: RequestInit = {},
    ): Promise<Response> => {
      if (!account) {
        throw new Error(
          'No signed-in account.',
        )
      }

      const tokenResponse =
        await instance.acquireTokenSilent({
          ...apiRequest,
          account,
          redirectUri:
            `${window.location.origin}/redirect.html`,
        })

      const headers =
        new Headers(options.headers)

      headers.set(
        'Authorization',
        `Bearer ${tokenResponse.accessToken}`,
      )

      return fetch(url, {
        ...options,
        headers,
      })
    },
    [instance, account],
  )

  return apiFetch
}