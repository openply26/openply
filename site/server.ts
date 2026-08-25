import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import { resolve, relative, sep, normalize } from 'path'

const app = express()
const PORT = process.env.PORT || 3001
const ROOT = resolve(process.env.OPENPLY_ROOT || resolve(process.cwd(), '..'))

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY || ''
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'stealth/ox-alpha'
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:4173,https://openply.pages.dev')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)
const UPSTREAM_TIMEOUT_MS = 90_000

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    cb(null, false)
  },
}))
app.use(express.json({ limit: '4mb' }))

// ---------- Live OpenRouter model catalog (cached) ----------

interface ORModel {
  id: string
  name: string
  context: number
  promptPrice: number
  completionPrice: number
  free: boolean
}

const FALLBACK_MODELS: ORModel[] = [
  { id: 'stealth/ox-alpha', name: 'Ox Alpha', context: 1048576, promptPrice: 0, completionPrice: 0, free: true },
  { id: 'deepseek/deepseek-chat-v3-0324', name: 'DeepSeek V3 0324', context: 163840, promptPrice: 0.27, completionPrice: 1.1, free: false },
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', context: 1048576, promptPrice: 0.3, completionPrice: 2.5, free: false },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o mini', context: 128000, promptPrice: 0.15, completionPrice: 0.6, free: false },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude Sonnet 3.5', context: 200000, promptPrice: 3, completionPrice: 15, free: false },
  { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek V3 0324 (free)', context: 163840, promptPrice: 0, completionPrice: 0, free: true },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', context: 131072, promptPrice: 0.12, completionPrice: 0.31, free: false },
]

let modelCache: { models: ORModel[]; fetchedAt: number; live: boolean } | null = null
const MODEL_CACHE_TTL = 6 * 60 * 60 * 1000

async function fetchOpenRouterModels(): Promise<ORModel[]> {
  const res = await fetch('https://openrouter.ai/api/v1/models', {
    headers: { 'HTTP-Referer': 'https://openply.pages.dev', 'X-Title': 'openPly Web' },
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`OpenRouter models returned ${res.status}`)
  const json = await res.json() as any
  const models: ORModel[] = (json.data || [])
    .filter((m: any) => m?.id && typeof m.id === 'string')
    .map((m: any) => {
      const promptPrice = Number(m.pricing?.prompt || 0) * 1_000_000
      const completionPrice = Number(m.pricing?.completion || 0) * 1_000_000
      return {
        id: m.id,
        name: m.name || m.id,
        context: m.context_length || 0,
        promptPrice,
        completionPrice,
        free: m.id.endsWith(':free') || (promptPrice === 0 && completionPrice === 0),
      }
    })
    .sort((a: ORModel, b: ORModel) => Number(b.free) - Number(a.free) || a.name.localeCompare(b.name))
  if (!models.length) throw new Error('OpenRouter returned empty model list')
  return models
}

app.get('/api/models', async (_req, res) => {
  const now = Date.now()
  if (modelCache && now - modelCache.fetchedAt < MODEL_CACHE_TTL) {
    res.json(modelCache)
    return
  }
  try {
    const models = await fetchOpenRouterModels()
    modelCache = { models, fetchedAt: now, live: true }
    res.json(modelCache)
  } catch (err: any) {
    if (modelCache) {
      res.json(modelCache)
      return
    }
    res.json({ models: FALLBACK_MODELS, fetchedAt: now, live: false, error: err.message })
  }
})

// ---------- Chat streaming (SSE) ----------

function streamOpenRouter(messages: any[], model: string, signal: AbortSignal) {
  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://openply.pages.dev',
      'X-Title': 'openPly Web',
    },
    body: JSON.stringify({ model, messages, stream: true, usage: { include: true } }),
    signal,
  })
}

function streamOllama(messages: any[], model: string, signal: AbortSignal) {
  return fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: true }),
    signal,
  })
}

function sseError(res: any, code: string, message: string) {
  if (res.writableEnded) return
  res.write(`data: ${JSON.stringify({ error: message, code })}\n\n`)
  res.end()
}

