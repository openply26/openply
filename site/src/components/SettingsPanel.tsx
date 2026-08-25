const CLOUD_MODELS = [
  'stealth/ox-alpha',
  'deepseek/deepseek-chat-v3-0324',
  'google/gemini-2.5-flash',
  'openai/gpt-4o-mini',
  'openai/gpt-4o',
  'anthropic/claude-3.5-sonnet',
  'meta-llama/llama-3.3-70b-instruct',
]

const LOCAL_MODELS = [
  'ollama/llama3.2', 'ollama/codellama', 'ollama/qwen2.5-coder',
  'ollama/deepseek-coder', 'ollama/mistral',
]

interface Props {
  model: string
  onModelChange: (m: string) => void
  apiKey: string
  onApiKeyChange: (k: string) => void
}

export default function SettingsPanel({ model, onModelChange, apiKey, onApiKeyChange }: Props) {
  const isLocal = model.startsWith('ollama/')

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Settings</h3>

      <div>
        <label className="mb-1 block text-xs text-[#94a3b8]">Model</label>
        <select
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full rounded-lg border border-[#1e293b] bg-[#0a0a1a] px-3 py-2 text-sm text-[#e2e8f0] outline-none focus:border-[#22D3EE]"
        >
          <optgroup label="Cloud (OpenRouter)">
            {CLOUD_MODELS.map((m) => (
              <option key={m} value={m}>{m.split('/').pop()}</option>
            ))}
          </optgroup>
          <optgroup label="Local (Ollama)">
            {LOCAL_MODELS.map((m) => (
              <option key={m} value={m}>{m.split('/').pop()}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {!isLocal && (
        <div>
          <label className="mb-1 block text-xs text-[#94a3b8]">OpenRouter API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="sk-..."
            className="w-full rounded-lg border border-[#1e293b] bg-[#0a0a1a] px-3 py-2 text-sm text-[#e2e8f0] placeholder-[#64748b] outline-none focus:border-[#22D3EE]"
          />
        </div>
      )}

      {isLocal && (
        <div className="rounded-lg border border-[#22D3EE]/20 bg-[#22D3EE]/5 p-3">
          <p className="text-xs text-[#22D3EE]">
            Using local Ollama model. Make sure Ollama is running on your machine.
          </p>
        </div>
      )}

      {!isLocal && (
        <div className="rounded-lg border border-[#1e293b] bg-[#0f0f24] p-3">
          <p className="text-xs text-[#64748b]">
            Cloud requests run through the openPly backend — the API key lives only in server environment variables, never in your browser.
          </p>
        </div>
      )}
    </div>
  )
}
