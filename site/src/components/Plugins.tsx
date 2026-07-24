export default function Plugins() {
  return (
    <section id="plugins" className="relative py-20 sm:py-28 bg-[rgba(15,15,34,0.3)]">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative mx-auto max-w-[1100px] px-5 sm:px-8">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-2 items-center">
          {/* Left: code block */}
          <div className="order-2 lg:order-1 relative rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,28,0.8)] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] opacity-60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] opacity-60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] opacity-60" />
              </div>
              <span className="ml-2 font-mono text-[11px] text-[#5a5a8a]">.openply/plugins/docker/index.js</span>
            </div>

            <pre className="p-5 sm:p-6 font-mono text-[12px] sm:text-[13px] leading-[1.8] overflow-x-auto">
              <code>
                <span className="text-[#5a5a8a]">{'// openPly plugin'}</span>{'\n'}
                <span className="text-[#c8c8e0]">module.</span><span className="text-[#00e5ff]">exports</span><span className="text-[#c8c8e0]"> = {'{'}</span>{'\n'}
                <span className="text-[#c8c8e0]">  name: </span><span className="text-[#51cf66]">'docker'</span><span className="text-[#c8c8e0]">,</span>{'\n'}
                <span className="text-[#c8c8e0]">  version: </span><span className="text-[#51cf66]">'1.0.0'</span><span className="text-[#c8c8e0]">,</span>{'\n'}
                <span className="text-[#c8c8e0]">  tools: [{'{'}</span>{'\n'}
                <span className="text-[#c8c8e0]">    name: </span><span className="text-[#51cf66]">'docker_build'</span><span className="text-[#c8c8e0]">,</span>{'\n'}
                <span className="text-[#c8c8e0]">    description: </span><span className="text-[#51cf66]">'Build Docker image'</span><span className="text-[#c8c8e0]">,</span>{'\n'}
                <span className="text-[#c8c8e0]">    execute: </span><span className="text-[#9775fa]">async</span><span className="text-[#c8c8e0]"> (args, ctx) =&gt; {'{'}</span>{'\n'}
                <span className="text-[#c8c8e0]">      </span><span className="text-[#9775fa]">return</span><span className="text-[#c8c8e0]"> ctx.</span><span className="text-[#00e5ff]">exec</span><span className="text-[#c8c8e0]">(</span><span className="text-[#51cf66]">'docker build .'</span><span className="text-[#c8c8e0]">)</span>{'\n'}
                <span className="text-[#c8c8e0]">    {'}'}</span>{'\n'}
                <span className="text-[#c8c8e0]">  {'}'}]</span>{'\n'}
                <span className="text-[#c8c8e0]">{'}'}</span>
              </code>
            </pre>

            {/* Ambient glow */}
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[radial-gradient(circle,rgba(0,229,255,0.06)_0%,transparent_70%)] pointer-events-none" />
          </div>

          {/* Right: content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,229,255,0.15)] bg-[rgba(0,229,255,0.05)] px-3.5 py-1 text-xs font-medium text-[#00e5ff] mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]" />
              New in v0.3.0
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.03em] text-[#e8e8f8]">
              Plugin system
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#5a5a8a] leading-relaxed max-w-[480px]">
              Extend openPly with npm plugins. Add custom agents, tools, and lifecycle hooks.
              Discovered from <code className="text-[#00e5ff] text-[13px]">.openply/plugins/</code> or installed via npm.
            </p>

            {/* Commands */}
            <div className="mt-8 space-y-3">
              {[
                { cmd: 'openply plugin create docker', desc: 'Scaffold a new plugin', color: '#00e5ff' },
                { cmd: 'openply plugin list', desc: 'Discover installed plugins', color: '#5c7cfa' },
                { cmd: 'npm i openply-plugin-docker', desc: 'Install an npm plugin', color: '#51cf66' },
              ].map((item) => (
                <div key={item.cmd} className="rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(10,10,28,0.6)] px-5 py-4 transition-all duration-300 hover:border-[rgba(255,255,255,0.08)]">
                  <code className="text-[13px] font-mono" style={{ color: item.color }}>{item.cmd}</code>
                  <div className="mt-1 text-[12px] text-[#5a5a8a]">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
