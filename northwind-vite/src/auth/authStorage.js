const TOKEN_KEY = "northwind_token"
const EXPIRES_KEY = "northwind_token_expires"

export const saveAuthToken = (token, expiresAt) => {
  localStorage.setItem(TOKEN_KEY, token)

  if (expiresAt) {
    localStorage.setItem(EXPIRES_KEY, expiresAt)
  }
}

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const getTokenExpiry = () => {
  return localStorage.getItem(EXPIRES_KEY)
}

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EXPIRES_KEY)
}