import { useState, useRef, useEffect } from 'react'

export default function TerminalPanel() {
  const [lines, setLines] = useState<string[]>([
    'openPly Terminal v0.1.0',
    'Type a command and press Enter to execute.',
    '---',
  ])
  const [input, setInput] = useState('')
  const [running, setRunning] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [lines])

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus()
  }, [])

  const execute = async () => {
    const cmd = input.trim()
    if (!cmd) return
    setLines((prev) => [...prev, `$ ${cmd}`])
    setInput('')
    setRunning(true)

    try {
      const res = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      })
      const data = await res.json()
      if (data.output) setLines((prev) => [...prev, ...data.output.split('\n').filter(Boolean)])
      if (data.error) setLines((prev) => [...prev, `Error: ${data.error}`])
    } catch (err: any) {
      setLines((prev) => [...prev, `Error: ${err.message}`])
    }
    setRunning(false)
  }

  return (
    <div className="flex h-full flex-col bg-[#0a0a1a]">
      <div className="flex items-center justify-between border-b border-[#1e293b] px-4 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">Terminal</span>
        <button onClick={() => setLines([])} className="text-[10px] text-[#64748b] hover:text-[#e2e8f0]">Clear</button>
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className={`${line.startsWith('$ ') ? 'text-[#22D3EE]' : line.startsWith('Error') ? 'text-[#ef4444]' : 'text-[#94a3b8]'}`}>
            {line}
          </div>
        ))}
        {running && <span className="text-[#22D3EE] animate-pulse">▊</span>}
      </div>
      <div className="border-t border-[#1e293b] p-2">
        <div className="flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#0f0f24] px-3">
          <span className="text-[#22D3EE] text-xs">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') execute() }}
            disabled={running}
            className="flex-1 bg-transparent py-2 text-xs text-[#e2e8f0] outline-none placeholder-[#64748b]"
            placeholder="Run a command..."
          />
        </div>
      </div>
    </div>
  )
}
