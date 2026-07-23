const API_BASE = import.meta.env.VITE_API_URL || '/api'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  files?: { path: string; content: string }[]
  timestamp: number
}

export async function sendMessage(
  prompt: string,
  history: ChatMessage[],
  model: string,
  apiKey: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
): Promise<void> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, history, model, apiKey }),
  })

  if (!res.ok) {
    const err = await res.text()
    onError(`API error (${res.status}): ${err}`)
    return
  }

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

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
        if (parsed.error) { onError(parsed.error); return }
        if (parsed.done) { onDone(); return }
        if (parsed.content) onChunk(parsed.content)
      } catch { }
    }
  }
  onDone()
}

let cachedFiles: string[] | null = null

export function clearFileCache() { cachedFiles = null }

export async function listFiles(): Promise<string[]> {
  if (cachedFiles) return cachedFiles
  const res = await fetch(`${API_BASE}/files`)
  if (!res.ok) return []
  const data: { files?: string[] } = await res.json()
  cachedFiles = data.files || []
  return cachedFiles!
}

export async function readFile(path: string): Promise<string> {
  const res = await fetch(`${API_BASE}/files/${encodeURIComponent(path)}`)
  if (!res.ok) throw new Error('File not found')
  return res.text()
}
