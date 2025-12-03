const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

interface RequestOptions extends RequestInit {
  token?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }))
        throw new Error(error.message || `HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return response.json()
      }

      return response.text() as T
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("An unexpected error occurred")
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      token,
    })
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    token?: string
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      token,
    })
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    token?: string
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      token,
    })
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    token?: string
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      token,
    })
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      token,
    })
  }

  async uploadFile<T>(
    endpoint: string,
    file: File,
    token?: string,
    additionalData?: Record<string, string>
  ): Promise<T> {
    const formData = new FormData()
    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }))
        throw new Error(error.message || `HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return response.json()
      }

      return response.text() as T
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("An unexpected error occurred")
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

