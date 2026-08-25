import { createContext, useContext, useReducer, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { chatStream, checkHealth, fetchModels, type ChatMessage, type ORModel, type ChatUsage } from './api'

export type RightPanel = 'code' | 'editor' | 'git' | 'terminal' | 'settings'
export type BackendStatus = 'checking' | 'online' | 'offline'

export interface Checkpoint {
  id: string
  messages: ChatMessage[]
  timestamp: number
  label: string
}

export interface Session {
  id: string
  name: string
  messages: ChatMessage[]
  checkpoints: Checkpoint[]
  agent: string
  mode: 'plan' | 'build'
  autoAccept: boolean
  model: string
  createdAt: number
  updatedAt: number
}

export const FALLBACK_DEFAULT_MODEL = 'stealth/ox-alpha'

interface Providers { openrouter: string; openai: string; anthropic: string }
interface Todo { id: string; text: string; done: boolean }

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface AppState {
  sessions: Session[]
  activeSessionId: string | null
  rightPanel: RightPanel
  activeFile: string | null
  fileContent: string | null
  files: string[]
  providers: Providers
  loading: boolean
  todos: Todo[]
  searchResults: string[]
  webResults: string
  diagnostics: { model: string; mode: string; agent: string; messages: number; files: number }
  backend: BackendStatus
  healthInfo: { openrouterConfigured: boolean; defaultModel: string; uptime: number } | null
  models: ORModel[]
  modelsLive: boolean
  usage: ChatUsage | null
  toasts: Toast[]
  streaming: boolean
}

function loadSessions(): Session[] {
  try { return JSON.parse(localStorage.getItem('openply_sessions') || '[]') } catch { return [] }
}
function loadProviders(): Providers {
  return {
    openrouter: localStorage.getItem('openply_provider_openrouter') || '',
    openai: localStorage.getItem('openply_provider_openai') || '',
    anthropic: localStorage.getItem('openply_provider_anthropic') || '',
  }
}

type Action =
  | { type: 'ADD_SESSION'; session: Session }
  | { type: 'DELETE_SESSION'; id: string }
  | { type: 'RENAME_SESSION'; id: string; name: string }
  | { type: 'SET_ACTIVE_SESSION'; id: string | null }
  | { type: 'SET_RIGHT_PANEL'; panel: RightPanel }
  | { type: 'SET_ACTIVE_FILE'; path: string | null; content: string | null }
  | { type: 'SET_FILES'; files: string[] }
  | { type: 'SET_PROVIDER'; key: keyof Providers; value: string }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'ADD_MESSAGE'; sessionId: string; message: ChatMessage }
  | { type: 'UPDATE_MESSAGE'; sessionId: string; messageId: string; content: string }
  | { type: 'SET_SESSION_FIELD'; sessionId: string; field: string; value: any }
  | { type: 'ADD_CHECKPOINT'; sessionId: string; checkpoint: Checkpoint }
  | { type: 'RESTORE_CHECKPOINT'; sessionId: string; checkpointId: string }
  | { type: 'SET_TODOS'; todos: Todo[] }
  | { type: 'TOGGLE_TODO'; id: string }
  | { type: 'ADD_TODO'; todo: Todo }
  | { type: 'SET_SEARCH'; results: string[] }
  | { type: 'SET_WEB_RESULTS'; results: string }
  | { type: 'SET_DIAGNOSTICS'; diagnostics: Partial<AppState['diagnostics']> }
  | { type: 'SET_BACKEND'; status: BackendStatus; health?: AppState['healthInfo'] }
  | { type: 'SET_MODELS'; models: ORModel[]; live: boolean }
  | { type: 'SET_USAGE'; usage: ChatUsage | null }
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'DISMISS_TOAST'; id: string }
  | { type: 'SET_STREAMING'; streaming: boolean }

