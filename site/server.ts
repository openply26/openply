import express from 'express'
import cors from 'cors'
import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { resolve, relative, sep, normalize } from 'path'

const app = express()
const PORT = process.env.PORT || 3001
const ROOT = resolve(process.env.OPENPLY_ROOT || resolve(process.cwd(), '..'))

app.use(cors())
app.use(express.json())

function streamOpenRouter(messages: any[], model: string, key: string, res: any) {
  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://openply26.netlify.app',
      'X-Title': 'openPly Web',
    },
    body: JSON.stringify({ model, messages, stream: true }),
  })
}

function streamOllama(messages: any[], model: string, res: any) {
  return fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: true }),
  })
}

async function pipeStream(response: Response, res: any) {
  if (!response.ok) {
    const err = await response.text()
    res.write(`data: ${JSON.stringify({ error: `API error: ${response.status}`, details: err })}\n\n`)
    res.end()
    return
  }

  const reader = response.body!.getReader()
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
      if (data === '[DONE]') continue
      try {
        const parsed = JSON.parse(data)
        const content = parsed.choices?.[0]?.delta?.content || parsed.message?.content || ''
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`)
        }
      } catch { }
    }
  }

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
  res.end()
}

app.post('/api/chat', async (req, res) => {
  const { prompt, history, model, apiKey } = req.body
  const key = apiKey || process.env.OPENROUTER_KEY

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const messages = (history || []).map((m: any) => ({ role: m.role, content: m.content }))
  messages.push({ role: 'user', content: prompt })

  try {
    const isOllama = model.startsWith('ollama/')
    let response

    if (isOllama) {
      const ollamaModel = model.replace('ollama/', '')
      response = await streamOllama(messages, ollamaModel, res)
    } else {
      if (!key) {
        res.write(`data: ${JSON.stringify({ error: 'API key required. Set OPENROUTER_KEY env, pass apiKey, or use ollama/ model.' })}\n\n`)
        res.end()
        return
      }
      response = await streamOpenRouter(messages, model, key, res)
    }

    await pipeStream(response, res)
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})

app.get('/api/files', (_req, res) => {
  const result: string[] = []
  walk(ROOT, '', result)
  res.json({ files: result })
})

app.get('/api/files/{*path}', (req, res) => {
  const filePath = normalize(req.params.path || '')
  const fullPath = resolve(ROOT, filePath)

  if (!fullPath.startsWith(ROOT)) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  if (!existsSync(fullPath) || statSync(fullPath).isDirectory()) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  res.send(readFileSync(fullPath, 'utf-8'))
})

const EXCLUDED_DIRS = new Set(['node_modules', 'dist', '.git', '.vscode', 'target', 'build', '__pycache__'])

function walk(dir: string, prefix: string, result: string[]) {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch { return }

  for (const entry of entries) {
    if (entry.startsWith('.') || EXCLUDED_DIRS.has(entry)) continue
    const full = resolve(dir, entry)
    const rel = prefix ? `${prefix}/${entry}` : entry
    try {
      if (statSync(full).isDirectory()) {
        walk(full, rel, result)
      } else {
        result.push(rel)
      }
    } catch { }
  }
}

app.listen(PORT, () => {
  console.log(`openPly API server running on http://localhost:${PORT}`)
  console.log(`Project root: ${ROOT}`)
})
