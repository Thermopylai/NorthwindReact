import { getAuthHeaders } from "./apiClient"

const BASE_URL = "https://localhost:7065/api/employees"
// Vaihda portti tarvittaessa oman API:n mukaan

export const getEmployees = async () => {
  const response = await fetch(BASE_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Työntekijöiden haku epäonnistui")
  }

  return await response.json()
}

export const getEmployeeById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Työntekijän haku epäonnistui")
  }

  return await response.json()
}

export const createEmployee = async (employee) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders({ isFormData: true }),
    body: employee
  })

  if (!response.ok) {
    throw new Error("Työntekijän lisäys epäonnistui")
  }

  return await response.json()
}

export const updateEmployee = async (id, employee) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders({ isFormData: true }),
    body: employee
  })

  if (!response.ok) {
    throw new Error("Työntekijän päivitys epäonnistui")
  }

  return await response.json()
}

export const deleteEmployee = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Työntekijän poisto epäonnistui")
  }

  return true
}

export const restoreEmployee = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/restore`, {
    method: "PUT",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Työntekijän palautus epäonnistui")
  }

  return true
}

export const searchEmployees = async (params) => {
  const searchParams = new URLSearchParams()

  if (params.start !== "") {
    searchParams.append("Start", params.start)
  }

  if (params.end !== "") {
    searchParams.append("End", params.end)
  }

  if (params.isDeleted !== "") {
    searchParams.append("IsDeleted", params.isDeleted)
  }

  if (params.reportsTo !== "") {
    searchParams.append("ReportsTo", params.reportsTo)
  }

  if (params.territoryId !== "") {
    searchParams.append("TerritoryId", params.territoryId)
  }

  if (params.searchTerm.trim() !== "") {
    searchParams.append("SearchTerm", params.searchTerm.trim())
  }

  if (params.orderBy !== "") {
    searchParams.append("OrderBy", params.orderBy)
  }

  searchParams.append("Descending", params.descending)
  searchParams.append("Page", params.page)
  searchParams.append("PageSize", params.pageSize)

  const response = await fetch(
    `${BASE_URL}/search?${searchParams.toString()}`,
    { headers: getAuthHeaders() }
  )

  if (response.status === 404) {
    return {
      items: [],
      totalCount: 0,
      page: Number(params.page),
      pageSize: Number(params.pageSize),
      totalPages: 0
    }
  }

  if (response.status === 400) {
    const message = await response.text()
    throw new Error(message || "Virheellinen hakupyyntö")
  }

  if (!response.ok) {
    throw new Error("Työntekijöiden haku epäonnistui")
  }

  return await response.json()
}