async function pipeStream(response: Response, res: any) {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let usage: any = null

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (res.writableEnded) { reader.cancel().catch(() => {}); return }
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
        if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`)
        if (parsed.usage) {
          usage = {
            promptTokens: parsed.usage.prompt_tokens ?? 0,
            completionTokens: parsed.usage.completion_tokens ?? 0,
            cost: parsed.usage.cost ?? null,
          }
        }
      } catch { }
    }
  }

  if (res.writableEnded) return
  if (usage) res.write(`data: ${JSON.stringify({ usage })}\n\n`)
  res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
  res.end()
}

function classifyUpstreamError(status: number): { code: string; message: string } {
  if (status === 401 || status === 403) return { code: 'invalid_key', message: 'OpenRouter rejected the server API key. Check OPENROUTER_API_KEY.' }
  if (status === 402) return { code: 'no_credits', message: 'OpenRouter account is out of credits.' }
  if (status === 429) return { code: 'rate_limited', message: 'Rate limited by the upstream provider. Try again in a moment.' }
  if (status === 404) return { code: 'model_not_found', message: 'That model is not available on OpenRouter.' }
  if (status >= 500) return { code: 'upstream', message: `Upstream provider error (${status}).` }
  return { code: 'upstream', message: `OpenRouter error (${status}).` }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

app.post('/api/chat', async (req, res) => {
  const { prompt, history, model } = req.body
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'prompt required' })
    return
  }
  const requestedModel = typeof model === 'string' && model.trim() ? model.trim() : DEFAULT_MODEL

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders()

  const messages = (Array.isArray(history) ? history : [])
    .filter((m: any) => m && typeof m.content === 'string' && ['user', 'assistant', 'system'].includes(m.role))
    .map((m: any) => ({ role: m.role, content: m.content }))
  messages.push({ role: 'user', content: prompt })

  let clientClosed = false
  const controller = new AbortController()
  res.on('close', () => {
    if (!res.writableEnded) {
      clientClosed = true
      controller.abort()
    }
  })
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

  try {
    const isOllama = requestedModel.startsWith('ollama/')

    if (!isOllama && !OPENROUTER_API_KEY) {
      clearTimeout(timeout)
      sseError(res, 'no_key', 'Server is missing OPENROUTER_API_KEY. Set it in your backend environment variables.')
      return
    }

    const doRequest = () => isOllama
      ? streamOllama(messages, requestedModel.replace('ollama/', ''), controller.signal)
      : streamOpenRouter(messages, requestedModel, controller.signal)

    let response = await doRequest()

    if (!response.ok && (response.status === 429 || response.status >= 500)) {
      await response.body?.cancel().catch(() => {})
      await sleep(1500)
      if (clientClosed) return
      response = await doRequest()
    }

    if (!response.ok) {
      const { code, message } = classifyUpstreamError(response.status)
      const details = await response.text().catch(() => '')
      console.error(`[chat] upstream ${response.status}:`, details.slice(0, 300))
      clearTimeout(timeout)
      sseError(res, code, message)
      return
    }

    await pipeStream(response, res)
  } catch (err: any) {
    if (clientClosed) return
    if (err?.name === 'TimeoutError' || (err?.name === 'AbortError' && !clientClosed)) {
      sseError(res, 'timeout', 'The request timed out. The model may be busy — try again.')
    } else {
      sseError(res, 'network', `Connection failed: ${err.message}`)
    }
  } finally {
    clearTimeout(timeout)
  }
})


app.post('/api/upload', (req, res) => {
  const { name, type, data } = req.body || {}
  if (!name || typeof data !== 'string' || !data.startsWith('data:')) {
    res.status(400).json({ error: 'name and data (data URL) required' })
    return
  }
  const match = /^data:([^;]+);base64,(.*)$/s.exec(data)
  if (!match) {
    res.status(400).json({ error: 'Invalid data URL' })
    return
  }
  const size = Math.floor(match[2].length * 0.75)
  if (size > 10 * 1024 * 1024) {
    res.status(413).json({ error: 'File too large (max 10MB)' })
    return
  }
  try {
    const uploadDir = resolve(ROOT, 'uploads')
    mkdirSync(uploadDir, { recursive: true })
    const safe = normalize(name).replace(/[^a-zA-Z0-9._-]/g, '_')
    const fileName = `${Date.now()}-${safe}`
    const fullPath = resolve(uploadDir, fileName)
    if (!fullPath.startsWith(uploadDir)) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }
    writeFileSync(fullPath, Buffer.from(match[2], 'base64'))
    const kind = typeof type === 'string' && type.startsWith('image/') && !type.includes('svg') ? 'image' : 'file'
    res.json({ kind, name, path: `uploads/${fileName}`, url: `uploads/${fileName}`, size })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})
app.get('/api/files', (_req, res) => {
  const result: string[] = []
  walk(ROOT, '', result)
  res.json({ files: result })
})

app.post('/api/write', (req, res) => {
  const { path, content } = req.body
  if (!path || content === undefined) {
    res.status(400).json({ error: 'path and content required' })
    return
  }
  const normalized = normalize(path)
  const fullPath = resolve(ROOT, normalized)

  if (!fullPath.startsWith(ROOT)) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  try {
    writeFileSync(fullPath, content, 'utf-8')
    res.json({ success: true, path })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/search', async (req, res) => {
  const { query } = req.body
  if (!query) { res.status(400).json({ error: 'query required' }); return }

  try {
    let results: string[] = []

    try {
      const output = execSync(`rg -l "${query.replace(/"/g, '\\"')}" --max-count 30 --type-not class --iglob '!node_modules' --iglob '!dist' --iglob '!.git'`, { cwd: ROOT, encoding: 'utf-8', timeout: 10000 })
      results = output.trim().split('\n').filter(Boolean).slice(0, 30)
    } catch {
      try {
        const cmd = process.platform === 'win32'
          ? `findstr /M /S /C:"${query}" *.ts *.tsx *.js *.jsx *.json *.md *.css 2>nul`
          : `grep -rl "${query}" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --include="*.md" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git . 2>/dev/null | head -30`
        const output = execSync(cmd, { cwd: ROOT, encoding: 'utf-8', timeout: 10000 })
        results = output.trim().split('\n').filter(Boolean).slice(0, 30)
      } catch { /* no results */ }
    }

    res.json({ results })
  } catch (err: any) {
    res.json({ results: [], error: err.message })
  }
})

