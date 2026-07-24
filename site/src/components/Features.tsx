const FEATURES = [
  { icon: '🔒', color: '#00e5ff', title: 'Local-first privacy', desc: 'Your code never leaves your machine. Runs on Ollama locally, or use cloud models via OpenRouter/OpenAI/Anthropic.' },
  { icon: '🧠', color: '#5c7cfa', title: 'Multi-agent mesh', desc: 'Not a single LLM call — a mesh of specialized agents (Planner, Editor, Explorer, Debugger, Reviewer) collaborate.' },
  { icon: '🔌', color: '#9775fa', title: 'MCP Server', desc: 'Expose openPly as tools for Claude Desktop, Cursor, and other MCP clients. Your agents become available everywhere.' },
  { icon: '🧩', color: '#fcc419', title: 'Plugin system', desc: 'Extend with npm plugins. Add custom agents, tools, and lifecycle hooks. Discover from .openply/plugins/.' },
  { icon: '👥', color: '#51cf66', title: 'Collaborative editing', desc: 'Multi-user WebSocket sessions with cursor presence. See teammates cursors in real-time. Share and chat.' },
  { icon: '🎨', color: '#ff6b9d', title: 'Design Partner', desc: '17 design modes — audit, recolor, redesign, typeset, accessibility, responsive, dark mode, motion, tokens.' },
  { icon: '🔧', color: '#00e5ff', title: 'Pro Dev Tools', desc: 'Grep search, web search, terminal, file editor, code viewer, diff viewer, todo tracking — all built in.' },
  { icon: '⚡', color: '#5c7cfa', title: 'Function calling', desc: 'Agents use structured tool calls for reliable execution. Retry with fallback chains. Streaming responses.' },
  { icon: '📋', color: '#9775fa', title: 'Slash commands', desc: '/help, /model, /agent, /mode, /search, /web, /todo, /checkpoint, /undo, /design, /share, /export.' },
  { icon: '🔄', color: '#51cf66', title: 'Checkpoints & Undo', desc: 'Auto-save before every response. Undo to any checkpoint. Full session rewind with one keystroke.' },
  { icon: '🌐', color: '#fcc419', title: 'Multi-provider AI', desc: 'OpenRouter (200+), OpenAI, Anthropic (direct SDK), Ollama. Retry, fallback chains, streaming.' },
  { icon: '📤', color: '#ff6b9d', title: 'Share & export', desc: 'Share sessions via link. Export as Markdown. Collaboration-ready with shareable session snapshots.' },
]

export default function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        {/* Section header */}
        <div className="text-center mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,229,255,0.12)] bg-[rgba(0,229,255,0.04)] px-3.5 py-1 text-xs font-medium text-[#00e5ff] mb-5">
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.03em] text-[#e8e8f8]">
            Why developers choose openPly
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-base sm:text-lg text-[#5a5a8a] leading-relaxed">
            Privacy-first, free, extensible, and built with everything you need.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-[rgba(255,255,255,0.04)] bg-[rgba(15,15,34,0.5)] p-6 sm:p-7 transition-all duration-500 hover:border-[rgba(0,229,255,0.15)] hover:bg-[rgba(15,15,34,0.8)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Icon with glow */}
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-lg" style={{ background: `${f.color}10`, border: `1px solid ${f.color}20` }}>
                {f.icon}
              </div>
              <h3 className="text-[15px] font-semibold text-[#e8e8f8] tracking-[-0.01em]">{f.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#5a5a8a]">{f.desc}</p>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(400px at 50% 0%, ${f.color}06 0%, transparent 70%)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
