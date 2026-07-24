const MODELS = [
  { name: 'DeepSeek V4 Pro', provider: 'OpenRouter', tag: 'Full mode', color: '#00e5ff' },
  { name: 'MiMo 2.5 Pro', provider: 'OpenRouter', tag: 'Full mode', color: '#00e5ff' },
  { name: 'Kimi K2.7 Code', provider: 'OpenRouter', tag: 'Full mode', color: '#00e5ff' },
  { name: 'Claude Sonnet 4', provider: 'Anthropic (Direct)', tag: 'New', color: '#9775fa' },
  { name: 'DeepSeek V4 Flash', provider: 'OpenRouter', tag: 'Fast', color: '#5c7cfa' },
  { name: 'MiniMax M3', provider: 'OpenRouter', tag: 'Full mode', color: '#00e5ff' },
  { name: 'DeepSeek Coder V2', provider: 'Ollama (Local)', tag: 'Local', color: '#fcc419' },
  { name: 'Qwen 2.5 Coder', provider: 'Ollama (Local)', tag: 'Local', color: '#fcc419' },
  { name: 'CodeLlama', provider: 'Ollama (Local)', tag: 'Local', color: '#fcc419' },
]

export default function Models() {
  return (
    <section id="models" className="relative py-16 sm:py-28 bg-[rgba(15,15,34,0.3)]">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative mx-auto max-w-[1100px] px-4 sm:px-8">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-18">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(92,124,250,0.12)] bg-[rgba(92,124,250,0.04)] px-3.5 py-1 text-xs font-medium text-[#5c7cfa] mb-4 sm:mb-5">
            Models
          </div>
          <h2 className="text-[1.65rem] sm:text-4xl md:text-5xl font-extrabold tracking-[-0.03em] text-[#e8e8f8]">
            Supported models
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-[520px] text-sm sm:text-lg text-[#5a5a8a] leading-relaxed">
            Choose from the best open-source and cloud models. Retry, fallback chains, direct Anthropic SDK.
          </p>
        </div>

        {/* Model grid */}
        <div className="grid gap-2.5 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[900px] mx-auto">
          {MODELS.map((m) => (
            <div key={m.name} className="group rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(10,10,28,0.6)] p-4 sm:p-5 text-center transition-all duration-300 hover:border-[rgba(255,255,255,0.08)] hover:bg-[rgba(10,10,28,0.8)]">
              <div className="font-mono text-[12px] sm:text-[13px] font-semibold text-[#c8c8e0] break-all">{m.name}</div>
              <div className="mt-1 text-[10px] sm:text-[11px] text-[#5a5a8a]">{m.provider}</div>
              <span className="mt-2 sm:mt-3 inline-block rounded-md px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider" style={{ color: m.color, background: `${m.color}10`, border: `1px solid ${m.color}15` }}>
                {m.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
