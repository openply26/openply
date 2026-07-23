import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useStore } from '../lib/store'
import DesignPartner from './DesignPartner'

const SLASH_COMMANDS = [
  { cmd: '/help', desc: 'Show available commands' },
  { cmd: '/model', desc: 'Switch model (e.g. /model deepseek/deepseek-v4-flash)' },
  { cmd: '/clear', desc: 'Clear current session messages' },
  { cmd: '/session', desc: 'Show session info' },
  { cmd: '/agent', desc: 'Switch agent (e.g. /agent explorer)' },
  { cmd: '/mode', desc: 'Switch mode: plan or build' },
  { cmd: '/checkpoint', desc: 'Save a checkpoint to undo later' },
  { cmd: '/undo', desc: 'Undo to last checkpoint' },
  { cmd: '/search', desc: 'Search codebase (e.g. /search function foo)' },
  { cmd: '/web', desc: 'Search the web (e.g. /web react 19 release date)' },
  { cmd: '/todo', desc: 'Add a todo task (e.g. /todo fix login bug)' },
  { cmd: '/design', desc: 'Open Design Partner with 17 modes' },
  { cmd: '/share', desc: 'Copy session share link to clipboard' },
  { cmd: '/export', desc: 'Export session as Markdown' },
  { cmd: '/diagnostics', desc: 'Show session diagnostics' },
]

