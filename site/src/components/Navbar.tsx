import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#mcp', label: 'MCP' },
  { href: '#plugins', label: 'Plugins' },
  { href: 'https://github.com/openply26/openply', label: 'GitHub', external: true },
  { href: '#install', label: 'VS Code' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-500 ${
      scrolled
        ? 'border-b border-[rgba(255,255,255,0.04)] bg-[#06060e]/80 backdrop-blur-2xl shadow-[0_1px_30px_rgba(0,0,0,0.3)]'
        : 'border-b border-transparent bg-transparent'
    }`}>
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group" aria-label="openPly home">
          <div className="relative">
            <img
              src="/logo.svg"
              alt="openPly logo"
              className="h-9 w-9 transition-all duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 rounded-full bg-[#00e5ff] opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-20" />
          </div>
          <span className="font-mono text-lg font-bold tracking-[-0.02em]">
            <span className="text-[#e8e8f8]">open</span>
            <span className="gradient-text">Ply</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="relative px-3.5 py-2 text-[13px] font-medium text-[#8888b0] rounded-lg transition-all duration-200 hover:text-[#c8c8e0] hover:bg-[rgba(255,255,255,0.03)]"
            >
              {link.label}
            </a>
          ))}
          <div className="w-px h-5 bg-[#1a1a3a] mx-2" />
          <Link
            to="/app"
            className="flex h-[40px] items-center rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#5c7cfa] px-5 text-[13px] font-semibold text-[#06060e] transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,229,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Open Web App
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden flex flex-col gap-[5px] p-2 -mr-2"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className={`block h-[1.5px] w-5 rounded-full bg-[#c8c8e0] transition-all duration-300 origin-center ${open ? 'translate-y-[6.5px] rotate-45' : ''}`} />
          <span className={`block h-[1.5px] w-5 rounded-full bg-[#c8c8e0] transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block h-[1.5px] w-5 rounded-full bg-[#c8c8e0] transition-all duration-300 origin-center ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-400 ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-[rgba(255,255,255,0.04)] bg-[#06060e]/95 backdrop-blur-2xl">
          <nav className="flex flex-col gap-1 px-5 py-5" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#8888b0] transition-all duration-200 hover:bg-[rgba(255,255,255,0.04)] hover:text-[#c8c8e0]"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/app"
              onClick={() => setOpen(false)}
              className="mt-3 flex h-[48px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#5c7cfa] text-sm font-semibold text-[#06060e] transition-all duration-200 hover:brightness-110"
            >
              Open Web App
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
