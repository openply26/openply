import { useState } from 'react'
import { useStore } from '../lib/store'

export default function SessionSidebar() {
  const { state, dispatch, activeSession, createSession, deleteSession, renameSession } = useStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const startRename = (s: { id: string; name: string }) => {
    setEditingId(s.id)
    setEditName(s.name)
  }

  const submitRename = () => {
    if (editingId && editName.trim()) renameSession(editingId, editName.trim())
    setEditingId(null)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#1e293b] p-3">
        <button onClick={createSession} className="flex w-full items-center gap-2 rounded-lg border border-[#1e293b] px-3 py-2 text-xs text-[#94a3b8] transition-colors hover:border-[#22D3EE] hover:text-[#22D3EE]">
          <span className="text-base leading-none">+</span> New Session
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {state.sessions.map((s) => (
          <div
            key={s.id}
            onClick={() => dispatch({ type: 'SET_ACTIVE_SESSION', id: s.id })}
            className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-xs cursor-pointer transition-colors ${
              s.id === state.activeSessionId
                ? 'bg-[#22D3EE]/10 text-[#22D3EE]'
                : 'text-[#64748b] hover:bg-[#1a1a35] hover:text-[#e2e8f0]'
            }`}
          >
            <span className="text-[10px] opacity-50">💬</span>
            {editingId === s.id ? (
              <input
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={submitRename}
                onKeyDown={(e) => { if (e.key === 'Enter') submitRename(); if (e.key === 'Escape') setEditingId(null) }}
                className="flex-1 bg-transparent outline-none border-b border-[#22D3EE]/50 text-[#e2e8f0]"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="flex-1 truncate">{s.name}</span>
            )}
            <div className="hidden group-hover:flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); startRename(s) }} className="text-[8px] px-1 hover:text-[#e2e8f0]">✎</button>
              <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete session?')) deleteSession(s.id) }} className="text-[8px] px-1 hover:text-[#ef4444]">×</button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-[#1e293b] p-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b] mb-2">Files</div>
        <div className="space-y-0.5 max-h-48 overflow-y-auto">
          {state.files.length === 0 && <p className="text-[10px] text-[#4a5568] italic">No files loaded</p>}
          {state.files.slice(0, 30).map((f) => (
            <button
              key={f}
              onClick={() => dispatch({ type: 'SET_ACTIVE_FILE', path: f, content: null })}
              className={`block w-full truncate rounded px-2 py-1 text-[11px] text-left transition-colors ${
                state.activeFile === f ? 'bg-[#22D3EE]/10 text-[#22D3EE]' : 'text-[#64748b] hover:bg-[#1a1a35] hover:text-[#e2e8f0]'
              }`}
            >📄 {f}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
