import { getAuthHeaders } from "./apiClient"

const BASE_URL = "https://localhost:7065/api/customers"
// Vaihda portti tarvittaessa oman API:n mukaan

export const getCustomers = async () => {
  const response = await fetch(BASE_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Asiakkaiden haku epäonnistui")
  }

  return await response.json()
}

export const getCustomerById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Asiakkaan haku epäonnistui")
  }

  return await response.json()
}

export const createCustomer = async (customer) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(customer)
  })

  if (!response.ok) {
    throw new Error("Asiakkaan lisäys epäonnistui")
  }

  return await response.json()
}

export const updateCustomer = async (id, customer) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(customer)
  })

  if (!response.ok) {
    throw new Error("Asiakkaan päivitys epäonnistui")
  }

  return await response.json()
}

export const deleteCustomer = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Asiakkaan poisto epäonnistui")
  }

  return true
}

export const restoreCustomer = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/restore`, {
    method: "PUT",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Asiakkaan palautus epäonnistui")
  }

  return true
}

export const searchCustomers = async (params) => {
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
    throw new Error("Asiakkaiden haku epäonnistui")
  }

  return await response.json()
}