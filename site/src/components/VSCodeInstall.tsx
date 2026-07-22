export default function VSCodeInstall() {
  return (
    <section id="install" className="py-20 bg-[#0a0a1a]">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="text-center text-4xl font-extrabold tracking-[-1px]">VS Code extension</h2>
        <p className="mx-auto mt-4 mb-10 max-w-[600px] text-center text-lg text-[#94a3b8]">
          Use openPly directly from your editor. No need to switch windows.
        </p>

        {/* Features */}
        <div className="mx-auto mb-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[#1e293b] bg-[#0f0f24] p-5 text-center">
            <div className="text-2xl">▶</div>
            <h3 className="mt-2 text-sm font-bold">Start Terminal</h3>
            <p className="mt-1 text-xs text-[#64748b]">Opens openPly CLI in VS Code terminal</p>
          </div>
          <div className="rounded-lg border border-[#1e293b] bg-[#0f0f24] p-5 text-center">
            <div className="text-2xl">💬</div>
            <h3 className="mt-2 text-sm font-bold">Chat</h3>
            <p className="mt-1 text-xs text-[#64748b]">Ask openPly to write or edit code</p>
          </div>
          <div className="rounded-lg border border-[#1e293b] bg-[#0f0f24] p-5 text-center">
            <div className="text-2xl">🔍</div>
            <h3 className="mt-2 text-sm font-bold">Explain</h3>
            <p className="mt-1 text-xs text-[#64748b]">Select code and get instant explanation</p>
          </div>
        </div>

        {/* Install buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/openply26/openply/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[48px] items-center rounded-xl border border-[#1e293b] bg-[#0f0f24] px-8 text-base font-semibold text-[#e2e8f0] transition-all duration-200 hover:border-[#22D3EE] hover:text-[#22D3EE] hover:-translate-y-0.5"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            Download from GitHub
          </a>
          <a
            href="https://marketplace.visualstudio.com/items?itemName=openPly.openply-vscode"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[48px] items-center rounded-xl bg-linear-135 from-[#06B6D4] to-[#3B82F6] px-8 text-base font-semibold text-white shadow-[0_8px_24px_rgba(59,130,246,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(59,130,246,0.35)] hover:brightness-110"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29L8.95 8.342 4.703 4.852a.75.75 0 0 0-.977 0L.635 7.188a.748.748 0 0 0 0 1.146l3.975 3.157-3.975 3.157a.748.748 0 0 0 0 1.146l3.091 2.336a.75.75 0 0 0 .977 0l4.247-3.49 7.555 7.541a1.494 1.494 0 0 0 1.705.29l4.94-2.377A1.5 1.5 0 0 0 24 18.22V5.78a1.5 1.5 0 0 0-.85-3.193zM17.38 17.628l-6-6 6-6v12z"/></svg>
            Install from Marketplace
          </a>
        </div>

        {/* Install commands */}
        <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-[#1e293b] bg-[#0d0d20] p-6 text-left font-mono text-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#64748b]">Installation methods</p>

          <p className="mt-4 text-[#94a3b8] text-xs uppercase tracking-wider">Method 1 — VS Code terminal</p>
          <div className="mt-1 rounded-lg bg-[#0a0a1a] px-4 py-2">
            <span className="text-[#64748b]">$</span>{' '}
            <span className="text-[#22D3EE]">ext install openPly.openply-vscode</span>
          </div>

          <p className="mt-4 text-[#94a3b8] text-xs uppercase tracking-wider">Method 2 — Quick open (Ctrl+P)</p>
          <div className="mt-1 rounded-lg bg-[#0a0a1a] px-4 py-2">
            <span className="text-[#64748b]">$</span>{' '}
            <span className="text-[#e2e8f0]">ext install </span>
            <span className="text-[#f59e0b]">openPly.openply-vscode</span>
          </div>

          <p className="mt-4 text-[#94a3b8] text-xs uppercase tracking-wider">Method 3 — Manual .vsix</p>
          <div className="mt-1 rounded-lg bg-[#0a0a1a] px-4 py-2">
            <span className="text-[#64748b]">1.</span>{' '}
            <span className="text-[#94a3b8]">Download the .vsix from</span>{' '}
            <a href="https://github.com/openply26/openply/releases/latest" className="text-[#22D3EE] underline">GitHub Releases</a>
          </div>
          <div className="mt-1 rounded-lg bg-[#0a0a1a] px-4 py-2">
            <span className="text-[#64748b]">2.</span>{' '}
            <span className="text-[#94a3b8]">VS Code → Extensions → ... → Install from VSIX</span>
          </div>

          <p className="mt-4 text-[#94a3b8] text-xs uppercase tracking-wider">Commands</p>
          <div className="mt-1 space-y-1 rounded-lg bg-[#0a0a1a] px-4 py-2">
            <div><span className="text-[#22D3EE]">openPly: Start in Terminal</span> <span className="text-[#64748b]">— Opens CLI</span></div>
            <div><span className="text-[#22D3EE]">openPly: Chat</span> <span className="text-[#64748b]">— Ask AI to code</span></div>
            <div><span className="text-[#22D3EE]">openPly: Explain</span> <span className="text-[#64748b]">— Explain selected code</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
