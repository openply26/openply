import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden spotlight">
      {/* Ambient orbs */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.04)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(92,124,250,0.03)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-[1100px] px-5 sm:px-8">
        {/* Badge */}
        <div className="mx-auto mb-8 sm:mb-10 inline-flex items-center gap-2.5 rounded-full border border-[rgba(0,229,255,0.15)] bg-[rgba(0,229,255,0.05)] px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-medium text-[#00e5ff] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00e5ff] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00e5ff]" />
          </span>
          <span>v0.3.0</span>
          <span className="text-[#5a5a8a]">|</span>
          <span>MCP Server</span>
          <span className="text-[#5a5a8a]">&middot;</span>
          <span>Plugins</span>
          <span className="text-[#5a5a8a]">&middot;</span>
          <span>Collaborative</span>
        </div>

        {/* Headline — dramatic size, tight tracking */}
        <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-extrabold leading-[0.95] tracking-[-0.04em] text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="text-[#e8e8f8]">Code with AI.</span>
          <br />
          <span className="gradient-text">
            Your code stays yours.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 sm:mt-8 max-w-[580px] text-base sm:text-lg md:text-xl text-[#8888b0] text-center leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          Free, open-source AI coding assistant with a full web IDE.
          Multi-agent, collaborative, extensible. No subscription. No data collection.
        </p>

        {/* CTAs — premium button styles */}
        <div className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-5 px-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <a
            href="#"
            className="group relative flex h-[52px] sm:h-[56px] items-center rounded-2xl bg-gradient-to-r from-[#00e5ff] to-[#5c7cfa] px-7 sm:px-10 text-sm sm:text-base font-semibold text-[#06060e] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,229,255,0.25)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10">npm install -g openply</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00e5ff] to-[#5c7cfa] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-40" />
          </a>
          <Link
            to="/app"
            className="group relative flex h-[52px] sm:h-[56px] items-center rounded-2xl border border-[rgba(0,229,255,0.2)] bg-[rgba(0,229,255,0.04)] px-7 sm:px-10 text-sm sm:text-base font-semibold text-[#00e5ff] transition-all duration-300 hover:bg-[rgba(0,229,255,0.08)] hover:border-[rgba(0,229,255,0.35)] hover:shadow-[0_8px_32px_rgba(0,229,255,0.1)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Open Web App
            <svg className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
          <a
            href="https://github.com/openply26/openply"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[52px] sm:h-[56px] items-center rounded-2xl border border-[#1a1a3a] bg-transparent px-7 sm:px-10 text-sm sm:text-base font-semibold text-[#8888b0] transition-all duration-300 hover:border-[#5a5a8a] hover:text-[#c8c8e0] hover:bg-[rgba(255,255,255,0.02)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="mr-2.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
        </div>

        {/* Stats — clean metric display */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-[720px] mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          {[
            { value: '5', label: 'Specialized agents', accent: '#00e5ff' },
            { value: '200+', label: 'Models supported', accent: '#5c7cfa' },
            { value: '17', label: 'Design modes', accent: '#9775fa' },
            { value: '$0', label: 'Free forever', accent: '#51cf66' },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: stat.accent }}>
                {stat.value}
              </div>
              <div className="mt-1.5 text-xs sm:text-sm text-[#5a5a8a] font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
