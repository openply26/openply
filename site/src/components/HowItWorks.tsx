const STEPS = [
  { icon: '\u{1F50D}', title: 'File Finder', desc: 'Scans your project to understand architecture and find relevant files.' },
  { icon: '\u{1F4E4}', title: 'Planner', desc: 'Analyzes your request and creates an ordered plan of changes.' },
  { icon: '\u{270E}', title: 'Editor', desc: 'Makes precise edits with full diff output for every change.' },
  { icon: '\u{2705}', title: 'Reviewer', desc: 'Validates changes for bugs, edge cases, and code style before applying.' },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 bg-[#0f0f24]">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="text-center text-4xl font-extrabold tracking-[-1px]">How it works</h2>
        <p className="mx-auto mt-4 mb-14 max-w-[600px] text-center text-lg text-[#94a3b8]">
          Four specialized agents work together to understand, plan, edit, and validate your code.
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
      </div>
    </section>
  )
}
