import { useStore } from '../lib/store'

const FIELDS = [
  { key: 'openrouter' as const, label: 'OpenRouter', placeholder: 'sk-or-v1-...', doc: 'openrouter.ai/keys' },
  { key: 'openai' as const, label: 'OpenAI', placeholder: 'sk-...', doc: 'platform.openai.com/api-keys' },
  { key: 'anthropic' as const, label: 'Anthropic', placeholder: 'sk-ant-...', doc: 'console.anthropic.com/settings/keys' },
]

export default function ProviderConfig() {
  const { state, dispatch } = useStore()

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Providers</h3>
      {FIELDS.map(({ key, label, placeholder, doc }) => (
        <div key={key}>
          <label className="mb-1 flex items-center justify-between text-xs text-[#94a3b8]">
            <span>{label} API Key</span>
            <a href={`https://${doc}`} target="_blank" rel="noopener noreferrer" className="text-[#22D3EE] hover:underline">get key</a>
          </label>
          <input
            type="password"
            value={state.providers[key]}
            onChange={(e) => dispatch({ type: 'SET_PROVIDER', key, value: e.target.value })}
            placeholder={placeholder}
            className="w-full rounded-lg border border-[#1e293b] bg-[#0a0a1a] px-3 py-2 text-sm text-[#e2e8f0] placeholder-[#64748b] outline-none focus:border-[#22D3EE]"
          />
        </div>
      ))}

      <div className="rounded-lg border border-[#1e293b] bg-[#0f0f24] p-3">
        <h4 className="text-xs font-semibold text-[#94a3b8] mb-1">Ollama (Local)</h4>
        <p className="text-[10px] text-[#64748b]">Select an Ollama model from Settings → Model for local inference. Make sure Ollama is running on port 11434.</p>
      </div>

      <div className="rounded-lg border border-[#1e293b] bg-[#0f0f24] p-3">
        <h4 className="text-xs font-semibold text-[#94a3b8] mb-1">About API Keys</h4>
        <p className="text-[10px] text-[#64748b]">Keys are stored in your browser's localStorage and sent directly to the provider. openPly never sees your keys.</p>
      </div>
    </div>
  )
}
