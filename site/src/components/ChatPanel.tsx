import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useStore } from '../lib/store'

const SLASH_COMMANDS = [
  { cmd: '/help', desc: 'Show available commands' },
  { cmd: '/model', desc: 'Switch model (e.g. /model deepseek/deepseek-v4-flash)' },
  { cmd: '/clear', desc: 'Clear current session messages' },
  { cmd: '/session', desc: 'Show session info' },
  { cmd: '/agent', desc: 'Switch agent (e.g. /agent explorer)' },
  { cmd: '/mode', desc: 'Switch mode: plan or build' },
  { cmd: '/undo', desc: 'Undo last change' },
  { cmd: '/export', desc: 'Export session as Markdown' },
]

const AGENT_NAMES = ['planner', 'editor', 'explorer', 'debugger', 'reviewer'] as const

export default function ChatPanel() {
  const { state, activeSession, sendChat, dispatch, addMessage, updateMessage } = useStore()
  const [input, setInput] = useState('')
  const [showCommands, setShowCommands] = useState(false)
  const [filteredCmds, setFilteredCmds] = useState(SLASH_COMMANDS)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [activeSession?.messages])

  useEffect(() => { inputRef.current?.focus() }, [activeSession?.id])

  const handleInput = (value: string) => {
    setInput(value)
    if (value.startsWith('/')) {
      const query = value.toLowerCase()
      setFilteredCmds(SLASH_COMMANDS.filter((c) => c.cmd.startsWith(query)))
      setShowCommands(true)
    } else {
      setShowCommands(false)
    }
  }

  const executeCommand = (cmd: string) => {
    setShowCommands(false)
    setInput('')

    if (cmd === '/help') {
      const helpText = SLASH_COMMANDS.map((c) => `- \`${c.cmd}\` — ${c.desc}`).join('\n')
      addMessage({ id: Date.now().toString(), role: 'system', content: `**Available commands:**\n\n${helpText}`, timestamp: Date.now() })
      return
    }

    if (cmd === '/clear') {
      if (activeSession) dispatch({ type: 'SET_SESSION_FIELD', sessionId: activeSession.id, field: 'messages', value: [] })
      return
    }

    if (cmd === '/session') {
      if (!activeSession) return
      addMessage({
        id: Date.now().toString(), role: 'system', timestamp: Date.now(),
        content: `**Session:** ${activeSession.name}\n**Agent:** ${activeSession.agent} (${activeSession.mode} mode)\n**Model:** ${activeSession.model}\n**Messages:** ${activeSession.messages.length}`,
      })
      return
    }

    if (cmd.startsWith('/model ')) {
      const model = cmd.slice(7).trim()
      if (activeSession && model) dispatch({ type: 'SET_SESSION_FIELD', sessionId: activeSession.id, field: 'model', value: model })
      return
    }

    if (cmd.startsWith('/agent ')) {
      const agent = cmd.slice(7).trim() as typeof AGENT_NAMES[number]
      if (activeSession && AGENT_NAMES.includes(agent)) dispatch({ type: 'SET_SESSION_FIELD', sessionId: activeSession.id, field: 'agent', value: agent })
      return
    }

    if (cmd.startsWith('/mode ')) {
      const mode = cmd.slice(6).trim() as 'plan' | 'build'
      if (activeSession && (mode === 'plan' || mode === 'build')) dispatch({ type: 'SET_SESSION_FIELD', sessionId: activeSession.id, field: 'mode', value: mode })
      return
    }

    if (cmd === '/undo') {
      addMessage({ id: Date.now().toString(), role: 'system', content: 'Undo is available in the CLI version via `openply`.\n\nIn the web app, file changes are not automatically applied. Use the Editor tab to manually edit files.', timestamp: Date.now() })
      return
    }

    if (cmd === '/export') {
      if (!activeSession) return
      const md = [`# Session: ${activeSession.name}`, `**Agent:** ${activeSession.agent} (${activeSession.mode} mode)`, `**Model:** ${activeSession.model}`, '', '---', '',
        ...activeSession.messages.map((m) => `### ${m.role}\n\n${m.content}\n`),
      ].join('\n')
      const blob = new Blob([md], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `${activeSession.name.replace(/\s+/g, '_')}.md`; a.click()
      URL.revokeObjectURL(url)
      return
    }
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text || state.loading || !activeSession) return
    setInput('')
    setShowCommands(false)
    if (text.startsWith('/')) { executeCommand(text); return }
    sendChat(text)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
    if (e.key === 'Escape') setShowCommands(false)
    if (e.key === 'Tab' && showCommands && filteredCmds.length > 0) {
      e.preventDefault()
      setInput(filteredCmds[0].cmd + ' ')
      setShowCommands(false)
    }
  }

  if (!activeSession) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 font-mono font-bold text-[#22D3EE]">ply&gt;</div>
          <p className="text-[#64748b]">Create or select a session to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeSession.messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center max-w-md">
              <div className="text-5xl mb-4 font-mono font-bold text-[#22D3EE]">ply&gt;</div>
              <p className="text-[#64748b]">Ask me anything about your codebase.<br />Type <code className="text-[#22D3EE]">/help</code> for commands.</p>
            </div>
          </div>
        )}
        {activeSession.messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#e2e8f0]'
                : m.role === 'system'
                ? 'bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#e2e8f0]'
                : 'bg-[#1a1a35] border border-[#1e293b] text-[#e2e8f0]'
            }`}>
              {m.role !== 'user' && (
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  {m.role === 'assistant' ? 'openPly' : 'system'}
                </div>
              )}
              <div className="prose prose-invert prose-sm max-w-none [&_pre]:rounded-lg [&_pre]:bg-[#0d1117] [&_pre]:p-4 [&_pre]:overflow-x-auto [&_code]:text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {m.content || '...'}
                </ReactMarkdown>
              </div>
              {m.files && m.files.length > 0 && (
                <div className="mt-2 border-t border-[#1e293b] pt-2 space-y-1">
                  {m.files.map((f) => <div key={f.path} className="text-xs text-[#22D3EE]">📄 {f.path}</div>)}
                </div>
              )}
            </div>
          </div>
        ))}
        {state.loading && (
          <div className="flex justify-start">
            <div className="rounded-xl border border-[#1e293b] bg-[#1a1a35] px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#22D3EE]" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#22D3EE]" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#22D3EE]" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[#1e293b] p-4 relative">
        {showCommands && filteredCmds.length > 0 && (
          <div className="absolute bottom-full left-4 right-4 mb-1 rounded-xl border border-[#1e293b] bg-[#0d0d20] shadow-xl overflow-hidden">
            {filteredCmds.map((c) => (
              <button
                key={c.cmd}
                onClick={() => { setInput(c.cmd + ' '); inputRef.current?.focus(); setShowCommands(false) }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-xs text-left hover:bg-[#1a1a35] transition-colors"
              >
                <code className="text-[#22D3EE] font-mono">{c.cmd}</code>
                <span className="text-[#64748b]">{c.desc}</span>
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask something or type / for commands..."
            className="flex-1 rounded-xl border border-[#1e293b] bg-[#0a0a1a] px-4 py-3 text-sm text-[#e2e8f0] placeholder-[#64748b] outline-none transition-colors focus:border-[#22D3EE]"
            disabled={state.loading}
          />
          <button
            onClick={handleSend}
            disabled={state.loading || !input.trim()}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-[#22D3EE] text-[#0a0a1a] transition-all hover:bg-[#2dd4f8] disabled:opacity-40"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
