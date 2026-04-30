import { getAuthHeaders } from "./apiClient"

const BASE_URL = "https://localhost:7065/api/order_details"
// Vaihda portti tarvittaessa oman API:n mukaan

const normalizeDecimalString = (value) => {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/€/g, "")
    .replace(/,/g, ".")
}

export const getOrderDetails = async () => {
  const response = await fetch(BASE_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tilausten yksityiskohtien haku epäonnistui")
  }

  return await response.json()
}

export const getOrderDetailsByOrderId = async (orderId) => {
  const response = await fetch(`${BASE_URL}/by-order/${orderId}`, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tilausten yksityiskohtien haku epäonnistui")
  }

  return await response.json()
}

export const getOrderDetailsByProductId = async (productId) => {
  const response = await fetch(`${BASE_URL}/by-product/${productId}`, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tilausten yksityiskohtien haku epäonnistui")
  }

  return await response.json()
}

export const getOrderDetailById = async (orderId, productId) => {
  const response = await fetch(`${BASE_URL}/${orderId}/${productId}`, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tilausten yksityiskohtien haku epäonnistui")
  }

  return await response.json()
}

export const createOrderDetail = async (orderDetail) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderDetail)
  })

  if (!response.ok) {
    throw new Error("Tilausten yksityiskohtien lisäys epäonnistui")
  }

  return await response.json()
}

export const updateOrderDetail = async (orderId, productId, orderDetail) => {
  const response = await fetch(`${BASE_URL}/${orderId}/${productId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderDetail)
  })

  if (!response.ok) {
    throw new Error("Tilausten yksityiskohtien päivitys epäonnistui")
  }

  return await response.json()
}

export const deleteOrderDetail = async (orderId, productId) => {
  const response = await fetch(`${BASE_URL}/${orderId}/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tilausten yksityiskohtien poisto epäonnistui")
  }

  return true
}

export const restoreOrderDetail = async (orderId, productId) => {
  const response = await fetch(`${BASE_URL}/${orderId}/${productId}/restore`, {
    method: "PUT",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tilausten yksityiskohtien palautus epäonnistui")
  }

  return true
}

export const searchOrderDetails = async (params) => {
  const searchParams = new URLSearchParams()

  if (params.orderId !== "") {
    searchParams.append("OrderId", params.orderId)
  }

  if (params.productId !== "") {
    searchParams.append("ProductId", params.productId)
  }

  if (params.isDeleted !== "") {
    searchParams.append("IsDeleted", params.isDeleted)
  }

  if (params.categoryId !== "") {
    searchParams.append("CategoryId", params.categoryId)
  }

  if (params.supplierId !== "") {
    searchParams.append("SupplierId", params.supplierId)
  }

  if (params.employeeId !== "") {
    searchParams.append("EmployeeId", params.employeeId)
  }

  if (params.shipVia !== "") {
    searchParams.append("ShipVia", params.shipVia)
  }

  const minTotalPrice = normalizeDecimalString(params.minTotalPrice)
  if (minTotalPrice !== "") {
    searchParams.append("MinTotalPrice", minTotalPrice)
  }

  const maxTotalPrice = normalizeDecimalString(params.maxTotalPrice)
  if (maxTotalPrice !== "") {
    searchParams.append("MaxTotalPrice", maxTotalPrice)
  }

  if (params.vatRate !== "") {
    searchParams.append("VatRate", params.vatRate)
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
    throw new Error("Tilausten yksityiskohtien haku epäonnistui")
  }

  return await response.json()
}