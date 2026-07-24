export default function MCPServer() {
  return (
    <section id="mcp" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-2 items-center">
          {/* Left: content */}
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(151,117,250,0.15)] bg-[rgba(151,117,250,0.05)] px-3.5 py-1 text-xs font-medium text-[#9775fa] mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9775fa]" />
              New in v0.3.0
            </div>
            <h2 className="text-[1.65rem] sm:text-4xl md:text-5xl font-extrabold tracking-[-0.03em] text-[#e8e8f8]">
              MCP Server
            </h2>
            <p className="mx-auto sm:mx-0 mt-4 text-base sm:text-lg text-[#5a5a8a] leading-relaxed max-w-[34ch] sm:max-w-[480px]">
              Use openPly agents as tools in Claude Desktop, Cursor, Windsurf, and other MCP clients.
              Your multi-agent system becomes available to any AI assistant.
            </p>

            {/* Tool list */}
            <div className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3">
              {[
                { name: 'openply_chat', desc: 'Send coding tasks to the multi-agent system', color: '#9775fa' },
                { name: 'openply_read_file', desc: 'Read files from your project', color: '#5c7cfa' },
                { name: 'openply_search', desc: 'Search code with grep/glob patterns', color: '#00e5ff' },
                { name: 'openply_run_command', desc: 'Execute shell commands safely', color: '#51cf66' },
                { name: 'openply_agents', desc: 'List available agents and capabilities', color: '#fcc419' },
              ].map((item) => (
                <div key={item.name} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3.5 group">
                  <code className="shrink-0 rounded-lg px-2.5 py-1 text-[10px] sm:text-[11px] font-mono font-medium self-start" style={{ color: item.color, background: `${item.color}10`, border: `1px solid ${item.color}15` }}>
                    {item.name}
                  </code>
                  <span className="text-[12px] sm:text-[13px] text-[#5a5a8a] group-hover:text-[#8888b0] transition-colors">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: code block */}
          <div className="relative rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,28,0.8)] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)] px-3 sm:px-4 py-2.5 sm:py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] opacity-60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] opacity-60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] opacity-60" />
              </div>
              <span className="ml-2 font-mono text-[10px] sm:text-[11px] text-[#5a5a8a] truncate">claude_desktop_config.json</span>
            </div>

            <pre className="p-4 sm:p-6 font-mono text-[11px] sm:text-[13px] leading-[1.7] sm:leading-[1.8] overflow-x-auto">
              <code>
                <span className="text-[#9775fa]">{'{'}</span>{'\n'}
                <span className="text-[#8888b0]">{'  "mcpServers": {'}</span>{'\n'}
                <span className="text-[#8888b0]">{'    "openply": {'}</span>{'\n'}
                <span className="text-[#5a5a8a]">{'      "command": '}</span><span className="text-[#51cf66]">"npx"</span><span className="text-[#5a5a8a]">,</span>{'\n'}
                <span className="text-[#5a5a8a]">{'      "args": '}</span><span className="text-[#51cf66]">["-y", "@openply/mcp"]</span><span className="text-[#5a5a8a]">,</span>{'\n'}
                <span className="text-[#5a5a8a]">{'      "env": {'}</span>{'\n'}
                <span className="text-[#5a5a8a]">{'        "OPENROUTER_API_KEY": '}</span><span className="text-[#51cf66]">"your-key"</span>{'\n'}
                <span className="text-[#5a5a8a]">{'      }'}</span>{'\n'}
                <span className="text-[#8888b0]">{'    }'}</span>{'\n'}
                <span className="text-[#8888b0]">{'  }'}</span>{'\n'}
                <span className="text-[#9775fa]">{'}'}</span>
              </code>
            </pre>

            {/* Ambient glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[radial-gradient(circle,rgba(151,117,250,0.08)_0%,transparent_70%)] pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
