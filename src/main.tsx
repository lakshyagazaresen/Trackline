import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  EventType,
  PublicClientApplication,
} from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { BrowserRouter } from 'react-router'

import './index.css'
import App from './App'
import { msalConfig } from './auth/authConfig'

const msalInstance =
  new PublicClientApplication(msalConfig)

if (
  !msalInstance.getActiveAccount() &&
  msalInstance.getAllAccounts().length > 0
) {
  msalInstance.setActiveAccount(
    msalInstance.getAllAccounts()[0]
  )
}

msalInstance.addEventCallback((event) => {
  if (
    event.eventType === EventType.LOGIN_SUCCESS &&
    event.payload &&
    'account' in event.payload &&
    event.payload.account
  ) {
    msalInstance.setActiveAccount(
      event.payload.account
    )
  }
})

createRoot(
  document.getElementById('root')!
).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MsalProvider>
  </StrictMode>,
)