export default function ChatPanel() {
  const { state, activeSession, sendChat, dispatch, addMessage } = useStore()
  const { searchCode, webSearch, addCheckpoint, undoToCheckpoint } = useStore()
  const [input, setInput] = useState('')
  const [showCommands, setShowCommands] = useState(false)
  const [filteredCmds, setFilteredCmds] = useState(SLASH_COMMANDS)
  const [showDesign, setShowDesign] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [activeSession?.messages])

  useEffect(() => { inputRef.current?.focus() }, [activeSession?.id])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showCommands) {
        // Esc = rewind (undo to last checkpoint)
        if (!state.loading && activeSession) undoToCheckpoint()
      }
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        if (activeSession) dispatch({ type: 'SET_SESSION_FIELD', sessionId: activeSession.id, field: 'messages', value: [] })
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault()
        if (activeSession) dispatch({ type: 'SET_SESSION_FIELD', sessionId: activeSession.id, field: 'mode', value: activeSession.mode === 'plan' ? 'build' : 'plan' })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showCommands, state.loading, activeSession, undoToCheckpoint, dispatch])

  const handleInput = (value: string) => {
    setInput(value)
    if (value.startsWith('/')) {
      setFilteredCmds(SLASH_COMMANDS.filter((c) => c.cmd.startsWith(value.toLowerCase())))
      setShowCommands(true)
    } else {
      setShowCommands(false)
    }
  }

  const executeCommand = async (cmd: string) => {
    setShowCommands(false)
    setInput('')

    if (cmd === '/help') {
      const groups = [
        { label: 'General', cmds: ['/help', '/clear', '/session', '/diagnostics'] },
        { label: 'Agent', cmds: ['/agent', '/mode', '/model'] },
        { label: 'Code', cmds: ['/search', '/web', '/todo', '/checkpoint', '/undo'] },
        { label: 'Design', cmds: ['/design'] },
        { label: 'Share', cmds: ['/share', '/export'] },
      ]
      addMessage({ id: Date.now().toString(), role: 'system', content: '**Slash Commands**\n\n' + groups.map(g => `**${g.label}**\n${g.cmds.map(c => `- \`${SLASH_COMMANDS.find(s => s.cmd === c)?.cmd}\` — ${SLASH_COMMANDS.find(s => s.cmd === c)?.desc}`).join('\n')}`).join('\n\n'), timestamp: Date.now() })
      return
    }

    if (cmd === '/clear') {
      if (activeSession) dispatch({ type: 'SET_SESSION_FIELD', sessionId: activeSession.id, field: 'messages', value: [] })
      return
    }

    if (cmd === '/session') {
      if (!activeSession) return
      addMessage({ id: Date.now().toString(), role: 'system', timestamp: Date.now(),
        content: `**Session:** ${activeSession.name}\n**Agent:** ${activeSession.agent} (${activeSession.mode} mode)\n**Model:** ${activeSession.model}\n**Messages:** ${activeSession.messages.length}\n**Checkpoints:** ${activeSession.checkpoints.length}\n**Auto-accept:** ${activeSession.autoAccept ? 'ON' : 'OFF'}` })
      return
    }

    if (cmd === '/diagnostics') {
      if (!activeSession) return
      addMessage({ id: Date.now().toString(), role: 'system', timestamp: Date.now(),
        content: `**Diagnostics**\n\n- Session: ${activeSession.name}\n- Agent: ${activeSession.agent}\n- Mode: ${activeSession.mode}\n- Model: ${activeSession.model}\n- Messages: ${activeSession.messages.length}\n- Checkpoints: ${activeSession.checkpoints.length}\n- Files indexed: ${state.files.length}\n- Auto-accept: ${activeSession.autoAccept ? 'ON' : 'OFF'}\n- Todos: ${state.todos.filter(t => !t.done).length} pending\n- Loading: ${state.loading}` })
      return
    }

    if (cmd === '/checkpoint') {
      addCheckpoint('Manual checkpoint')
      return
    }

    if (cmd === '/undo') {
      undoToCheckpoint()
      return
    }

    if (cmd.startsWith('/model ')) {
      const model = cmd.slice(7).trim()
      if (activeSession && model) dispatch({ type: 'SET_SESSION_FIELD', sessionId: activeSession.id, field: 'model', value: model })
      return
    }

    if (cmd.startsWith('/agent ')) {
      const agent = cmd.slice(7).trim()
      const valid = ['planner', 'editor', 'explorer', 'debugger', 'reviewer']
      if (activeSession && valid.includes(agent)) dispatch({ type: 'SET_SESSION_FIELD', sessionId: activeSession.id, field: 'agent', value: agent })
      return
    }

    if (cmd.startsWith('/mode ')) {
      const mode = cmd.slice(6).trim() as 'plan' | 'build'
      if (activeSession && (mode === 'plan' || mode === 'build')) dispatch({ type: 'SET_SESSION_FIELD', sessionId: activeSession.id, field: 'mode', value: mode })
      return
    }

    if (cmd.startsWith('/search ')) {
      const query = cmd.slice(8).trim()
      if (query) searchCode(query)
      return
    }

    if (cmd.startsWith('/web ')) {
      const query = cmd.slice(5).trim()
      if (query) webSearch(query)
      return
    }

    if (cmd.startsWith('/todo ')) {
      const text = cmd.slice(6).trim()
      if (text) dispatch({ type: 'ADD_TODO', todo: { id: Date.now().toString(), text, done: false } })
      return
    }

    if (cmd === '/design') {
      setShowDesign(true)
      return
    }

    if (cmd === '/share') {
      if (!activeSession) return
      const shareData = { name: activeSession.name, agent: activeSession.agent, mode: activeSession.mode, model: activeSession.model, messageCount: activeSession.messages.length, timestamp: Date.now() }
      const url = `${window.location.origin}/app?share=${btoa(JSON.stringify(shareData))}`
      try {
        await navigator.clipboard.writeText(url)
        addMessage({ id: Date.now().toString(), role: 'system', content: `🔗 Share link copied to clipboard!\n\n\`${url}\``, timestamp: Date.now() })
      } catch {
        addMessage({ id: Date.now().toString(), role: 'system', content: `📋 Share URL:\n\`${url}\``, timestamp: Date.now() })
      }
      return
    }

    if (cmd === '/export') {
      if (!activeSession) return
      const md = [`# openPly Session: ${activeSession.name}`, `**Agent:** ${activeSession.agent} (${activeSession.mode} mode)`, `**Model:** ${activeSession.model}`, '', '---', '',
        ...activeSession.messages.map((m) => `### ${m.role.toUpperCase()}\n\n${m.content}\n`),
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

  // Handle design mode selection
  const handleDesignMode = (modeId: string) => {
    let component = ''
    const designPrompts: Record<string, string> = {
      audit: '🔍 Running design audit... scanning for visual issues, inconsistencies, and anti-patterns.',
      checkup: '🏥 Running design checkup... traffic-light scores for layout, color, typography, spacing.',
      smell: '👃 Detecting design smells... visual inconsistencies and anti-patterns.',
      recolor: '🎨 Recoloring UI... building OKLCH color system with semantic roles and contrast checks.',
      typeset: '🔤 Setting typography... establishing scale, hierarchy, and rhythm.',
      spacing: '📐 Auditing spacing... ensuring consistent spacing and layout grid.',
      icons: '⭐ Auditing icons... consistency check across the UI.',
      redesign: '✨ Redesigning interface... complete visual transformation.',
      relayout: '📋 Relayouting... reorganizing component tree and layout structure.',
      finish: '🏁 Final polish... friction removal, accessibility checks, hardening.',
      create: '🆕 Creating design from brief... reading your taste and building the page.',
      access: '♿ Running accessibility audit... WCAG compliance check.',
      responsive: '📱 Responsive review... checking breakpoints and layouts.',
      dark: '🌙 Dark mode... implementing and reviewing dark theme.',
      motion: '🎬 Motion audit... animation polish and performance.',
      tokens: '🔧 Extracting design tokens... building reusable token system.',
      review: '👁️ Full design review... structured feedback across all surfaces.',
    }
    const msg = designPrompts[modeId] || `🎨 Running ${modeId} mode...`
    addMessage({ id: Date.now().toString(), role: 'system', content: msg, timestamp: Date.now() })
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
      {showDesign && <DesignPartner onSelectMode={handleDesignMode} onClose={() => setShowDesign(false)} />}

      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeSession.messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center max-w-md">
              <div className="text-5xl mb-4 font-mono font-bold text-[#22D3EE]">ply&gt;</div>
              <p className="text-[#64748b]">Ask me anything about your codebase.<br />Type <code className="text-[#22D3EE]">/help</code> for commands or <code className="text-[#22D3EE]">/design</code> for design partner.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['/design', '/search', '/web', '/todo', '/checkpoint', '/share'].map(cmd => (
                  <button key={cmd} onClick={() => { setInput(cmd + ' '); inputRef.current?.focus() }} className="rounded-lg border border-[#1e293b] px-2.5 py-1.5 text-[10px] text-[#64748b] hover:border-[#22D3EE]/30 hover:text-[#22D3EE] transition-colors">{cmd}</button>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeSession.messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#e2e8f0]'
                : m.role === 'system' ? 'bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#e2e8f0]'
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
              <button key={c.cmd} onClick={() => { setInput(c.cmd + ' '); inputRef.current?.focus(); setShowCommands(false) }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-xs text-left hover:bg-[#1a1a35] transition-colors">
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
          <button onClick={handleSend} disabled={state.loading || !input.trim()}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-[#22D3EE] text-[#0a0a1a] transition-all hover:bg-[#2dd4f8] disabled:opacity-40">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
