import { getAuthToken } from "../auth/authStorage"

export const getAuthHeaders = ({ isFormData = false } = {}) => {
  const token = getAuthToken()

  return {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}