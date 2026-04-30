import { getAuthHeaders } from "./apiClient"

const BASE_URL = "https://localhost:7065/api/shippers"
// Vaihda portti tarvittaessa oman API:n mukaan

export const getShippers = async () => {
  const response = await fetch(BASE_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Kuljettajien haku epäonnistui")
  }

  return await response.json()
}

export const getShipperById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Kuljetuksen haku epäonnistui")
  }

  return await response.json()
}

export const createShipper = async (shipper) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(shipper)
  })

  if (!response.ok) {
    throw new Error("Kuljetuksen lisäys epäonnistui")
  }

  return await response.json()
}

export const updateShipper = async (id, shipper) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(shipper)
  })

  if (!response.ok) {
    throw new Error("Kuljetuksen päivitys epäonnistui")
  }

  return await response.json()
}

export const deleteShipper = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Kuljetuksen poisto epäonnistui")
  }

  return true
}

export const restoreShipper = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/restore`, {
    method: "PUT",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Kuljetuksen palautus epäonnistui")
  }

  return true
}

export const searchShippers = async (params) => {
  const searchParams = new URLSearchParams()

  if (params.regionId !== "") {
    searchParams.append("RegionId", params.regionId)
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
    throw new Error("Kuljettajien haku epäonnistui")
  }

  return await response.json()
}