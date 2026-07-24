import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs'
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
      'HTTP-Referer': 'https://openply.pages.dev',
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
    const { execSync } = await import('child_process')
    let results: string[] = []

    // Try ripgrep first
    try {
      const output = execSync(`rg -l "${query.replace(/"/g, '\\"')}" --max-count 30 --type-not class --iglob '!node_modules' --iglob '!dist' --iglob '!.git'`, { cwd: ROOT, encoding: 'utf-8', timeout: 10000 })
      results = output.trim().split('\n').filter(Boolean).slice(0, 30)
    } catch {
      // Fall back to findstr (Windows) or grep
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
    })
    const html = await response.text()

    // Simple extraction of result snippets
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

  // Block dangerous commands
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

  // Limit command length
  if (command.length > 10000) {
    res.status(400).json({ error: 'Command too long (max 10KB)' })
    return
  }

  try {
    const { execSync } = await import('child_process')
    const output = execSync(command, { cwd: ROOT, encoding: 'utf-8', timeout: 30000, maxBuffer: 2 * 1024 * 1024 })
    res.json({ output: output.toString() })
  } catch (err: any) {
    res.json({ output: err.stdout?.toString() || '', error: err.stderr?.toString() || err.message })
  }
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

// --- Health Check ---
const startTime = Date.now()
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '0.2.0',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    root: ROOT,
  })
})

// --- Git Status ---
app.get('/api/git/status', (_req, res) => {
  try {
    const { execSync } = require('child_process')

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
    const { execSync } = require('child_process')
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
})
