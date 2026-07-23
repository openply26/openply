import { useStore } from '../lib/store'

const AGENTS = [
  { id: 'planner', label: 'Planner', icon: '📋', desc: 'Read-only analysis & planning' },
  { id: 'editor', label: 'Editor', icon: '✏️', desc: 'Edit files & write code' },
  { id: 'explorer', label: 'Explorer', icon: '🔍', desc: 'Search & explore codebase' },
  { id: 'debugger', label: 'Debugger', icon: '🐛', desc: 'Find & fix bugs' },
  { id: 'reviewer', label: 'Reviewer', icon: '👁️', desc: 'Review & suggest improvements' },
]

export default function AgentBar() {
  const { state, dispatch, activeSession } = useStore()

  if (!activeSession) return null

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 border-b border-[#1e293b] bg-[#0f0f24]/50">
      {/* Plan/Build toggle */}
      <div className="flex rounded-lg border border-[#1e293b] overflow-hidden text-xs">
        <button
          onClick={() => dispatch({ type: 'SET_SESSION_FIELD', sessionId: activeSession.id, field: 'mode', value: 'plan' })}
          className={`px-3 py-1.5 transition-colors ${activeSession.mode === 'plan' ? 'bg-[#22D3EE]/20 text-[#22D3EE]' : 'text-[#64748b] hover:text-[#e2e8f0]'}`}
        >Plan</button>
        <button
          onClick={() => dispatch({ type: 'SET_SESSION_FIELD', sessionId: activeSession.id, field: 'mode', value: 'build' })}
          className={`px-3 py-1.5 transition-colors ${activeSession.mode === 'build' ? 'bg-[#22D3EE]/20 text-[#22D3EE]' : 'text-[#64748b] hover:text-[#e2e8f0]'}`}
        >Build</button>
      </div>

      <div className="w-px h-5 bg-[#1e293b]" />

      {/* Agent selector */}
      <div className="relative group">
        <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-[#94a3b8] hover:bg-[#1a1a35] hover:text-[#e2e8f0] transition-colors">
          <span>{AGENTS.find(a => a.id === activeSession.agent)?.icon || '🤖'}</span>
          <span>{AGENTS.find(a => a.id === activeSession.agent)?.label || activeSession.agent}</span>
          <span className="text-[8px] opacity-50">▼</span>
        </button>
        <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-[#1e293b] bg-[#0d0d20] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
          <div className="p-2 space-y-0.5">
            {AGENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => dispatch({ type: 'SET_SESSION_FIELD', sessionId: activeSession.id, field: 'agent', value: a.id })}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-left transition-colors ${
                  activeSession.agent === a.id ? 'bg-[#22D3EE]/10 text-[#22D3EE]' : 'text-[#94a3b8] hover:bg-[#1a1a35] hover:text-[#e2e8f0]'
                }`}
              >
                <span>{a.icon}</span>
                <div><div className="font-medium">{a.label}</div><div className="text-[10px] opacity-60">{a.desc}</div></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* Model display */}
      <span className="text-[10px] text-[#64748b] font-mono">{activeSession.model.split('/').pop()}</span>
      {activeSession.mode === 'plan' && <span className="rounded border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-2 py-0.5 text-[10px] text-[#f59e0b]">Read-only</span>}
    </div>
  )
}
