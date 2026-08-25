import { useStore } from '../lib/store'

export default function ProviderConfig() {
  const { state } = useStore()
  const configured = state.healthInfo?.openrouterConfigured

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">AI Provider</h3>

      <div className="rounded-lg border border-[#1e293b] bg-[#0f0f24] p-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-[#94a3b8]">OpenRouter (server-side)</h4>
          <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${
            state.backend === 'offline' ? 'bg-[#64748b]/20 text-[#64748b]' :
            configured ? 'bg-[#4ade80]/15 text-[#4ade80]' : 'bg-[#fbbf24]/15 text-[#fbbf24]'
          }`}>
            {state.backend === 'offline' ? 'OFFLINE' : configured ? 'READY' : 'NOT CONFIGURED'}
          </span>
        </div>
        <p className="mt-1.5 text-[10px] leading-relaxed text-[#64748b]">
          The API key lives only in the backend environment (Render env vars).
          Nothing is stored in your browser — openPly never sees or stores keys client-side.
        </p>
      </div>

      <div className="rounded-lg border border-[#1e293b] bg-[#0f0f24] p-3">
        <h4 className="text-xs font-semibold text-[#94a3b8] mb-1">Ollama (Local)</h4>
        <p className="text-[10px] text-[#64748b]">Pick an <span className="font-mono">ollama/</span> model from the model picker for fully local inference. Make sure Ollama is running on port 11434.</p>
      </div>

      <div className="rounded-lg border border-[#1e293b] bg-[#0f0f24] p-3">
        <h4 className="text-xs font-semibold text-[#94a3b8] mb-1">Model catalog</h4>
        <p className="text-[10px] text-[#64748b]">
          {state.modelsLive
            ? `${state.models.length} models fetched live from OpenRouter. Free models (like Ox Alpha) are marked FREE.`
            : 'Using built-in fallback list — backend could not reach OpenRouter.'}
        </p>
      </div>
    </div>
  )
}
