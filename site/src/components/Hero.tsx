import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="pt-36 pb-24 text-center bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,211,238,0.06)_0%,transparent_60%)]">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(34,211,238,0.2)] bg-[rgba(34,211,238,0.08)] px-4 py-1.5 text-sm font-medium text-[#22D3EE]">
          <span className="h-2 w-2 rounded-full bg-[#22D3EE]" />
          v0.2.0 &mdash; Now with Web IDE &middot; Design Partner &middot; Multi-session
        </div>
        <h1 className="text-5xl font-extrabold leading-[1.1] tracking-[-2px] md:text-7xl">
          Code with AI.<br />
          <span className="bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] bg-clip-text text-transparent">
            Your code stays yours.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-[640px] text-lg text-[#94a3b8] md:text-xl">
          openPly is a free, open-source AI coding assistant with a full web IDE.
          Multi-session, multi-agent, design partner, terminal, file editor — all free.
          No subscription. No data collection.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="flex h-[48px] items-center rounded-xl bg-linear-135 from-[#06B6D4] to-[#3B82F6] px-8 text-base font-semibold text-white shadow-[0_8px_24px_rgba(59,130,246,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(59,130,246,0.35)] hover:brightness-110 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22D3EE]"
          >
            npm install -g openply
          </a>
          <Link
            to="/app"
            className="flex h-[48px] items-center rounded-xl border border-[rgba(34,211,238,0.3)] bg-[rgba(34,211,238,0.06)] px-8 text-base font-semibold text-[#22D3EE] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(34,211,238,0.12)] hover:shadow-[0_8px_24px_rgba(34,211,238,0.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22D3EE]"
          >
            Open Web App &rarr;
          </Link>
          <a
            href="https://github.com/openply26/openply"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[48px] items-center rounded-xl border border-[#1e293b] bg-transparent px-8 text-base font-semibold text-[#e2e8f0] transition-all duration-200 hover:border-[#22D3EE] hover:text-[#22D3EE] hover:bg-[rgba(34,211,238,0.04)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22D3EE]"
          >
            View on GitHub &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}
