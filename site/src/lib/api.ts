const API_BASE = import.meta.env.VITE_API_URL || ''

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  files?: { path: string; content: string }[]
  timestamp: number
}

export interface ORModel {
  id: string
  name: string
  context: number
  promptPrice: number
  completionPrice: number
  free: boolean
}

export interface HealthInfo {
  ok: boolean
  status?: string
  openrouterConfigured: boolean
  defaultModel: string
  uptime: number
}

export interface ChatUsage {
  promptTokens: number
  completionTokens: number
  cost: number | null
}

export class ApiError extends Error {
  code: string
  constructor(message: string, code = 'unknown') {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

export class BackendOfflineError extends Error {
  constructor(message = 'Cannot reach the openPly backend.') {
    super(message)
    this.name = 'BackendOfflineError'
  }
}

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new BackendOfflineError('Request timed out.')
    throw new BackendOfflineError(err?.message)
  } finally {
    clearTimeout(t)
  }
}

export async function checkHealth(timeoutMs = 5000): Promise<HealthInfo> {
  const res = await fetchWithTimeout(`${API_BASE}/api/health`, {}, timeoutMs)
  if (!res.ok) throw new BackendOfflineError(`Health check failed (${res.status})`)
  return res.json()
}

export async function fetchModels(): Promise<{ models: ORModel[]; live: boolean }> {
  const res = await fetchWithTimeout(`${API_BASE}/api/models`, {}, 10000)
  if (!res.ok) throw new ApiError(`Could not load models (${res.status})`, 'models')
  const data = await res.json()
  return { models: data.models || [], live: Boolean(data.live) }
}

export interface ChatStreamHandlers {
  onChunk: (text: string) => void
  onUsage?: (usage: ChatUsage) => void
  onDone: () => void
  onError: (err: ApiError) => void
  signal?: AbortSignal
}

export async function chatStream(
  prompt: string,
  history: ChatMessage[],
  model: string,
  handlers: ChatStreamHandlers,
): Promise<void> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history, model }),
      signal: handlers.signal,
    })
  } catch (err: any) {
    if (err?.name === 'AbortError') { handlers.onDone(); return }
    handlers.onError(new BackendOfflineError('Cannot reach the backend server. Is it running?') as ApiError)
    return
  }

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => '')
    handlers.onError(new ApiError(`API error (${res.status}): ${errText.slice(0, 200)}`, 'http'))
    return
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue
        const data = trimmed.slice(6)
        try {
          const parsed = JSON.parse(data)
          if (parsed.error) { handlers.onError(new ApiError(parsed.error, parsed.code || 'upstream')); return }
          if (parsed.usage) handlers.onUsage?.(parsed.usage as ChatUsage)
          if (parsed.done) { handlers.onDone(); return }
          if (parsed.content) handlers.onChunk(parsed.content)
        } catch { }
      }
    }
    handlers.onDone()
  } catch (err: any) {
    if (err?.name === 'AbortError') { handlers.onDone(); return }
    handlers.onError(new ApiError(err?.message || 'Stream failed', 'network'))
  }
}

// Backward-compatible wrapper (apiKey param ignored — server holds the key)
export async function sendMessage(
  prompt: string,
  history: ChatMessage[],
  model: string,
  _apiKey: string = '',
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
): Promise<void> {
  await chatStream(prompt, history, model, { onChunk, onDone, onError: (e) => onError(e.message) })
}

let cachedFiles: string[] | null = null

export function clearFileCache() { cachedFiles = null }

export async function listFiles(): Promise<string[]> {
  if (cachedFiles) return cachedFiles
  const res = await fetchWithTimeout(`${API_BASE}/api/files`)
  if (!res.ok) return []
  const data: { files?: string[] } = await res.json()
  cachedFiles = data.files || []
  return cachedFiles!
}

export async function readFile(path: string): Promise<string> {
  const res = await fetchWithTimeout(`${API_BASE}/api/files/${encodeURIComponent(path)}`, {}, 15000)
  if (!res.ok) throw new Error('File not found')
  return res.text()
}

export async function writeFile(path: string, content: string): Promise<void> {
  const res = await fetchWithTimeout(`${API_BASE}/api/write`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, content }),
  }, 15000)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.error || `Write failed (${res.status})`, 'file')
}

export async function searchCodebase(query: string): Promise<string[]> {
  const res = await fetchWithTimeout(`${API_BASE}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  }, 15000)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.error || `Search failed (${res.status})`, 'search')
  return data.results || []
}

export async function webSearchApi(query: string): Promise<string> {
  const res = await fetchWithTimeout(`${API_BASE}/api/websearch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  }, 15000)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(`Web search failed (${res.status})`, 'websearch')
  return data.results || 'No results found.'
}

export async function runTerminal(command: string): Promise<{ output: string; error?: string }> {
  const res = await fetchWithTimeout(`${API_BASE}/api/terminal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command }),
  }, 45000)
  const data = await res.json().catch(() => ({}))
  if (!res.ok && !data.output) throw new ApiError(data.error || `Command failed (${res.status})`, 'terminal')
  return data
}
