import { BarChart3 } from 'lucide-react'
import { useStore } from '../lib/store'

function fmtCost(cost: number): string {
  if (cost === 0) return '$0'
  if (cost < 0.0001) return '<$0.0001'
  return `$${cost.toFixed(4)}`
}

export default function StatusBar() {
  const { state, activeSession, addMessage } = useStore()

  const showDiagnostics = () => {
    if (!activeSession) return
    addMessage({
      role: 'system',
      content: `**Diagnostics**\n\n**Session:** ${activeSession.name}\n**Agent:** ${activeSession.agent}\n**Mode:** ${activeSession.mode}\n**Model:** ${activeSession.model}\n**Messages:** ${activeSession.messages.length}\n**Checkpoints:** ${activeSession.checkpoints.length}\n**Files indexed:** ${state.files.length}\n**Auto-accept:** ${activeSession.autoAccept ? 'ON' : 'OFF'}\n**Backend:** ${state.backend}\n**Catalog:** ${state.modelsStatus} (${state.modelCatalog.length} models${state.modelsLive ? ', live' : ', fallback'})\n**Usage:** ${activeSession.usage.promptTokens} in · ${activeSession.usage.completionTokens} out · ${fmtCost(activeSession.usage.cost)}`,
    })
  }

  const totalTokens = activeSession ? activeSession.usage.promptTokens + activeSession.usage.completionTokens : 0

  return (
    <div className="flex h-6 shrink-0 items-center justify-between border-t border-border bg-surface px-3 font-mono text-[10px] text-faint">
      <div className="flex items-center gap-3">
        {activeSession && (
          <>
            <span className="flex items-center gap-1.5">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${state.loading ? 'animate-pulse bg-accent' : 'bg-success'}`} />
              {activeSession.mode === 'plan' ? 'plan' : 'build'}
            </span>
            <span className="hidden xs:inline">{activeSession.model.split('/').pop()}</span>
            <span className="hidden sm:inline">{activeSession.messages.length} msgs</span>
            {activeSession.autoAccept && <span className="text-warn">yolo</span>}
          </>
        )}
        <span>{state.files.length} files</span>
      </div>
      <div className="flex items-center gap-3">
        {activeSession && totalTokens > 0 && (
          <span title={`${activeSession.usage.promptTokens} in · ${activeSession.usage.completionTokens} out`}>
            {(totalTokens / 1000).toFixed(1)}k tok · {fmtCost(activeSession.usage.cost)}
          </span>
        )}
        <span className={state.backend === 'online' ? 'text-success' : 'text-danger'}>{state.backend}</span>
        <button onClick={showDiagnostics} className="flex items-center gap-1 text-faint transition-colors hover:text-text" title="Diagnostics">
          <BarChart3 size={11} />
        </button>
      </div>
    </div>
  )
}
