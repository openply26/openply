export default function CTA() {
  return (
    <section className="py-20 text-center bg-[radial-gradient(ellipse_at_50%_100%,rgba(34,211,238,0.05)_0%,transparent_60%)]">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="text-4xl font-extrabold tracking-[-1px] md:text-5xl">
          Start coding with AI.<br />For free. Forever.
        </h2>
        <p className="mx-auto mt-3 text-lg text-[#94a3b8]">
          No sign-up. No credit card. Just your terminal.
        </p>
        <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-lg border border-[#1e293b] bg-[#0d0d20] px-7 py-3.5 font-mono text-lg">
          <span className="text-[#64748b]">$</span>
          <span className="text-[#22D3EE]">npm install -g openply</span>
        </div>
        <div className="mt-3 text-sm text-[#64748b]">
          Then run <code className="text-[#22D3EE]">openply</code> in your project directory
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="flex h-[48px] items-center rounded-xl bg-linear-135 from-[#06B6D4] to-[#3B82F6] px-8 text-base font-semibold text-white shadow-[0_8px_24px_rgba(59,130,246,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(59,130,246,0.35)] hover:brightness-110 active:translate-y-0"
          >
            Get started
          </a>
          <a
            href="https://github.com/openply/openply"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[48px] items-center rounded-xl border border-[#1e293b] bg-transparent px-8 text-base font-semibold text-[#e2e8f0] transition-all duration-200 hover:border-[#22D3EE] hover:text-[#22D3EE] hover:bg-[rgba(34,211,238,0.04)] hover:-translate-y-0.5"
          >
            GitHub &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}
