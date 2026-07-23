const STEPS = [
  { icon: '🔍', title: 'Explore', desc: 'Search your codebase with grep, browse files in the tree view, read code in the viewer, or search the web — all from one interface.' },
  { icon: '📋', title: 'Plan', desc: 'Switch to Plan mode for read-only analysis. The agent explores your codebase, understands architecture, and creates a strategy without making changes.' },
  { icon: '✏️', title: 'Build', desc: 'Switch to Build mode with auto-accept for speed. The agent edits files, runs terminal commands, and creates new code — with checkpoints saved automatically.' },
  { icon: '🎨', title: 'Design', desc: 'Launch the Design Partner with 17 modes — audit, recolor, redesign, accessibility, dark mode, motion, tokens, and more. Full design system management.' },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 bg-[#0f0f24]">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="text-center text-4xl font-extrabold tracking-[-1px]">How it works</h2>
        <p className="mx-auto mt-4 mb-14 max-w-[600px] text-center text-lg text-[#94a3b8]">
          Explore, plan, build, and design — all in your browser or terminal.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative rounded-xl border border-[#1e293b] bg-[#0a0a1a] px-6 pt-10 pb-8 text-center">
              <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-[#22D3EE] text-xs font-bold text-[#0a0a1a]">
                {i + 1}
              </span>
              <div className="mb-3 text-3xl">{s.icon}</div>
              <h3 className="text-base font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-[#94a3b8]">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#0d0d20] px-5 py-3 font-mono text-sm">
            <span className="text-[#64748b]">$</span>
            <span className="text-[#22D3EE]">npm install -g openply</span>
          </div>
          <p className="mt-3 text-sm text-[#64748b]">Then run <code className="text-[#22D3EE]">openply</code> in terminal or open <a href="/app" className="text-[#22D3EE] underline">web app</a></p>
        </div>
      </div>
    </section>
  )
}
