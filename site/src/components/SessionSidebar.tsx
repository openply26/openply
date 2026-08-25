import { useState } from 'react'
import { MessageSquare, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useStore } from '../lib/store'
import type { SidebarTab } from '../pages/AppPage'
import FileTree from './FileTree'
import ConfirmDialog from './ConfirmDialog'

interface Props {
  tab: SidebarTab
  onTabChange: (tab: SidebarTab) => void
  onClose?: () => void
}

export default function SessionSidebar({ tab, onTabChange, onClose }: Props) {
  const { state, dispatch, activeSession, createSession, deleteSession, renameSession } = useStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const startRename = (s: { id: string; name: string }) => {
    setEditingId(s.id)
    setEditName(s.name)
  }

  const submitRename = () => {
    if (editingId && editName.trim()) renameSession(editingId, editName.trim())
    setEditingId(null)
  }

  const deletingSession = state.sessions.find(s => s.id === deletingId)

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center border-b border-border">
        {(['sessions', 'files'] as const).map(t => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={`flex-1 border-b-2 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
              tab === t ? 'border-accent text-accent' : 'border-transparent text-faint hover:text-muted'
            }`}
          >
            {t}
          </button>
        ))}
        {onClose && (
          <button onClick={onClose} className="px-2 text-faint hover:text-text" aria-label="Close sidebar">
            <X size={14} />
          </button>
        )}
      </div>

      {tab === 'sessions' ? (
        <>
          <div className="shrink-0 p-2">
            <button
              onClick={createSession}
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-elevated px-3 py-1.5 text-[11px] text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Plus size={12} /> New session
            </button>
          </div>
          <div className="flex-1 space-y-0.5 overflow-y-auto p-2 pt-0">
            {state.sessions.length === 0 && (
              <p className="px-2 py-4 text-center text-[10px] text-faint">No sessions yet</p>
            )}
            {state.sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => { dispatch({ type: 'SET_ACTIVE_SESSION', id: s.id }); onClose?.() }}
                className={`group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[11px] transition-colors ${
                  s.id === state.activeSessionId ? 'bg-elevated text-accent' : 'text-muted hover:bg-elevated/60 hover:text-text'
                }`}
              >
                <MessageSquare size={11} className="shrink-0 opacity-60" />
                {editingId === s.id ? (
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={submitRename}
                    onKeyDown={(e) => { if (e.key === 'Enter') submitRename(); if (e.key === 'Escape') setEditingId(null) }}
                    className="min-w-0 flex-1 border-b border-accent/50 bg-transparent text-text outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="min-w-0 flex-1 truncate">{s.name}</span>
                )}
                <span className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
                  <button
                    onClick={(e) => { e.stopPropagation(); startRename(s) }}
                    className="rounded p-0.5 text-faint hover:text-text"
                    aria-label={`Rename ${s.name}`}
                  >
                    <Pencil size={11} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeletingId(s.id) }}
                    className="rounded p-0.5 text-faint hover:text-danger"
                    aria-label={`Delete ${s.name}`}
                  >
                    <Trash2 size={11} />
                  </button>
                </span>
              </div>
            ))}
          </div>
          {activeSession && (
            <div className="shrink-0 border-t border-border px-3 py-2 font-mono text-[9px] leading-relaxed text-faint">
              {activeSession.checkpoints.length} checkpoints · {activeSession.todos.filter(t => !t.done).length} todos
            </div>
          )}
        </>
      ) : (
        <div className="min-h-0 flex-1 overflow-hidden">
          <FileTree
            files={state.files}
            status={state.filesStatus}
            activeFile={state.activeFile}
            onSelect={(path) => { dispatch({ type: 'SET_ACTIVE_FILE', path, content: null }); onClose?.() }}
          />
        </div>
      )}

      <ConfirmDialog
        open={deletingId !== null}
        title="Delete session?"
        message={`"${deletingSession?.name}" and its ${deletingSession?.messages.length ?? 0} messages will be permanently removed.`}
        onConfirm={() => { if (deletingId) deleteSession(deletingId); setDeletingId(null) }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  )
}
