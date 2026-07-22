import { useState } from 'react'

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#models', label: 'Models' },
  { href: 'https://github.com/openply26/openply', label: 'GitHub', external: true },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] border-b border-[#1e293b] bg-[#0a0a1a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
        {/* Logo + Brand */}
        <a href="/" className="flex items-center gap-3 group" aria-label="openPly home">
          <img
            src="/logo.svg"
            alt="openPly logo"
            className="h-10 w-10 transition-opacity duration-200 group-hover:opacity-80"
          />
          <span className="font-mono text-xl font-bold tracking-[-0.5px]">
            <span className="text-[#F8FAFC]">open</span>
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] bg-clip-text text-transparent">
              Ply
            </span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="group relative text-sm font-medium text-[#94a3b8] transition-colors duration-200 hover:text-[#22D3EE] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22D3EE]"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-[#22D3EE] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
          <a
            href="#"
            className="flex h-[42px] items-center rounded-xl bg-linear-135 from-[#06B6D4] to-[#3B82F6] px-[22px] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(59,130,246,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(59,130,246,0.35)] hover:brightness-110 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22D3EE]"
            aria-label="Get started with openPly"
          >
            Get started
          </a>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="flex md:hidden flex-col gap-1.5 p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22D3EE]"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className={`block h-[2px] w-5 rounded bg-[#e2e8f0] transition-all duration-200 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
          <span className={`block h-[2px] w-5 rounded bg-[#e2e8f0] transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-[2px] w-5 rounded bg-[#e2e8f0] transition-all duration-200 ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-[#1e293b] bg-[#0a0a1a] md:hidden">
          <nav className="flex flex-col gap-2 px-6 py-6" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-[#94a3b8] transition-colors duration-200 hover:bg-[#1a1a35] hover:text-[#22D3EE]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#"
              onClick={() => setOpen(false)}
              className="mt-2 flex h-[42px] w-full items-center justify-center rounded-xl bg-linear-135 from-[#06B6D4] to-[#3B82F6] px-[22px] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(59,130,246,0.25)] transition-all duration-200 hover:brightness-110"
              aria-label="Get started with openPly"
            >
              Get started
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
