import { useStore } from '../lib/store'

export default function StatusBar() {
  const { state, activeSession, addMessage } = useStore()

  const showDiagnostics = () => {
    if (!activeSession) return
    addMessage({
      id: Date.now().toString(), role: 'system', timestamp: Date.now(),
      content: `**Diagnostics**\n\n**Session:** ${activeSession.name}\n**Agent:** ${activeSession.agent}\n**Mode:** ${activeSession.mode}\n**Model:** ${activeSession.model}\n**Messages:** ${activeSession.messages.length}\n**Checkpoints:** ${activeSession.checkpoints.length}\n**Files indexed:** ${state.files.length}\n**Auto-accept:** ${activeSession.autoAccept ? 'ON' : 'OFF'}\n**Todos:** ${state.todos.filter(t => !t.done).length} pending`,
    })
  }

  return (
    <div className="flex h-6 items-center justify-between border-t border-[#1e293b] bg-[#0f0f24]/80 px-3 shrink-0">
      <div className="flex items-center gap-3 text-[10px] text-[#64748b]">
        {activeSession && (
          <>
            <span className="flex items-center gap-1">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${state.loading ? 'bg-[#22D3EE] animate-pulse' : 'bg-[#22a34a]'}`} />
              {activeSession.mode === 'plan' ? 'Plan' : 'Build'}
            </span>
            <span className="font-mono">{activeSession.model.split('/').pop()}</span>
            <span>{activeSession.messages.length} msgs</span>
            {activeSession.autoAccept && <span className="text-[#f59e0b]">YOLO</span>}
          </>
        )}
        <span>{state.files.length} files</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={showDiagnostics} className="text-[10px] text-[#64748b] hover:text-[#e2e8f0]" title="Diagnostics">📊</button>
      </div>
    </div>
  )
}
