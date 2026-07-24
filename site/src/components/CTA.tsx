import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[800px] h-[200px] sm:h-[400px] bg-[radial-gradient(ellipse,rgba(0,229,255,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative mx-auto max-w-[1100px] px-5 sm:px-8 text-center">
        <h2 className="text-[1.65rem] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-[#e8e8f8]">
          Start coding with AI.
          <br />
          <span className="gradient-text">For free. Forever.</span>
        </h2>
        <p className="mx-auto mt-4 text-base sm:text-lg text-[#5a5a8a] max-w-[400px]">
          No sign-up. No credit card. Just your terminal.
        </p>

        {/* Install command */}
        <div className="mx-auto mt-8 inline-flex items-center gap-2.5 sm:gap-3 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,28,0.8)] px-4 sm:px-8 py-3 sm:py-3.5 font-mono text-[13px] sm:text-base overflow-x-auto max-w-full">
          <span className="text-[#5a5a8a]">$</span>
          <span className="text-[#00e5ff] whitespace-nowrap">npm install -g openply</span>
        </div>

        {/* Quick commands */}
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] sm:text-[13px] text-[#5a5a8a]">
          <span className="flex items-center gap-1.5">
            <span className="text-[#00e5ff]">→</span>
            <code className="text-[#8888b0]">openply web</code> for web IDE
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#00e5ff]">→</span>
            <code className="text-[#8888b0]">openply exec "task"</code> for CI/CD
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#00e5ff]">→</span>
            <code className="text-[#8888b0]">openply mcp</code> for MCP server
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
          <Link
            to="/app"
            className="group relative flex h-[48px] sm:h-[56px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#00e5ff] to-[#5c7cfa] px-6 sm:px-10 text-[13px] sm:text-base font-semibold text-[#06060e] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,229,255,0.25)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Open Web App
            <svg className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
          <a
            href="https://github.com/openply26/openply"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[48px] sm:h-[56px] items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,28,0.6)] px-6 sm:px-10 text-[13px] sm:text-base font-semibold text-[#8888b0] transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] hover:text-[#c8c8e0] hover:bg-[rgba(10,10,28,0.8)] hover:scale-[1.02] active:scale-[0.98]"
          >
            GitHub
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </a>
        </div>
      </div>
    </section>
  )
}
