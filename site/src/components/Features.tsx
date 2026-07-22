const FEATURES = [
  { icon: '\u{1F512}', title: 'Local-first privacy', desc: 'Your code never leaves your machine. Runs on Ollama locally, or use cloud models. No training on your data, ever.' },
  { icon: '\u{2699}', title: 'Multi-agent mesh', desc: 'Not a single LLM call — a mesh of specialized agents (Planner, Editor, Reviewer) that collaborate on every task.' },
  { icon: '\u{0024}', title: 'Actually free', desc: 'No subscription, no credits, no API keys needed. Supported by unobtrusive text ads. Upgrade to Pro to remove them.' },
  { icon: '\u{1F4D1}', title: 'Knowledge files', desc: 'Drop a knowledge.md in your project root. openPly reads it for context on every request — no more repeating yourself.' },
  { icon: '\u{1F91D}', title: 'Custom agents', desc: 'Create your own agents in .agents/. Invoke them with @AgentName. Five built-in agents included.' },
  { icon: '\u{1F310}', title: 'Web app builder', desc: 'Describe an app and openPly generates it. Full-stack, production-ready, with live preview — from a single prompt.' },
]

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="text-center text-4xl font-extrabold tracking-[-1px]">Why developers choose openPly</h2>
        <p className="mx-auto mt-4 mb-14 max-w-[600px] text-center text-lg text-[#94a3b8]">
          Privacy-first, free, and built on a multi-agent architecture that understands your codebase.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="group rounded-xl border border-[#1e293b] bg-[#0f0f24] p-8 transition-all duration-200 hover:border-[#22D3EE] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(34,211,238,0.08)]">
              <div className="mb-4 text-3xl">{f.icon}</div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
