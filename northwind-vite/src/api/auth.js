import { getAuthHeaders } from "./apiClient" 
import { getRefreshToken } from "../auth/authStorage"

const AUTH_BASE_URL = "https://localhost:7065/api/auth"

export const registerRequest = async (payload) => {
  const response = await fetch(`${AUTH_BASE_URL}/register`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Rekisteröinti epäonnistui")
  }

  return data
}

export const loginRequest = async (payload) => {
  const response = await fetch(`${AUTH_BASE_URL}/login`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Kirjautuminen epäonnistui")
  }

  return data
}

export const refreshRequest = async () => {
  const refreshToken = getRefreshToken()

  const response = await fetch(`${AUTH_BASE_URL}/refresh`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ refreshToken })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Tokenin päivitys epäonnistui")
  }

  return data
}

export const logoutRequest = async () => {
  const refreshToken = getRefreshToken()

  const response = await fetch(`${AUTH_BASE_URL}/logout`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ refreshToken })
  })

  const data = await response.json().catch(() => null)

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || "Uloskirjautuminen epäonnistui")
  }

  return data
}

export const getAllUsersRequest = async (token) => {
  const response = await fetch(`${AUTH_BASE_URL}/users`, {
    method: "GET",
    headers: getAuthHeaders(token)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Käyttäjien haku epäonnistui")
  }

  return data
}

export const searchUsersRequest = async (params, token) => {
  const searchParams = new URLSearchParams()

  if (params.userId !== "") {
    searchParams.append("UserId", params.userId)
  }

  if (params.userName !== "") {
    searchParams.append("UserName", params.userName)
  }

  if (params.email !== "") {
    searchParams.append("Email", params.email)
  }

  if (params.role !== "") {
    searchParams.append("Role", params.role)
  }

  if (params.permission !== "") {
    searchParams.append("Permission", params.permission)
  }
  console.log("Hakuparametrit:", Object.fromEntries(searchParams.entries()))
  const response = await fetch(`${AUTH_BASE_URL}/users/search?${searchParams.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(token)
  })

  if (response.status === 404) {
    return []
  }

  if (response.status === 400) {
    const message = await response.text()
    throw new Error(message || "Virheellinen hakupyyntö")
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Käyttäjien haku epäonnistui")
  }

  return data
}

export const listRolePermissionsRequest = async (token) => {
  const response = await fetch(`${AUTH_BASE_URL}/users/list-role-permissions`, {
    method: "GET",
    headers: getAuthHeaders(token)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Roolien ja oikeuksien haku epäonnistui")
  }

  return data
}

export const resetPasswordRequest = async (payload, token) => {
  const response = await fetch(`${AUTH_BASE_URL}/users/reset-password`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Salasanan vaihto epäonnistui")
  }

  return data
}

export const assignRoleRequest = async (payload, token) => {
  const response = await fetch(`${AUTH_BASE_URL}/users/assign-role`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Roolin asettaminen epäonnistui")
  }

  return data
}

export const removeRoleRequest = async (payload, token) => {
  const response = await fetch(`${AUTH_BASE_URL}/users/remove-role`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Roolin poistaminen epäonnistui")
  }

  return data
}

export const deleteUserRequest = async (userId, token) => {
  const response = await fetch(`${AUTH_BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Käyttäjän poistaminen epäonnistui")
  }

  return data
}

export const getUserInfoRequest = async (token) => {
  const response = await fetch(`${AUTH_BASE_URL}/me`, {
    method: "GET",
    headers: getAuthHeaders(token)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Käyttäjän tietojen haku epäonnistui")
  }

  return data
}

export const updateUserRequest = async (payload, token) => {
  const response = await fetch(`${AUTH_BASE_URL}/me`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Käyttäjän tietojen päivitys epäonnistui")
  }

  return data
}

export const changePasswordRequest = async (payload, token) => {
  const response = await fetch(`${AUTH_BASE_URL}/me/change-password`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Salasanan vaihto epäonnistui")
  }

  return data
}
