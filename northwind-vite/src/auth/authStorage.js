const ACCESS_TOKEN_KEY = "northwind_access_token"
const ACCESS_TOKEN_EXPIRES_KEY = "northwind_access_token_expires"
const REFRESH_TOKEN_KEY = "northwind_refresh_token"
const REFRESH_TOKEN_EXPIRES_KEY = "northwind_refresh_token_expires"

export const saveAuthTokens = (authResponse) => {
  if (authResponse.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, authResponse.accessToken)
  }

  if (authResponse.accessTokenExpiresAt) {
    localStorage.setItem(
      ACCESS_TOKEN_EXPIRES_KEY,
      authResponse.accessTokenExpiresAt
    )
  }

  if (authResponse.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken)
  }

  if (authResponse.refreshTokenExpiresAt) {
    localStorage.setItem(
      REFRESH_TOKEN_EXPIRES_KEY,
      authResponse.refreshTokenExpiresAt
    )
  }
}

export const getAuthToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const getAccessTokenExpiresAt = () => {
  return localStorage.getItem(ACCESS_TOKEN_EXPIRES_KEY)
}

export const getRefreshTokenExpiresAt = () => {
  return localStorage.getItem(REFRESH_TOKEN_EXPIRES_KEY)
}

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_EXPIRES_KEY)
}

export const isDateExpired = (dateString) => {
  if (!dateString) return true

  const expiresAt = new Date(dateString)
  const now = new Date()

  return expiresAt <= now
}

export const isDateExpiringSoon = (dateString, safetyMarginSeconds = 60) => {
  if (!dateString) return true

  const expiresAt = new Date(dateString).getTime()
  const now = Date.now()
  const safetyMarginMs = safetyMarginSeconds * 1000

  return expiresAt - safetyMarginMs <= now
}