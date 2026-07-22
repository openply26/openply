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
    <section className="py-20 bg-[#0f0f24]">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="text-center text-4xl font-extrabold tracking-[-1px]">Compare</h2>
        <p className="mx-auto mt-4 mb-14 max-w-[600px] text-center text-lg text-[#94a3b8]">
          See how openPly stacks up against the alternatives.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`rounded-xl border p-8 text-center ${
                p.featured
                  ? 'border-[#22D3EE] shadow-[0_0_30px_rgba(34,211,238,0.08)]'
                  : 'border-[#1e293b] bg-[#0a0a1a]'
              } ${p.featured ? 'bg-[#0f0f24]' : ''} ${p.featured ? 'scale-[1.02]' : ''}`}
            >
              <h3 className="text-xl font-bold">{p.name}</h3>
              <div className="mt-3 mb-5 font-mono text-4xl font-extrabold text-[#22D3EE]">
                {p.price}
                <span className="text-sm font-normal text-[#64748b]"> {p.period}</span>
              </div>
              <ul className="space-y-3 text-left">
                {p.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#94a3b8]">
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