function reducer(state: AppState, action: Action): AppState {
  const upd = (id: string, changes: Partial<Session>) =>
    state.sessions.map((s) => s.id === id ? { ...s, ...changes, updatedAt: Date.now() } : s)

  switch (action.type) {
    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.session], activeSessionId: action.session.id }
    case 'DELETE_SESSION': {
      const filtered = state.sessions.filter((s) => s.id !== action.id)
      return { ...state, sessions: filtered, activeSessionId: state.activeSessionId === action.id ? (filtered[0]?.id ?? null) : state.activeSessionId }
    }
    case 'RENAME_SESSION': return { ...state, sessions: upd(action.id, { name: action.name }) }
    case 'SET_ACTIVE_SESSION': return { ...state, activeSessionId: action.id }
    case 'SET_RIGHT_PANEL': return { ...state, rightPanel: action.panel }
    case 'SET_ACTIVE_FILE': return { ...state, activeFile: action.path, fileContent: action.content }
    case 'SET_FILES': return { ...state, files: action.files }
    case 'SET_PROVIDER': return { ...state, providers: { ...state.providers, [action.key]: action.value } }
    case 'SET_LOADING': return { ...state, loading: action.loading }
    case 'ADD_MESSAGE': return { ...state, sessions: upd(action.sessionId, { messages: [...(state.sessions.find(s => s.id === action.sessionId)?.messages || []), action.message] }) }
    case 'UPDATE_MESSAGE': return { ...state, sessions: state.sessions.map((s) => s.id === action.sessionId ? { ...s, messages: s.messages.map((m) => m.id === action.messageId ? { ...m, content: action.content } : m), updatedAt: Date.now() } : s) }
    case 'SET_SESSION_FIELD': return { ...state, sessions: upd(action.sessionId, { [action.field]: action.value }) }
    case 'ADD_CHECKPOINT': return { ...state, sessions: upd(action.sessionId, { checkpoints: [...(state.sessions.find(s => s.id === action.sessionId)?.checkpoints || []), action.checkpoint] }) }
    case 'RESTORE_CHECKPOINT': {
      const s = state.sessions.find(s => s.id === action.sessionId)
      const cp = s?.checkpoints.find(c => c.id === action.checkpointId)
      if (!s || !cp) return state
      return { ...state, sessions: upd(action.sessionId, { messages: cp.messages }) }
    }
    case 'SET_TODOS': return { ...state, todos: action.todos }
    case 'ADD_TODO': return { ...state, todos: [...state.todos, action.todo] }
    case 'TOGGLE_TODO': return { ...state, todos: state.todos.map(t => t.id === action.id ? { ...t, done: !t.done } : t) }
    case 'SET_SEARCH': return { ...state, searchResults: action.results }
    case 'SET_WEB_RESULTS': return { ...state, webResults: action.results }
    case 'SET_DIAGNOSTICS': return { ...state, diagnostics: { ...state.diagnostics, ...action.diagnostics } }
    case 'SET_BACKEND': return { ...state, backend: action.status, healthInfo: action.health ?? state.healthInfo }
    case 'SET_MODELS': return { ...state, models: action.models, modelsLive: action.live }
    case 'SET_USAGE': return { ...state, usage: action.usage }
    case 'ADD_TOAST': return { ...state, toasts: [...state.toasts.slice(-3), action.toast] }
    case 'DISMISS_TOAST': return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) }
    case 'SET_STREAMING': return { ...state, streaming: action.streaming, loading: action.streaming ? state.loading : false }
    default: return state
  }
}

