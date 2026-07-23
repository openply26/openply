const STEPS = [
  { icon: '🔍', title: 'Explore', desc: 'Search your codebase with grep, browse files in the tree view, read code in the viewer, or search the web — all from one interface.' },
  { icon: '📋', title: 'Plan', desc: 'Switch to Plan mode for read-only analysis. The agent explores your codebase, understands architecture, and creates a strategy without making changes.' },
  { icon: '✏️', title: 'Build', desc: 'Switch to Build mode with auto-accept for speed. The agent edits files, runs terminal commands, and creates new code — with checkpoints saved automatically.' },
  { icon: '🎨', title: 'Design', desc: 'Launch the Design Partner with 17 modes — audit, recolor, redesign, accessibility, dark mode, motion, tokens, and more. Full design system management.' },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-16 sm:py-20 bg-[#0f0f24]">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[-0.5px] sm:tracking-[-1px]">How it works</h2>
        <p className="mx-auto mt-3 sm:mt-4 mb-10 sm:mb-14 max-w-[600px] text-center text-sm sm:text-base md:text-lg text-[#94a3b8]">
          Explore, plan, build, and design — all in your browser or terminal.
        </p>
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative rounded-xl border border-[#1e293b] bg-[#0a0a1a] px-5 sm:px-6 pt-8 sm:pt-10 pb-6 sm:pb-8 text-center">
              <span className="absolute -top-3 left-1/2 flex h-6 w-6 sm:h-7 sm:w-7 -translate-x-1/2 items-center justify-center rounded-full bg-[#22D3EE] text-[10px] sm:text-xs font-bold text-[#0a0a1a]">
                {i + 1}
              </span>
              <div className="mb-2 sm:mb-3 text-2xl sm:text-3xl">{s.icon}</div>
              <h3 className="text-sm sm:text-base font-bold">{s.title}</h3>
              <p className="mt-1 text-xs sm:text-sm text-[#94a3b8]">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 sm:mt-12 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#0d0d20] px-4 sm:px-5 py-2.5 sm:py-3 font-mono text-xs sm:text-sm overflow-x-auto max-w-full">
            <span className="text-[#64748b]">$</span>
            <span className="text-[#22D3EE] whitespace-nowrap">npm install -g openply</span>
          </div>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-[#64748b]">
            Then run <code className="text-[#22D3EE]">openply</code> in terminal or open <a href="/app" className="text-[#22D3EE] underline">web app</a>
          </p>
        </div>
      </div>
    </section>
  )
}
