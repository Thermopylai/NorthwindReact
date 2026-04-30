import { getAuthHeaders } from "./apiClient"

const BASE_URL = "https://localhost:7065/api/suppliers"
// Vaihda portti tarvittaessa oman API:n mukaan

export const getSuppliers = async () => {
  const response = await fetch(BASE_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Toimittajien haku epäonnistui")
  }

  return await response.json()
}

export const getSupplierById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Toimittajan haku epäonnistui")
  }

  return await response.json()
}

export const createSupplier = async (supplier) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(supplier)
  })

  if (!response.ok) {
    throw new Error("Toimittajan lisäys epäonnistui")
  }

  return await response.json()
}

export const updateSupplier = async (id, supplier) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(supplier)
  })

  if (!response.ok) {
    throw new Error("Toimittajan päivitys epäonnistui")
  }

  return await response.json()
}

export const deleteSupplier = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Toimittajan poisto epäonnistui")
  }

  return true
}

export const restoreSupplier = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/restore`, {
    method: "PUT",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Toimittajan palautus epäonnistui")
  }

  return true
}

export const searchSuppliers = async (params) => {
  const searchParams = new URLSearchParams()

  if (params.country !== "") {
    searchParams.append("Country", params.country)
  }

  if (params.city !== "") {
    searchParams.append("City", params.city)
  }
  
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
    throw new Error("Toimittajien haku epäonnistui")
  }

  return await response.json()
}