import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import type { ChatMessage } from '../lib/api'

interface Props {
  messages: ChatMessage[]
  onSend: (msg: string) => void
  loading: boolean
}

export default function ChatPanel({ messages, onSend, loading }: Props) {
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !loading) {
        onSend(input.trim())
        setInput('')
      }
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center max-w-md">
              <div className="text-5xl mb-4 font-mono font-bold text-[#22D3EE]">ply&gt;</div>
              <p className="text-[#64748b]">Ask me anything about your codebase.<br />I can edit files, run commands, and build apps.</p>
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#e2e8f0]'
                : m.role === 'system'
                ? 'bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#e2e8f0]'
                : 'bg-[#1a1a35] border border-[#1e293b] text-[#e2e8f0]'
            }`}>
              {m.role !== 'user' && (
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  {m.role === 'assistant' ? 'openPly' : 'system'}
                </div>
              )}
              <div className="prose prose-invert prose-sm max-w-none [&_pre]:rounded-lg [&_pre]:bg-[#0d1117] [&_pre]:p-4 [&_pre]:overflow-x-auto [&_code]:text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {m.content || '...'}
                </ReactMarkdown>
              </div>
              {m.files && m.files.length > 0 && (
                <div className="mt-2 border-t border-[#1e293b] pt-2 space-y-1">
                  {m.files.map((f) => (
                    <div key={f.path} className="text-xs text-[#22D3EE]">📄 {f.path}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl border border-[#1e293b] bg-[#1a1a35] px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#22D3EE]" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#22D3EE]" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#22D3EE]" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[#1e293b] p-4">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Tell openPly what to do..."
            className="flex-1 rounded-xl border border-[#1e293b] bg-[#0a0a1a] px-4 py-3 text-sm text-[#e2e8f0] placeholder-[#64748b] outline-none transition-colors focus:border-[#22D3EE]"
            disabled={loading}
          />
          <button
            onClick={() => { if (input.trim() && !loading) { onSend(input.trim()); setInput('') } }}
            disabled={loading || !input.trim()}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-[#22D3EE] text-[#0a0a1a] transition-all hover:bg-[#2dd4f8] disabled:opacity-40"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
