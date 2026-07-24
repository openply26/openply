export default function TerminalDemo() {
  return (
    <section className="relative flex justify-center px-5 sm:px-8 -mt-6 sm:-mt-8 mb-16 sm:mb-24">
      {/* Ambient glow behind terminal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(0,229,255,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[680px] overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0a0a1c]/90 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.6),0_0_1px_rgba(0,229,255,0.1)]">
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)] px-4 sm:px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57] opacity-80" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e] opacity-80" />
            <span className="h-3 w-3 rounded-full bg-[#28c840] opacity-80" />
          </div>
          <div className="flex-1 text-center">
            <span className="font-mono text-[11px] text-[#5a5a8a]">openply v0.3.0</span>
          </div>
          <div className="w-[52px]" />
        </div>

        {/* Terminal content */}
        <div className="p-4 sm:p-6 font-mono text-[12px] sm:text-[13px] leading-[1.7] space-y-1">
          {/* Line 1: user input */}
          <div>
            <span className="text-[#5a5a8a]">❯ </span>
            <span className="text-[#c8c8e0]">add rate limiting to all API endpoints</span>
          </div>

          {/* Line 2-3: agent thinking */}
          <div className="text-[#5a5a8a]">Analyzing codebase...</div>
          <div className="text-[#5a5a8a]">
            Plan: Found <span className="text-[#00e5ff]">3 API route files</span>. Adding express-rate-limit middleware.
          </div>

          {/* Diff lines */}
          <div className="mt-1 space-y-0">
            <div className="text-[#51cf66]">+ const rateLimit = require(&apos;express-rate-limit&apos;);</div>
            <div className="text-[#51cf66]">+ const limiter = rateLimit(&#123; windowMs: 15*60*1000, max: 100 &#125;);</div>
            <div className="text-[#ff6b6b]">- app.use(&apos;/api&apos;, router);</div>
            <div className="text-[#51cf66]">+ app.use(&apos;/api&apos;, limiter, router);</div>
          </div>

          {/* Success */}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[#51cf66]">✓</span>
            <span className="text-[#c8c8e0]">Edited src/routes/api.js</span>
            <span className="text-[#5a5a8a]">(review passed)</span>
          </div>

          {/* Separator */}
          <div className="my-2 h-px bg-[rgba(255,255,255,0.04)]" />

          {/* Pipe example */}
          <div>
            <span className="text-[#5a5a8a]">$ </span>
            <span className="text-[#8888b0]">cat src/auth.ts | openply &quot;explain this&quot;</span>
          </div>
          <div className="text-[#8888b0]">This file implements JWT authentication with refresh tokens...</div>

          {/* Separator */}
          <div className="my-2 h-px bg-[rgba(255,255,255,0.04)]" />

          {/* Exec example */}
          <div>
            <span className="text-[#5a5a8a]">$ </span>
            <span className="text-[#8888b0]">openply exec &quot;fix the failing test&quot;</span>
          </div>
          <div className="text-[#51cf66]">✓ Test fixed. 1 file modified.</div>

          {/* Cursor */}
          <div className="mt-1">
            <span className="text-[#00e5ff]">❯ </span>
            <span className="inline-block h-4 w-[2px] bg-[#00e5ff] animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
