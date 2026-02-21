export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(body.error || `请求失败 (${res.status})`, res.status)
  }
  return res.json()
}
