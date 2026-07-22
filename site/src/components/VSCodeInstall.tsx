export default function VSCodeInstall() {
  return (
    <section id="install" className="py-20 bg-[#0a0a1a]">
      <div className="mx-auto max-w-[1100px] px-6 text-center">
        <h2 className="text-4xl font-extrabold tracking-[-1px]">Install the VS Code extension</h2>
        <p className="mx-auto mt-4 mb-10 max-w-[600px] text-lg text-[#94a3b8]">
          Start openPly directly from your editor. Chat, explain code, and run commands.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/openply26/openply/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[48px] items-center rounded-xl border border-[#1e293b] bg-[#0f0f24] px-8 text-base font-semibold text-[#e2e8f0] transition-all duration-200 hover:border-[#22D3EE] hover:text-[#22D3EE] hover:-translate-y-0.5"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29L8.95 8.342 4.703 4.852a.75.75 0 0 0-.977 0L.635 7.188a.748.748 0 0 0 0 1.146l3.975 3.157-3.975 3.157a.748.748 0 0 0 0 1.146l3.091 2.336a.75.75 0 0 0 .977 0l4.247-3.49 7.555 7.541a1.494 1.494 0 0 0 1.705.29l4.94-2.377A1.5 1.5 0 0 0 24 18.22V5.78a1.5 1.5 0 0 0-.85-3.193zM17.38 17.628l-6-6 6-6v12z"/></svg>
            Download .vsix & install
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
        <div className="mt-8 text-sm text-[#64748b]">
          Or install manually: <code className="font-mono text-[#22D3EE]">ext install openPly.openply-vscode</code>
        </div>
      </div>
    </section>
  )
}
