import { useMemo } from 'react'

interface Props {
  path: string | null
  content: string | null
  onClose: () => void
}

const LANG_MAP: Record<string, string> = {
  ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
  json: 'json', md: 'markdown', css: 'css', html: 'html',
  py: 'python', rs: 'rust', go: 'go', java: 'java',
  c: 'c', cpp: 'cpp', h: 'c', yaml: 'yaml', yml: 'yaml',
}

export default function CodeView({ path, content, onClose }: Props) {
  const lang = useMemo(() => {
    if (!path) return ''
    const ext = path.split('.').pop() || ''
    return LANG_MAP[ext] || ext
  }, [path])

  if (!path || !content) return null

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[#1e293b] bg-[#0f0f24] px-4 py-2">
        <span className="text-xs font-mono text-[#94a3b8]">📄 {path}</span>
        <div className="flex items-center gap-2">
          <span className="rounded bg-[#1e293b] px-2 py-0.5 text-[10px] uppercase text-[#64748b]">{lang}</span>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#ef4444] text-sm">&times;</button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className="font-mono text-sm leading-relaxed text-[#e2e8f0]">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  )
}
