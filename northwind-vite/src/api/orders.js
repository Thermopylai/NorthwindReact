import { getAuthHeaders } from "./apiClient"

const BASE_URL = "https://localhost:7065/api/orders"
// Vaihda portti tarvittaessa oman API:n mukaan

const normalizeDecimalString = (value) => {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/€/g, "")
    .replace(/,/g, ".")
}

export const getOrders = async () => {
  const response = await fetch(BASE_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tilausten haku epäonnistui")
  }

  return await response.json()
}

export const getOrderById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tilausten haku epäonnistui")
  }

  return await response.json()
}

export const createOrder = async (order) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(order)
  })

  if (!response.ok) {
    throw new Error("Tilausten lisäys epäonnistui")
  }

  return await response.json()
}

export const updateOrder = async (id, order) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(order)
  })

  if (!response.ok) {
    throw new Error("Tilausten päivitys epäonnistui")
  }

  return await response.json()
}

export const deleteOrder = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tilausten poisto epäonnistui")
  }

  return true
}

export const restoreOrder = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/restore`, {
    method: "PUT",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tilausten palautus epäonnistui")
  }

  return true
}

export const searchOrders = async (params) => {
  const searchParams = new URLSearchParams()

  if (params.employeeId !== "") {
    searchParams.append("EmployeeId", params.employeeId)
  }

  if (params.customerId !== "") {
    searchParams.append("CustomerId", params.customerId)
  }

  if (params.shipVia !== "") {
    searchParams.append("ShipVia", params.shipVia)
  }

  if (params.productId !== "") {
    searchParams.append("ProductId", params.productId)
  }

  if (params.isDeleted !== "") {
    searchParams.append("IsDeleted", params.isDeleted)
  }

  if (params.start !== "") {
    searchParams.append("Start", params.start)
  }

  if (params.end !== "") {
    searchParams.append("End", params.end)
  }

  const minFreight = normalizeDecimalString(params.minFreight)
  if (minFreight !== "") {
    searchParams.append("MinFreight", minFreight)
  }

  const maxFreight = normalizeDecimalString(params.maxFreight)
  if (maxFreight !== "") {
    searchParams.append("MaxFreight", maxFreight)
  }

  const minTotal = normalizeDecimalString(params.minTotal)
  if (minTotal !== "") {
    searchParams.append("MinTotal", minTotal)
  }

  const maxTotal = normalizeDecimalString(params.maxTotal)
  if (maxTotal !== "") {
    searchParams.append("MaxTotal", maxTotal)
  }

  if (params.shipCity.trim() !== "") {
    searchParams.append("ShipCity", params.shipCity.trim())
  }

  if (params.shipCountry.trim() !== "") {
    searchParams.append("ShipCountry", params.shipCountry.trim())
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
    throw new Error("Tilausten haku epäonnistui")
  }

  return await response.json()
}