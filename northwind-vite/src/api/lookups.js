import { getAuthHeaders } from "./apiClient"

const CATEGORY_URL = "https://localhost:7065/api/categories"
const CUSTOMER_URL = "https://localhost:7065/api/customers"
const ORDER_URL = "https://localhost:7065/api/orders"
const PRODUCT_URL = "https://localhost:7065/api/products"
const EMPLOYEE_URL = "https://localhost:7065/api/employees"
const SHIPPER_URL = "https://localhost:7065/api/shippers"
const ORDER_DETAIL_URL = "https://localhost:7065/api/order_details"
const SUPPLIER_URL = "https://localhost:7065/api/suppliers"
const REGION_URL = "https://localhost:7065/api/regions"
const TERRITORY_URL = "https://localhost:7065/api/territories"
// Vaihda portti tarvittaessa oman API:n mukaan

export const getCategories = async () => {
  const response = await fetch(CATEGORY_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Kategorioiden haku epäonnistui")
  }

  return await response.json()
}

export const getSuppliers = async () => {
  const response = await fetch(SUPPLIER_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Toimittajien haku epäonnistui")
  }

  return await response.json()
}

export const getRegions = async () => {
  const response = await fetch(REGION_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Alueiden haku epäonnistui")
  }

  return await response.json()
}

export const getTerritories = async () => {
  const response = await fetch(TERRITORY_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Alueiden haku epäonnistui")
  }

  return await response.json()
}

export const getProducts = async () => {
  const response = await fetch(PRODUCT_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tuotteiden haku epäonnistui")
  }

  return await response.json()
}

export const getEmployees = async () => {
  const response = await fetch(EMPLOYEE_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Työntekijöiden haku epäonnistui")
  }

  return await response.json()
}

export const getShippers = async () => {
  const response = await fetch(SHIPPER_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Kuljettajien haku epäonnistui")
  }

  return await response.json()
}

export const getCustomers = async () => {
  const response = await fetch(CUSTOMER_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Asiakkaiden haku epäonnistui")
  }

  return await response.json()
}

export const getOrders = async () => {
  const response = await fetch(ORDER_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tilausten haku epäonnistui")
  }

  return await response.json()
}

export const getOrderDetails = async () => {
  const response = await fetch(ORDER_DETAIL_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tilausten yksityiskohtien haku epäonnistui")
  }

  return await response.json()
}