const Ctx = createContext<{
  state: AppState; dispatch: React.Dispatch<Action>
  activeSession: Session | null
  createSession: () => void; deleteSession: (id: string) => void; renameSession: (id: string, name: string) => void
  addMessage: (msg: ChatMessage) => void; updateMessage: (id: string, content: string) => void
  sendChat: (prompt: string) => Promise<void>
  stopStreaming: () => void
  addCheckpoint: (label?: string) => void; undoToCheckpoint: () => void
  searchCode: (query: string) => Promise<void>; webSearch: (query: string) => Promise<void>
  refreshModels: () => Promise<void>
  toast: (message: string, type?: Toast['type']) => void
} | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    sessions: loadSessions(), activeSessionId: null, rightPanel: 'code',
    activeFile: null, fileContent: null, files: [], providers: loadProviders(), loading: false,
    todos: [], searchResults: [], webResults: '', diagnostics: { model: '', mode: 'build', agent: 'planner', messages: 0, files: 0 },
    backend: 'checking', healthInfo: null, models: [], modelsLive: false, usage: null, toasts: [], streaming: false,
  })

  const stateRef = useRef(state)
  stateRef.current = state
  const abortRef = useRef<AbortController | null>(null)

  if (!state.activeSessionId && state.sessions.length > 0)
    dispatch({ type: 'SET_ACTIVE_SESSION', id: state.sessions[0].id })

  useEffect(() => { localStorage.setItem('openply_sessions', JSON.stringify(state.sessions)) }, [state.sessions])

  const toast = useCallback((message: string, type: Toast['type'] = 'info') => {
    dispatch({ type: 'ADD_TOAST', toast: { id: Date.now().toString() + Math.random().toString(36).slice(2, 6), type, message } })
  }, [])

  // Backend health check on mount + when offline, retry every 15s
  useEffect(() => {
    let cancelled = false
    const check = async () => {
      try {
        const health = await checkHealth()
        if (cancelled) return
        dispatch({ type: 'SET_BACKEND', status: 'online', health: { openrouterConfigured: health.openrouterConfigured, defaultModel: health.defaultModel, uptime: health.uptime } })
      } catch {
        if (cancelled) return
        dispatch({ type: 'SET_BACKEND', status: 'offline' })
      }
    }
    check()
    const interval = setInterval(check, state.backend === 'offline' ? 15000 : 60000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [state.backend])

  const refreshModels = useCallback(async () => {
    try {
      const { models, live } = await fetchModels()
      dispatch({ type: 'SET_MODELS', models, live })
    } catch {
      dispatch({ type: 'SET_MODELS', models: [], live: false })
    }
  }, [])

  useEffect(() => { refreshModels() }, [refreshModels])

  const createSession = useCallback(() => {
    const n = stateRef.current.sessions.length
    dispatch({ type: 'ADD_SESSION', session: {
      id: Date.now().toString(), name: `openplysession ${n + 1}`, messages: [], checkpoints: [],
      agent: 'planner', mode: 'build', autoAccept: false, model: FALLBACK_DEFAULT_MODEL,
      createdAt: Date.now(), updatedAt: Date.now(),
    }})
  }, [])

  const deleteSession = useCallback((id: string) => dispatch({ type: 'DELETE_SESSION', id }), [])
  const renameSession = useCallback((id: string, name: string) => dispatch({ type: 'RENAME_SESSION', id, name }), [])

  const activeSession = state.sessions.find((s) => s.id === state.activeSessionId) || null

  const addMessage = useCallback((msg: ChatMessage) => {
    const sid = stateRef.current.activeSessionId
    if (sid) dispatch({ type: 'ADD_MESSAGE', sessionId: sid, message: msg })
  }, [])

  const updateMessage = useCallback((id: string, content: string) => {
    const sid = stateRef.current.activeSessionId
    if (sid) dispatch({ type: 'UPDATE_MESSAGE', sessionId: sid, messageId: id, content })
  }, [])

  const addCheckpoint = useCallback((label = 'Checkpoint') => {
    const st = stateRef.current
    const s = st.sessions.find(s => s.id === st.activeSessionId)
    if (!s) return
    dispatch({ type: 'ADD_CHECKPOINT', sessionId: s.id, checkpoint: { id: Date.now().toString(), messages: [...s.messages], timestamp: Date.now(), label } })
    addMessage({ id: Date.now().toString(), role: 'system', content: `✅ Checkpoint saved: ${label}`, timestamp: Date.now() })
  }, [addMessage])

  const undoToCheckpoint = useCallback(() => {
    const st = stateRef.current
    const s = st.sessions.find(s => s.id === st.activeSessionId)
    if (!s || s.checkpoints.length === 0) return
    const last = s.checkpoints[s.checkpoints.length - 1]
    dispatch({ type: 'RESTORE_CHECKPOINT', sessionId: s.id, checkpointId: last.id })
    dispatch({ type: 'SET_LOADING', loading: false })
  }, [])

  const searchCode = useCallback(async (query: string) => {
    try {
      const res = await fetch(`/api/search`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      dispatch({ type: 'SET_SEARCH', results: data.results || [] })
      addMessage({ id: Date.now().toString(), role: 'system', content: `🔍 Search results for "${query}":\n\`\`\`\n${(data.results || []).slice(0, 20).join('\n')}\n\`\`\``, timestamp: Date.now() })
    } catch {}
  }, [addMessage])

  const webSearch = useCallback(async (query: string) => {
    try {
      const res = await fetch(`/api/websearch`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      dispatch({ type: 'SET_WEB_RESULTS', results: data.results || '' })
      addMessage({ id: Date.now().toString(), role: 'system', content: `🌐 Web search for "${query}":\n\n${(data.results || '').slice(0, 2000)}`, timestamp: Date.now() })
    } catch {}
  }, [addMessage])

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
  }, [])

  const sendChat = useCallback(async (prompt: string) => {
    const st = stateRef.current
    const session = st.sessions.find((s) => s.id === st.activeSessionId)
    if (!session) return

    if (st.backend === 'offline') {
      toast('Backend is offline — start the server or check VITE_API_URL', 'error')
      return
    }

    if (session.messages.length > 0 && session.checkpoints.length === 0) {
      dispatch({ type: 'ADD_CHECKPOINT', sessionId: session.id, checkpoint: { id: Date.now().toString(), messages: [...session.messages], timestamp: Date.now(), label: 'Before message' } })
    }

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: prompt, timestamp: Date.now() }
    dispatch({ type: 'ADD_MESSAGE', sessionId: session.id, message: userMsg })
    dispatch({ type: 'SET_LOADING', loading: true })
    dispatch({ type: 'SET_STREAMING', streaming: true })

    const assistantId = (Date.now() + 1).toString()
    dispatch({ type: 'ADD_MESSAGE', sessionId: session.id, message: { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() } })

    const history = [...session.messages, userMsg]
    const controller = new AbortController()
    abortRef.current = controller

    await chatStream(prompt, history, session.model, {
      signal: controller.signal,
      onChunk: (chunk) => {
        const st2 = stateRef.current
        const msg = st2.sessions.find(s => s.id === st2.activeSessionId)?.messages.find(m => m.id === assistantId)
        dispatch({ type: 'UPDATE_MESSAGE', sessionId: session.id, messageId: assistantId, content: (msg?.content || '') + chunk })
      },
      onUsage: (usage) => dispatch({ type: 'SET_USAGE', usage }),
      onDone: () => {
        dispatch({ type: 'SET_STREAMING', streaming: false })
        addCheckpoint('After response')
        abortRef.current = null
      },
      onError: (err) => {
        dispatch({ type: 'UPDATE_MESSAGE', sessionId: session.id, messageId: assistantId, content: `⚠️ ${err.message}` })
        dispatch({ type: 'SET_STREAMING', streaming: false })
        toast(err.message, 'error')
        abortRef.current = null
      },
    })
  }, [addCheckpoint, toast])

  return (
    <Ctx.Provider value={{ state, dispatch, activeSession, createSession, deleteSession, renameSession, addMessage, updateMessage, sendChat, stopStreaming, addCheckpoint, undoToCheckpoint, searchCode, webSearch, refreshModels, toast }}>
      {children}
    </Ctx.Provider>
  )
}

export function useStore() { const c = useContext(Ctx); if (!c) throw new Error('useStore must be inside StoreProvider'); return c }
