const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl) {
  throw new Error(
    'Missing VITE_API_BASE_URL configuration.',
  )
}

export const API_BASE_URL = apiBaseUrl