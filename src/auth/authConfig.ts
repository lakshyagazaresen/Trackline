import type {
  Configuration,
  RedirectRequest,
} from '@azure/msal-browser'

const tenantSubdomain =
  import.meta.env.VITE_ENTRA_TENANT_SUBDOMAIN

const spaClientId =
  import.meta.env.VITE_ENTRA_SPA_CLIENT_ID

const apiScope =
  import.meta.env.VITE_ENTRA_API_SCOPE

if (!tenantSubdomain || !spaClientId || !apiScope) {
  throw new Error(
    'Missing Microsoft Entra authentication configuration.'
  )
}

const tenantAuthorityHost =
  `${tenantSubdomain}.ciamlogin.com`

const tenantId =
  '8a287136-6586-4e0d-b7e6-886dfe85190e'

export const msalConfig: Configuration = {
  auth: {
    clientId: spaClientId,

    authority:
      `https://${tenantAuthorityHost}/`,

    knownAuthorities: [
      tenantAuthorityHost,
      `${tenantId}.ciamlogin.com`,
    ],

    redirectUri: '/',
    postLogoutRedirectUri: '/',
  },

  cache: {
    cacheLocation: 'sessionStorage',
  },
}

export const loginRequest: RedirectRequest = {
  scopes: [
    apiScope,
  ],
}

export const apiRequest = {
  scopes: [
    apiScope,
  ],
}