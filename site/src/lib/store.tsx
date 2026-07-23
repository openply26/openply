import { createContext, useContext, useReducer, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { sendMessage } from './api'
import type { ChatMessage } from './api'

export type RightPanel = 'code' | 'editor' | 'terminal' | 'settings'

export interface Session {
  id: string
  name: string
  messages: ChatMessage[]
  agent: string
  mode: 'plan' | 'build'
  model: string
  createdAt: number
  updatedAt: number
}

interface Providers { openrouter: string; openai: string; anthropic: string }

interface AppState {
  sessions: Session[]
  activeSessionId: string | null
  rightPanel: RightPanel
  activeFile: string | null
  fileContent: string | null
  files: string[]
  providers: Providers
  loading: boolean
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

const upd = (sessions: Session[], id: string, changes: Partial<Session>) =>
  sessions.map((s) => s.id === id ? { ...s, ...changes, updatedAt: Date.now() } : s)

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.session], activeSessionId: action.session.id }
    case 'DELETE_SESSION': {
      const filtered = state.sessions.filter((s) => s.id !== action.id)
      return { ...state, sessions: filtered, activeSessionId: state.activeSessionId === action.id ? (filtered[0]?.id ?? null) : state.activeSessionId }
    }
    case 'RENAME_SESSION': return { ...state, sessions: upd(state.sessions, action.id, { name: action.name }) }
    case 'SET_ACTIVE_SESSION': return { ...state, activeSessionId: action.id }
    case 'SET_RIGHT_PANEL': return { ...state, rightPanel: action.panel }
    case 'SET_ACTIVE_FILE': return { ...state, activeFile: action.path, fileContent: action.content }
    case 'SET_FILES': return { ...state, files: action.files }
    case 'SET_PROVIDER': return { ...state, providers: { ...state.providers, [action.key]: action.value } }
    case 'SET_LOADING': return { ...state, loading: action.loading }
    case 'ADD_MESSAGE': return { ...state, sessions: upd(state.sessions, action.sessionId, { messages: [...(state.sessions.find(s => s.id === action.sessionId)?.messages || []), action.message] }) }
    case 'UPDATE_MESSAGE': return { ...state, sessions: state.sessions.map((s) => s.id === action.sessionId ? { ...s, messages: s.messages.map((m) => m.id === action.messageId ? { ...m, content: action.content } : m), updatedAt: Date.now() } : s) }
    case 'SET_SESSION_FIELD': return { ...state, sessions: upd(state.sessions, action.sessionId, { [action.field]: action.value }) }
    default: return state
  }
}

const Ctx = createContext<{
  state: AppState; dispatch: React.Dispatch<Action>
  activeSession: Session | null
  createSession: () => void; deleteSession: (id: string) => void; renameSession: (id: string, name: string) => void
  addMessage: (msg: ChatMessage) => void; updateMessage: (id: string, content: string) => void
  sendChat: (prompt: string) => Promise<void>
} | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    sessions: loadSessions(), activeSessionId: null, rightPanel: 'code',
    activeFile: null, fileContent: null, files: [], providers: loadProviders(), loading: false,
  })

  const stateRef = useRef(state)
  stateRef.current = state

  if (!state.activeSessionId && state.sessions.length > 0)
    dispatch({ type: 'SET_ACTIVE_SESSION', id: state.sessions[0].id })

  useEffect(() => { localStorage.setItem('openply_sessions', JSON.stringify(state.sessions)) }, [state.sessions])
  useEffect(() => {
    localStorage.setItem('openply_provider_openrouter', state.providers.openrouter)
    localStorage.setItem('openply_provider_openai', state.providers.openai)
    localStorage.setItem('openply_provider_anthropic', state.providers.anthropic)
  }, [state.providers])

  const createSession = useCallback(() => {
    const n = stateRef.current.sessions.length
    dispatch({ type: 'ADD_SESSION', session: { id: Date.now().toString(), name: `Session ${n + 1}`, messages: [], agent: 'planner', mode: 'build', model: 'deepseek/deepseek-v4-flash', createdAt: Date.now(), updatedAt: Date.now() } })
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

  const sendChat = useCallback(async (prompt: string) => {
    const st = stateRef.current
    const session = st.sessions.find((s) => s.id === st.activeSessionId)
    if (!session) return

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: prompt, timestamp: Date.now() }
    dispatch({ type: 'ADD_MESSAGE', sessionId: session.id, message: userMsg })
    dispatch({ type: 'SET_LOADING', loading: true })

    const assistantId = (Date.now() + 1).toString()
    dispatch({ type: 'ADD_MESSAGE', sessionId: session.id, message: { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() } })

    const history = [...session.messages, userMsg]
    const key = st.providers.openrouter

    await sendMessage(
      prompt, history, session.model, key,
      (chunk) => {
        const st2 = stateRef.current
        const msg = st2.sessions.find(s => s.id === st2.activeSessionId)?.messages.find(m => m.id === assistantId)
        dispatch({ type: 'UPDATE_MESSAGE', sessionId: session.id, messageId: assistantId, content: (msg?.content || '') + chunk })
      },
      () => dispatch({ type: 'SET_LOADING', loading: false }),
      (err) => {
        dispatch({ type: 'UPDATE_MESSAGE', sessionId: session.id, messageId: assistantId, content: `Error: ${err}` })
        dispatch({ type: 'SET_LOADING', loading: false })
      },
    )
  }, [])

  return (
    <Ctx.Provider value={{ state, dispatch, activeSession, createSession, deleteSession, renameSession, addMessage, updateMessage, sendChat }}>
      {children}
    </Ctx.Provider>
  )
}

export function useStore() { const c = useContext(Ctx); if (!c) throw new Error('useStore must be inside StoreProvider'); return c }
