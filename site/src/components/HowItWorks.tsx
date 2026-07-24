const STEPS = [
  { num: '01', color: '#00e5ff', title: 'Explore', desc: 'Search your codebase with grep, browse files, read code, or search the web. Pipe input from any command.' },
  { num: '02', color: '#5c7cfa', title: 'Plan', desc: 'Switch to Plan mode for read-only analysis. The agent explores, understands architecture, creates a strategy.' },
  { num: '03', color: '#9775fa', title: 'Build', desc: 'Switch to Build mode. Function calling for reliable execution. Edit files, run commands. Checkpoints auto-saved.' },
  { num: '04', color: '#51cf66', title: 'Design', desc: 'Launch the Design Partner with 17 modes. Full design system management. Then share, export, or deploy.' },
]

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-20 sm:py-28 bg-[rgba(15,15,34,0.3)]">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="relative mx-auto max-w-[1100px] px-5 sm:px-8">
        {/* Section header */}
        <div className="text-center mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(92,124,250,0.12)] bg-[rgba(92,124,250,0.04)] px-3.5 py-1 text-xs font-medium text-[#5c7cfa] mb-5">
            How it works
          </div>
          <h2 className="text-[1.65rem] sm:text-4xl md:text-5xl font-extrabold tracking-[-0.03em] text-[#e8e8f8]">
            From idea to production
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-base sm:text-lg text-[#5a5a8a] leading-relaxed">
            Explore, plan, build, and design — all in your browser or terminal.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="group relative rounded-xl sm:rounded-2xl border border-[rgba(255,255,255,0.04)] bg-[rgba(10,10,28,0.6)] p-5 sm:p-7 text-center transition-all duration-500 hover:border-[rgba(255,255,255,0.08)] hover:bg-[rgba(10,10,28,0.8)]">
              {/* Number */}
              <div className="mx-auto mb-3 sm:mb-5 flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-xl font-mono text-xs sm:text-sm font-bold" style={{ color: s.color, background: `${s.color}10`, border: `1px solid ${s.color}20` }}>
                {s.num}
              </div>
              <h3 className="text-[15px] sm:text-base font-semibold text-[#e8e8f8] tracking-[-0.01em]">{s.title}</h3>
              <p className="mt-1.5 sm:mt-2 text-[12px] sm:text-[13px] leading-relaxed text-[#5a5a8a]">{s.desc}</p>

              {/* Connecting line (desktop only) */}
              {i < 3 && (
                <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-gradient-to-r from-[rgba(255,255,255,0.06)] to-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* Quick start */}
        <div className="mt-12 sm:mt-18 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 max-w-[640px] mx-auto">
          <div className="rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(10,10,28,0.6)] p-4 sm:p-5 text-center sm:text-left">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#5a5a8a] mb-2.5 sm:mb-3">CLI</div>
            <div className="font-mono text-[12px] sm:text-[13px] space-y-1 overflow-x-auto inline-block text-left">
              <div className="whitespace-nowrap"><span className="text-[#5a5a8a]">$</span> <span className="text-[#00e5ff]">npm install -g openply</span></div>
              <div className="whitespace-nowrap"><span className="text-[#5a5a8a]">$</span> <span className="text-[#8888b0]">cat file.ts | openply &quot;explain&quot;</span></div>
            </div>
          </div>
          <div className="rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(10,10,28,0.6)] p-4 sm:p-5 text-center sm:text-left">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#5a5a8a] mb-2.5 sm:mb-3">Web App</div>
            <div className="font-mono text-[12px] sm:text-[13px] space-y-1 overflow-x-auto inline-block text-left">
              <div className="whitespace-nowrap"><span className="text-[#5a5a8a]">$</span> <span className="text-[#00e5ff]">openply web</span></div>
              <div className="whitespace-nowrap"><span className="text-[#5a5a8a]">or</span> <span className="text-[#8888b0]">openply.pages.dev/app</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
