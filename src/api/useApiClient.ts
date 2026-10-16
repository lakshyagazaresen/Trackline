import { useCallback } from 'react'
import {
  InteractionRequiredAuthError,
} from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'

import { apiRequest } from '../auth/authConfig'

export function useApiClient() {
  const { instance, accounts } = useMsal()

  const account = accounts[0]

  const getAccessToken = useCallback(
    async (forceRefresh = false) => {
      if (!account) {
        throw new Error('No signed-in account.')
      }

      try {
        const tokenResponse =
          await instance.acquireTokenSilent({
            ...apiRequest,
            account,
            forceRefresh,
            redirectUri:
              `${window.location.origin}/redirect.html`,
          })

        return tokenResponse.accessToken
      } catch (error) {
        if (
          error instanceof
          InteractionRequiredAuthError
        ) {
          await instance.acquireTokenRedirect({
            ...apiRequest,
            account,

            // Interactive redirect returns through
            // the normal React application.
            redirectUri:
              window.location.origin,

            // Return to the page the user was on.
            redirectStartPage:
              window.location.href,
          })

          throw new Error(
            'Authentication interaction required.',
          )
        }

        throw error
      }
    },
    [instance, account],
  )

  const apiFetch = useCallback(
    async (
      url: string,
      options: RequestInit = {},
    ): Promise<Response> => {
      const sendRequest = async (
        accessToken: string,
      ) => {
        const headers =
          new Headers(options.headers)

        headers.set(
          'Authorization',
          `Bearer ${accessToken}`,
        )

        return fetch(url, {
          ...options,
          headers,
        })
      }

      // Normal attempt
      const accessToken =
        await getAccessToken()

      let response =
        await sendRequest(accessToken)

      // The API rejected the token.
      // Force MSAL to obtain a fresh one and retry once.
      if (response.status === 401) {
        const refreshedToken =
          await getAccessToken(true)

        response =
          await sendRequest(refreshedToken)
      }

      return response
    },
    [getAccessToken],
  )

  return apiFetch
}