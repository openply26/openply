const PLANS = [
  {
    name: 'Claude Code',
    price: '$20',
    period: '/mo',
    featured: false,
    items: ['Proprietary model', 'Cloud only', 'Data used for training', 'Single agent'],
  },
  {
    name: 'openPly',
    price: '$0',
    period: '/mo',
    featured: true,
    items: ['Open-source models', 'Local-first (Ollama)', 'No data collection', 'Multi-agent mesh', 'Custom agents', 'Web app builder'],
  },
  {
    name: 'Cline',
    price: 'Free',
    period: '+ API costs',
    featured: false,
    items: ['VS Code only', 'Single model per task', 'No local mode', 'Requires API key'],
  },
]

export default function Compare() {
  return (
    <section className="py-16 sm:py-20 bg-[#0f0f24]">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[-0.5px] sm:tracking-[-1px]">Compare</h2>
        <p className="mx-auto mt-3 sm:mt-4 mb-10 sm:mb-14 max-w-[600px] text-center text-sm sm:text-base md:text-lg text-[#94a3b8]">
          See how openPly stacks up against the alternatives.
        </p>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3 items-start">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`rounded-xl border p-5 sm:p-8 text-center ${
                p.featured
                  ? 'border-[#22D3EE] shadow-[0_0_30px_rgba(34,211,238,0.08)] scale-[1.02] md:scale-[1.02]'
                  : 'border-[#1e293b] bg-[#0a0a1a]'
              } ${p.featured ? 'bg-[#0f0f24]' : ''}`}
            >
              <h3 className="text-lg sm:text-xl font-bold">{p.name}</h3>
              <div className="mt-2 sm:mt-3 mb-4 sm:mb-5 font-mono text-3xl sm:text-4xl font-extrabold text-[#22D3EE]">
                {p.price}
                <span className="text-sm font-normal text-[#64748b]"> {p.period}</span>
              </div>
              <ul className="space-y-2 sm:space-y-3 text-left">
                {p.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs sm:text-sm text-[#94a3b8]">
                    <span className="text-[#22c55e] font-bold">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