app.post('/api/websearch', async (req, res) => {
  const { query } = req.body
  if (!query) { res.status(400).json({ error: 'query required' }); return }

  try {
    const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'openPly/1.0' },
      signal: AbortSignal.timeout(10_000),
    })
    const html = await response.text()

    const snippets: string[] = []
    const regex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi
    let match: RegExpExecArray | null
    while ((match = regex.exec(html)) !== null && snippets.length < 5) {
      const title = match[2].replace(/<[^>]*>/g, '').trim()
      const snippet = match[3].replace(/<[^>]*>/g, '').trim()
      snippets.push(`**${title}**\n${snippet}\n${match[1]}`)
    }

    res.json({ results: snippets.join('\n\n') || 'No results found.' })
  } catch (err: any) {
    res.json({ results: `Search failed: ${err.message}` })
  }
})

app.post('/api/terminal', async (req, res) => {
  const { command } = req.body
  if (!command) {
    res.status(400).json({ error: 'command required' })
    return
  }

  const blocked = [
    /rm\s+-rf\s+[\/~]/i,
    /mkfs\./i,
    /dd\s+if=/i,
    />\s*\/dev\/sd/i,
    /;\s*curl.*\|\s*sh/i,
    /;\s*wget.*\|\s*sh/i,
  ]
  for (const pattern of blocked) {
    if (pattern.test(command)) {
      res.status(403).json({ error: 'Command blocked for safety', command })
      return
    }
  }

  if (command.length > 10000) {
    res.status(400).json({ error: 'Command too long (max 10KB)' })
    return
  }

  try {
    const output = execSync(command, { cwd: ROOT, encoding: 'utf-8', timeout: 30000, maxBuffer: 2 * 1024 * 1024 })
    res.json({ output: output.toString() })
  } catch (err: any) {
    res.json({ output: err.stdout?.toString() || '', error: err.stderr?.toString() || err.message })
  }
})

app.get('/api/files/{*path}', (req, res) => {
  const rawPath = req.params.path
  const filePath = normalize(Array.isArray(rawPath) ? rawPath.join('/') : rawPath || '')
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

// --- Health Check ---
const startTime = Date.now()
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    ok: true,
    version: '0.4.0',
    openrouterConfigured: Boolean(OPENROUTER_API_KEY),
    defaultModel: DEFAULT_MODEL,
    uptime: Math.floor((Date.now() - startTime) / 1000),
    root: ROOT,
  })
})

// --- Git Status ---
app.get('/api/git/status', (_req, res) => {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: ROOT, encoding: 'utf-8' }).trim()

    const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf-8' }).trim()
    const modified: string[] = []
    const staged: string[] = []
    const untracked: string[] = []

    for (const line of status.split('\n').filter(Boolean)) {
      const index = line[0]
      const worktree = line[1]
      const file = line.slice(3)

      if (index === '?' && worktree === '?') {
        untracked.push(file)
      } else {
        if (index && index !== ' ' && index !== '?') staged.push(file)
        if (worktree && worktree !== ' ' && worktree !== '?') modified.push(file)
      }
    }

    let ahead = 0
    let behind = 0
    try {
      const ab = execSync('git rev-list --left-right --count HEAD...@{upstream}', { cwd: ROOT, encoding: 'utf-8' }).trim()
      const [a, b] = ab.split('\t').map(Number)
      ahead = a || 0
      behind = b || 0
    } catch { /* no upstream */ }

    res.json({ branch, modified, staged, untracked, ahead, behind })
  } catch (err: any) {
    res.json({ branch: null, modified: [], staged: [], untracked: [], ahead: 0, behind: 0, error: 'Not a git repo' })
  }
})

// --- Git Diff ---
app.get('/api/git/diff', (req, res) => {
  try {
    const file = req.query.file as string | undefined
    const cmd = file ? `git diff -- "${file}"` : 'git diff'
    const diff = execSync(cmd, { cwd: ROOT, encoding: 'utf-8', timeout: 5000 })
    res.json({ diff })
  } catch (err: any) {
    res.json({ diff: '', error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`openPly API server running on http://localhost:${PORT}`)
  console.log(`Project root: ${ROOT}`)
  console.log(`Default model: ${DEFAULT_MODEL}`)
  if (!OPENROUTER_API_KEY) {
    console.warn('WARNING: OPENROUTER_API_KEY is not set. Non-local chat requests will fail.')
  }
})
