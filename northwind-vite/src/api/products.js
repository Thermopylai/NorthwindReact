import { getAuthHeaders } from "./apiClient"

const BASE_URL = "https://localhost:7065/api/products"
// Vaihda portti tarvittaessa oman API:n mukaan

const normalizeDecimalString = (value) => {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/€/g, "")
    .replace(/,/g, ".")
}

export const getProducts = async () => {
  const response = await fetch(BASE_URL, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tuotteiden haku epäonnistui")
  }

  return await response.json()
}

export const getProductsByCategoryId = async (categoryId) => {
  const response = await fetch(`${BASE_URL}/by-category/${categoryId}`, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tuotteiden haku epäonnistui")
  }

  return await response.json()
}

export const getProductById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tuotteen haku epäonnistui")
  }

  return await response.json()
}

export const createProduct = async (product) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(product)
  })

  if (!response.ok) {
    throw new Error("Tuotteen lisäys epäonnistui")
  }

  return await response.json()
}

export const updateProduct = async (id, product) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(product)
  })

  if (!response.ok) {
    throw new Error("Tuotteen päivitys epäonnistui")
  }

  return await response.json()
}

export const deleteProduct = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tuotteen poisto epäonnistui")
  }

  return true
}

export const restoreProduct = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/restore`, {
    method: "PUT",
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error("Tuotteen palautus epäonnistui")
  }

  return true
}

export const searchProducts = async (params) => {
  const searchParams = new URLSearchParams()

  if (params.supplierId !== "") {
    searchParams.append("SupplierId", params.supplierId)
  }

  if (params.categoryId !== "") {
    searchParams.append("CategoryId", params.categoryId)
  }

  if (params.discontinued !== "") {
    searchParams.append("Discontinued", params.discontinued)
  }

  const minPrice = normalizeDecimalString(params.minPrice)
  if (minPrice !== "") {
    searchParams.append("MinPrice", minPrice)
  }

  const maxPrice = normalizeDecimalString(params.maxPrice)
  if (maxPrice !== "") {
    searchParams.append("MaxPrice", maxPrice)
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
    throw new Error("Tuotteiden haku epäonnistui")
  }

  return await response.json()
}