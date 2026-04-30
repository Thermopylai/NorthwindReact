import { getAuthHeaders } from "./apiClient"

const BASE_URL = "https://localhost:7065/api/categories"
// Vaihda portti tarvittaessa oman API:n mukaan

export const getCategories = async () => {
  const response = await fetch(BASE_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Kategorioiden haku epäonnistui")
  }

  return await response.json()
}

export const getCategoryById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Kategorian haku epäonnistui")
  }

  return await response.json()
}

export const createCategory = async (category) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders({ isFormData: true }),
    body: category
  })

  if (!response.ok) {
    throw new Error("Kategorian lisäys epäonnistui")
  }

  return await response.json()
}

export const updateCategory = async (id, category) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders({ isFormData: true }),
    body: category
  })

  if (!response.ok) {
    throw new Error("Kategorian päivitys epäonnistui")
  }

  return await response.json()
}

export const deleteCategory = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Kategorian poisto epäonnistui")
  }

  return true
}

export const restoreCategory = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/restore`, {
    method: "PUT",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Kategorian palautus epäonnistui")
  }

  return true
}

export const searchCategories = async (params) => {
  const searchParams = new URLSearchParams()

  if (params.isDeleted !== "") {
    searchParams.append("IsDeleted", params.isDeleted)
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
    throw new Error("Kategorioiden haku epäonnistui")
  }

  return await response.json()
}