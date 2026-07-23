const FEATURES = [
  { icon: '🔒', title: 'Local-first privacy', desc: 'Your code never leaves your machine. Runs on Ollama locally, or use cloud models via OpenRouter/OpenAI/Anthropic. No training on your data, ever.' },
  { icon: '🧠', title: 'Multi-agent mesh', desc: 'Not a single LLM call — a mesh of specialized agents (Planner, Editor, Explorer, Debugger, Reviewer) that collaborate on every task.' },
  { icon: '💬', title: 'Multi-session IDE', desc: 'Create, rename, and switch between sessions. Each session has independent history, agents, and model settings. Persisted in your browser.' },
  { icon: '🎨', title: 'Design Partner', desc: '17 design modes — audit, recolor, redesign, typeset, accessibility, responsive, dark mode, motion, tokens, and more. Full design system management from your browser.' },
  { icon: '🔧', title: 'Pro Dev Tools', desc: 'Grep search, web search, integrated terminal, file editor, code viewer, todo tracking — all built into the web app. No context switching.' },
  { icon: '🤖', title: 'Agent system', desc: 'Plan (read-only) and Build (read-write) modes. Switch between 5 agents: Planner, Editor, Explorer, Debugger, Reviewer. Auto-accept/YOLO mode for speed.' },
  { icon: '📋', title: 'Slash commands', desc: '/help, /model, /agent, /mode, /search, /web, /todo, /checkpoint, /undo, /design, /share, /export, /diagnostics — full command system with autocomplete.' },
  { icon: '🔄', title: 'Checkpoints & Undo', desc: 'Auto-save checkpoints before every response. Undo to any checkpoint with a keystroke or /undo command. Full session rewind.' },
  { icon: '📁', title: 'File management', desc: 'Hierarchical file tree, read-only code viewer, and full file editor. Save changes directly through the API. Monorepo and multi-directory workspace support.' },
  { icon: '💻', title: 'Integrated terminal', desc: 'Execute bash commands, run tests, builds, and linters directly in the web app. Real-time output streaming from the server.' },
  { icon: '🌐', title: 'Multi-provider AI', desc: 'Connect OpenRouter (200+ models), OpenAI, Anthropic, or Ollama local models. Switch models on the fly per session. Zero lock-in.' },
  { icon: '📤', title: 'Share & export', desc: 'Share sessions via /share link. Export as Markdown with /export. Collaboration-ready with shareable session snapshots.' },
]

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="text-center text-4xl font-extrabold tracking-[-1px]">Why developers choose openPly</h2>
        <p className="mx-auto mt-4 mb-14 max-w-[600px] text-center text-lg text-[#94a3b8]">
          Privacy-first, free, and built with everything you need — CLI and web app.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="group rounded-xl border border-[#1e293b] bg-[#0f0f24] p-8 transition-all duration-200 hover:border-[#22D3EE] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(34,211,238,0.08)]">
              <div className="mb-4 text-3xl">{f.icon}</div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
