export class ApiError extends Error {
    readonly status: number
    readonly body: unknown

    constructor(message: string, status: number, body: unknown) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.body = body
    }
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
    body?: unknown
}

function getApiBaseUrl() {
    return import.meta.env.VITE_API_BASE_URL ?? ''
}

export function apiUrl(path: string) {
    return `${getApiBaseUrl()}${path}`
}

function readErrorMessage(body: unknown, fallback: string) {
    if (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string' && body.message) {
        return body.message
    }
    return fallback
}

async function readBody(response: Response) {
    const text = await response.text()
    if (!text) {
        return null
    }
    try {
        return JSON.parse(text) as unknown
    } catch {
        return text
    }
}

export function getApiErrorMessage(error: unknown, fallback = 'Request failed') {
    if (error instanceof ApiError && error.message) {
        return error.message
    }
    return fallback
}

export async function apiFetch<T = unknown>(path: string, options: ApiRequestOptions = {}) {
    const { body, headers, ...rest } = options
    const response = await fetch(apiUrl(path), {
        ...rest,
        credentials: 'include',
        headers: {
            ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
            ...headers
        },
        body: body !== undefined ? JSON.stringify(body) : undefined
    })
    const data = await readBody(response)
    if (!response.ok) {
        throw new ApiError(readErrorMessage(data, 'Request failed'), response.status, data)
    }
    return data as T
}
