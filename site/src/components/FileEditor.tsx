import { useState, useEffect, useRef } from 'react'
import { Check, FilePenLine, Save } from 'lucide-react'
import { useStore, type RightPanel } from '../lib/store'
import { writeFile } from '../lib/api'

interface Props {
  path: string | null
  content: string | null
  onSwitchPanel: (panel: RightPanel) => void
}

export default function FileEditor({ path, content, onSwitchPanel }: Props) {
  const { dispatch, toast } = useStore()
  const [draft, setDraft] = useState(content || '')
  const [saving, setSaving] = useState(false)
  const dirtyRef = useRef(false)

  const dirty = path !== null && content !== null && draft !== content

  useEffect(() => {
    if (content !== null) setDraft(content)
  }, [path, content])

  const save = async () => {
    if (!path || saving || !dirty) return
    setSaving(true)
    try {
      await writeFile(path, draft)
      dispatch({ type: 'SET_ACTIVE_FILE', path, content: draft })
      toast(`Saved ${path}`, 'success')
    } catch (err: any) {
      toast(`Save failed: ${err.message}`, 'error')
    }
    setSaving(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      save()
    }
  }

  if (!path) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <FilePenLine size={24} className="text-faint" strokeWidth={1.5} />
        <p className="text-[11px] text-faint">Select a file to edit</p>
        <p className="text-[10px] text-faint">Ctrl+S saves · dirty state is tracked</p>
      </div>
    )
  }

  const lineCount = content === null ? 0 : draft.split('\n').length

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 truncate font-mono text-[10px] text-muted">{path}</span>
          {dirty && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warn" title="Unsaved changes" />}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => onSwitchPanel('code')} className="text-[10px] text-faint transition-colors hover:text-text">read</button>
          <button
            onClick={save}
            disabled={saving || !dirty}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
              !dirty ? 'text-faint' : 'bg-accent/15 text-accent hover:bg-accent/25'
            }`}
          >
            {saving ? 'saving…' : dirty ? <><Save size={10} /> save</> : <><Check size={10} className="text-success" /> saved</>}
          </button>
        </div>
      </div>
      {content === null ? (
        <div className="flex flex-1 items-center justify-center text-[11px] text-faint">Loading…</div>
      ) : (
        <div className="flex min-h-0 flex-1">
          <pre aria-hidden className="select-none overflow-hidden border-r border-border bg-surface px-2 py-3 text-right font-mono text-[11px] leading-relaxed text-faint">
            {Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}
          </pre>
          <textarea
            value={draft}
            onChange={(e) => { setDraft(e.target.value); dirtyRef.current = true }}
            onKeyDown={onKeyDown}
            className="flex-1 resize-none overflow-auto bg-transparent px-3 py-3 font-mono text-[11px] leading-relaxed text-text outline-none placeholder-faint"
            spellCheck={false}
            aria-label={`Editing ${path}`}
          />
        </div>
      )}
    </div>
  )
}
