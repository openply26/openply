import { useState } from 'react'
import { useStore } from '../lib/store'

export default function ToolBar() {
  const { state, dispatch, searchCode, webSearch, activeSession, addMessage } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [webQuery, setWebQuery] = useState('')
  const [todoText, setTodoText] = useState('')
  const [activeTool, setActiveTool] = useState<'search' | 'web' | 'todo' | null>(null)

  const addTodo = () => {
    if (!todoText.trim()) return
    dispatch({ type: 'ADD_TODO', todo: { id: Date.now().toString(), text: todoText.trim(), done: false } })
    setTodoText('')
  }

  return (
    <div className="border-b border-[#1e293b] bg-[#0f0f24]/30">
      {/* Tool buttons */}
      <div className="flex items-center gap-1 px-3 py-1.5">
        <button onClick={() => setActiveTool(activeTool === 'search' ? null : 'search')} className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${activeTool === 'search' ? 'bg-[#22D3EE]/20 text-[#22D3EE]' : 'text-[#64748b] hover:bg-[#1a1a35] hover:text-[#e2e8f0]'}`}>🔍 Search</button>
        <button onClick={() => setActiveTool(activeTool === 'web' ? null : 'web')} className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${activeTool === 'web' ? 'bg-[#22D3EE]/20 text-[#22D3EE]' : 'text-[#64748b] hover:bg-[#1a1a35] hover:text-[#e2e8f0]'}`}>🌐 Web</button>
        <button onClick={() => setActiveTool(activeTool === 'todo' ? null : 'todo')} className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${activeTool === 'todo' ? 'bg-[#22D3EE]/20 text-[#22D3EE]' : 'text-[#64748b] hover:bg-[#1a1a35] hover:text-[#e2e8f0]'}`}>📋 Todo</button>
        <div className="flex-1" />
        <button onClick={() => addMessage({ id: Date.now().toString(), role: 'system', content: '**Keyboard Shortcuts:**\n\n- `Esc` — Rewind last message\n- `Ctrl+K` — Clear chat\n- `Ctrl+Shift+P` — Toggle Plan/Build\n- `Ctrl+Enter` — Send (with newline)\n- `/` — Open slash commands\n- `Tab` — Autocomplete command\n\n**Slash Commands:**\n`/help`, `/clear`, `/model`, `/agent`, `/mode`, `/checkpoint`, `/undo`, `/search`, `/web`, `/design`, `/share`, `/export`', timestamp: Date.now() })} className="text-[10px] text-[#64748b] hover:text-[#e2e8f0]">⌨️ Shortcuts</button>
      </div>

      {/* Active tool panel */}
      {activeTool === 'search' && (
        <div className="border-t border-[#1e293b] px-3 py-2">
          <div className="flex gap-2">
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) { searchCode(searchQuery.trim()) } }} placeholder="Search code (grep)..." className="flex-1 rounded-lg border border-[#1e293b] bg-[#0a0a1a] px-3 py-1.5 text-xs text-[#e2e8f0] placeholder-[#64748b] outline-none focus:border-[#22D3EE]" />
            <button onClick={() => searchQuery.trim() && searchCode(searchQuery.trim())} className="rounded-lg bg-[#22D3EE]/20 px-3 py-1.5 text-xs text-[#22D3EE] hover:bg-[#22D3EE]/30">Search</button>
          </div>
        </div>
      )}

      {activeTool === 'web' && (
        <div className="border-t border-[#1e293b] px-3 py-2">
          <div className="flex gap-2">
            <input value={webQuery} onChange={e => setWebQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && webQuery.trim()) { webSearch(webQuery.trim()) } }} placeholder="Search the web..." className="flex-1 rounded-lg border border-[#1e293b] bg-[#0a0a1a] px-3 py-1.5 text-xs text-[#e2e8f0] placeholder-[#64748b] outline-none focus:border-[#22D3EE]" />
            <button onClick={() => webQuery.trim() && webSearch(webQuery.trim())} className="rounded-lg bg-[#22D3EE]/20 px-3 py-1.5 text-xs text-[#22D3EE] hover:bg-[#22D3EE]/30">Search</button>
          </div>
        </div>
      )}

      {activeTool === 'todo' && (
        <div className="border-t border-[#1e293b] px-3 py-2">
          <div className="flex gap-2 mb-2">
            <input value={todoText} onChange={e => setTodoText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addTodo() }} placeholder="Add a task..." className="flex-1 rounded-lg border border-[#1e293b] bg-[#0a0a1a] px-3 py-1.5 text-xs text-[#e2e8f0] placeholder-[#64748b] outline-none focus:border-[#22D3EE]" />
            <button onClick={addTodo} className="rounded-lg bg-[#22D3EE]/20 px-3 py-1.5 text-xs text-[#22D3EE]">Add</button>
          </div>
          {state.todos.length > 0 && (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {state.todos.map(t => (
                <div key={t.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={t.done} onChange={() => dispatch({ type: 'TOGGLE_TODO', id: t.id })} className="accent-[#22D3EE]" />
                  <span className={`text-xs ${t.done ? 'line-through text-[#4a5568]' : 'text-[#94a3b8]'}`}>{t.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
