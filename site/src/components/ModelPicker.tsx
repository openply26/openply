import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../lib/store'
import type { ORModel } from '../lib/api'

function formatContext(ctx: number): string {
  if (!ctx) return ''
  if (ctx >= 1_000_000) return `${(ctx / 1_000_000).toFixed(ctx % 1_000_000 === 0 ? 0 : 1)}M`
  return `${Math.round(ctx / 1000)}k`
}

function formatPrice(perM: number): string {
  if (perM === 0) return 'free'
  if (perM < 0.01) return `$${perM.toFixed(3)}/M`
  return `$${perM.toFixed(2)}/M`
}

export default function ModelPicker() {
  const { state, dispatch, activeSession, refreshModels, toast } = useStore()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    const list = q
      ? state.models.filter(m => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q))
      : state.models
    return list.slice(0, 50)
  }, [state.models, query])

  if (!activeSession) return null

  const current = state.models.find(m => m.id === activeSession.model)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-[#1e293b] px-2.5 py-1.5 text-xs text-[#94a3b8] transition-colors hover:border-[#22D3EE]/40 hover:text-[#e2e8f0]"
        title="Switch model"
      >
        <span className="max-w-[140px] truncate font-mono">{activeSession.model}</span>
        {current?.free && <span className="rounded bg-[#4ade80]/15 px-1 text-[9px] font-semibold text-[#4ade80]">FREE</span>}
        <span className="text-[8px] opacity-50">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-[340px] rounded-xl border border-[#1e293b] bg-[#0d0d20] shadow-2xl">
          <div className="flex items-center gap-2 border-b border-[#1e293b] p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search models..."
              className="w-full rounded-lg bg-[#0a0a1a] px-3 py-1.5 text-xs text-[#e2e8f0] placeholder-[#64748b] outline-none"
            />
            <button
              onClick={() => refreshModels().then(() => toast(state.modelsLive ? 'Models refreshed' : 'Using fallback list', 'info'))}
              className="rounded-lg px-2 py-1.5 text-[10px] text-[#64748b] hover:text-[#22D3EE]"
              title="Refresh catalog"
            >
              ↻
            </button>
          </div>
          <div className="max-h-[320px] overflow-y-auto p-1.5">
            {filtered.length === 0 && (
              <div className="p-4 text-center text-xs text-[#64748b]">
                {state.models.length === 0 ? 'Loading catalog…' : 'No models match'}
              </div>
            )}
            {filtered.map((m: ORModel) => (
              <button
                key={m.id}
                onClick={() => {
                  dispatch({ type: 'SET_SESSION_FIELD', sessionId: activeSession.id, field: 'model', value: m.id })
                  setOpen(false)
                  setQuery('')
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition-colors ${
                  activeSession.model === m.id ? 'bg-[#22D3EE]/10' : 'hover:bg-[#1a1a35]'
                }`}
              >
                <div className="min-w-0">
                  <div className={`truncate text-xs font-medium ${activeSession.model === m.id ? 'text-[#22D3EE]' : 'text-[#e2e8f0]'}`}>{m.name}</div>
                  <div className="truncate text-[10px] text-[#64748b]">{m.id}</div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {m.context > 0 && <span className="text-[9px] text-[#64748b]">{formatContext(m.context)}</span>}
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${m.free ? 'bg-[#4ade80]/15 text-[#4ade80]' : 'bg-[#1a1a35] text-[#94a3b8]'}`}>
                    {m.free ? 'FREE' : formatPrice(m.promptPrice)}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-[#1e293b] px-3 py-1.5 text-[9px] text-[#64748b]">
            {state.modelsLive ? `● Live catalog — ${state.models.length} models` : '○ Offline fallback list'}
          </div>
        </div>
      )}
    </div>
  )
}
