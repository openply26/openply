const MODELS = [
  { name: 'DeepSeek V4 Pro', provider: 'OpenRouter', tag: 'Full mode', tagStyle: 'bg-[rgba(34,211,238,0.1)] text-[#22D3EE]' },
  { name: 'MiMo 2.5 Pro', provider: 'OpenRouter', tag: 'Full mode', tagStyle: 'bg-[rgba(34,211,238,0.1)] text-[#22D3EE]' },
  { name: 'Kimi K2.7 Code', provider: 'OpenRouter', tag: 'Full mode', tagStyle: 'bg-[rgba(34,211,238,0.1)] text-[#22D3EE]' },
  { name: 'DeepSeek V4 Flash', provider: 'OpenRouter', tag: 'Limited', tagStyle: 'bg-[rgba(34,211,238,0.1)] text-[#22D3EE]' },
  { name: 'MiMo 2.5', provider: 'OpenRouter', tag: 'Limited', tagStyle: 'bg-[rgba(34,211,238,0.1)] text-[#22D3EE]' },
  { name: 'MiniMax M3', provider: 'OpenRouter', tag: 'Full mode', tagStyle: 'bg-[rgba(34,211,238,0.1)] text-[#22D3EE]' },
  { name: 'DeepSeek Coder V2', provider: 'Ollama (Local)', tag: 'Local', tagStyle: 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]' },
  { name: 'Qwen 2.5 Coder', provider: 'Ollama (Local)', tag: 'Local', tagStyle: 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]' },
  { name: 'CodeLlama', provider: 'Ollama (Local)', tag: 'Local', tagStyle: 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]' },
]

export default function Models() {
  return (
    <section id="models" className="py-20">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="text-center text-4xl font-extrabold tracking-[-1px]">Supported models</h2>
        <p className="mx-auto mt-4 mb-14 max-w-[600px] text-center text-lg text-[#94a3b8]">
          Choose from the best open-source models. No proprietary lock-in.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODELS.map((m) => (
            <div key={m.name} className="rounded-lg border border-[#1e293b] bg-[#0f0f24] p-5 text-center">
              <div className="font-mono text-sm font-semibold">{m.name}</div>
              <div className="mt-1 text-xs text-[#64748b]">{m.provider}</div>
              <span className={`mt-3 inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${m.tagStyle}`}>
                {m.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
