import { useState, useEffect } from 'react'
import type { RightPanel } from '../lib/store'

interface Props {
  path: string | null
  content: string | null
  onSwitchPanel: (panel: RightPanel) => void
}

export default function FileEditor({ path, content, onSwitchPanel }: Props) {
  const [draft, setDraft] = useState(content || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (content !== null) setDraft(content)
  }, [path, content])

  if (!path) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <div>
          <div className="text-3xl mb-2">📝</div>
          <p className="text-sm text-[#64748b]">Select a file to edit</p>
          <p className="mt-1 text-xs text-[#4a5568]">Switch to Code view to read files</p>
        </div>
      </div>
    )
  }

  const save = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content: draft }),
      })
      if (!res.ok) { const e = await res.text(); throw new Error(e) }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err: any) {
      setError(err.message)
    }
    setSaving(false)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[#1e293b] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">Editor</span>
          <span className="text-[11px] font-mono text-[#94a3b8]">📄 {path}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onSwitchPanel('code')} className="text-[10px] text-[#64748b] hover:text-[#e2e8f0]">Read</button>
          <button
            onClick={save}
            disabled={saving}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${
              saved ? 'bg-green-500/20 text-green-400' : 'bg-[#22D3EE]/20 text-[#22D3EE] hover:bg-[#22D3EE]/30'
            }`}
          >
            {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save'}
          </button>
        </div>
      </div>
      {error && <div className="px-4 py-2 text-[11px] text-[#ef4444] bg-[#ef4444]/5 border-b border-[#ef4444]/20">{error}</div>}
      <div className="flex-1 overflow-auto">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="h-full w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-[#e2e8f0] outline-none placeholder-[#4a5568]"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
