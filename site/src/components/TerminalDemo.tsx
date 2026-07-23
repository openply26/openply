export default function TerminalDemo() {
  return (
    <div className="mx-4 sm:mx-6 -mt-8 sm:-mt-10 mb-14 sm:mb-20 max-w-[700px] overflow-hidden rounded-xl border border-[#1e293b] bg-[#0d0d20] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 border-b border-[#1e293b] bg-[#151530] px-3 sm:px-4 py-2.5 sm:py-3">
        <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ef4444]" />
        <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#eab308]" />
        <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#22c55e]" />
        <span className="ml-2 sm:ml-3 font-mono text-[10px] sm:text-xs text-[#64748b]">openply</span>
      </div>
      <div className="space-y-1.5 sm:space-y-2 p-3 sm:p-5 font-mono text-[11px] sm:text-sm leading-relaxed overflow-x-auto">
        <div><span className="text-[#22D3EE]">ply&gt; </span>add rate limiting to all API endpoints</div>
        <div className="text-[#94a3b8]">Analyzing request...</div>
        <div className="text-[#94a3b8]">Plan: Found 3 API route files. Adding <span className="text-[#22D3EE]">express-rate-limit</span> middleware.</div>
        <div className="text-[#22c55e]">+ const rateLimit = require('express-rate-limit');</div>
        <div className="text-[#22c55e] whitespace-nowrap">{'+ const limiter = rateLimit({ windowMs: 15*60*1000, max: 100 });'}</div>
        <div className="text-[#ef4444]">- app.use('/api', router);</div>
        <div className="text-[#22c55e]">+ app.use('/api', limiter, router);</div>
        <div><span className="text-[#22c55e]">&#10003; Edited src/routes/api.js</span></div>
        <div><span className="text-[#22D3EE]">ply&gt; </span><span className="inline-block h-3 sm:h-[18px] w-1.5 sm:w-2 animate-pulse bg-[#22D3EE]" /></div>
      </div>
    </div>
  )
}
