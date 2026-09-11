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

function parseSseBlock(block: string) {
    let event = 'message'
    const dataLines: string[] = []
    for (const line of block.replace(/\r\n/g, '\n').split('\n')) {
        if (line.startsWith('event:')) {
            event = line.slice(6).trim()
        } else if (line.startsWith('data:')) {
            dataLines.push(line.slice(5).trimStart())
        }
    }
    if (dataLines.length === 0) {
        return null
    }
    const dataText = dataLines.join('\n')
    try {
        return { event, data: JSON.parse(dataText) as unknown }
    } catch {
        return { event, data: dataText as unknown }
    }
}

function readErrorEventMessage(data: unknown) {
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string' && data.message) {
        return data.message
    }
    return 'Stream failed'
}

export function getStreamDeltaText(data: unknown) {
    if (data && typeof data === 'object' && 'text' in data && typeof data.text === 'string') {
        return data.text
    }
    return ''
}

export async function apiStream(
    path: string,
    options: ApiRequestOptions & {
        onEvent: (event: string, data: unknown) => void
    }
) {
    const { body, headers, onEvent, ...rest } = options
    const response = await fetch(apiUrl(path), {
        ...rest,
        method: rest.method ?? 'POST',
        credentials: 'include',
        headers: {
            ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
            Accept: 'text/event-stream',
            ...headers
        },
        body: body !== undefined ? JSON.stringify(body) : undefined
    })
    if (!response.ok) {
        const data = await readBody(response)
        throw new ApiError(readErrorMessage(data, 'Request failed'), response.status, data)
    }
    if (!response.body) {
        throw new ApiError('Stream not supported', response.status, null)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let sawDone = false

    while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n')
        const parts = buffer.split('\n\n')
        buffer = parts.pop() ?? ''
        for (const part of parts) {
            const parsed = parseSseBlock(part)
            if (!parsed) continue
            if (parsed.event === 'error') {
                throw new ApiError(readErrorEventMessage(parsed.data), 500, parsed.data)
            }
            if (parsed.event === 'done') {
                sawDone = true
            }
            onEvent(parsed.event, parsed.data)
        }
    }

    if (buffer.trim()) {
        const parsed = parseSseBlock(buffer)
        if (parsed) {
            if (parsed.event === 'error') {
                throw new ApiError(readErrorEventMessage(parsed.data), 500, parsed.data)
            }
            if (parsed.event === 'done') {
                sawDone = true
            }
            onEvent(parsed.event, parsed.data)
        }
    }

    if (!sawDone) {
        throw new ApiError('Stream ended unexpectedly', 500, null)
    }
}
