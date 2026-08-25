import { useState, useMemo } from 'react'
import { ChevronRight, FileCode2, FolderClosed, FolderOpen, Loader2 } from 'lucide-react'

interface Props {
  files: string[]
  status?: 'idle' | 'loading' | 'ready' | 'error'
  activeFile: string | null
  onSelect: (path: string) => void
}

interface TreeNode {
  name: string
  path: string
  children: TreeNode[]
  isDir: boolean
}

export default function FileTree({ files, status = 'ready', activeFile, onSelect }: Props) {
  const tree = useMemo(() => buildTree(files), [files])

  if (status === 'loading') {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-[11px] text-faint">
        <Loader2 size={13} className="animate-spin" /> Loading files…
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
        <p className="text-[11px] text-faint">Could not load files.</p>
        <p className="text-[10px] text-faint">Is the backend running?</p>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-[11px] text-faint">
        No files in this workspace
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto py-2">
      {tree.map((node) => (
        <TreeNodeView key={node.path} node={node} depth={0} activeFile={activeFile} onSelect={onSelect} />
      ))}
    </div>
  )
}

function TreeNodeView({ node, depth, activeFile, onSelect }: {
  node: TreeNode; depth: number; activeFile: string | null; onSelect: (p: string) => void
}) {
  const [open, setOpen] = useState(depth < 1)

  if (!node.isDir) {
    return (
      <button
        onClick={() => onSelect(node.path)}
        className={`flex w-full items-center gap-1.5 rounded px-2 py-[3px] text-[11px] transition-colors ${
          activeFile === node.path
            ? 'bg-elevated text-accent'
            : 'text-muted hover:bg-elevated/60 hover:text-text'
        }`}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        <FileCode2 size={11} className="shrink-0 opacity-60" />
        <span className="truncate">{node.name}</span>
      </button>
    )
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1 rounded px-2 py-[3px] text-[11px] text-muted transition-colors hover:bg-elevated/60 hover:text-text"
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        <ChevronRight size={10} className={`shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
        {open ? <FolderOpen size={11} className="shrink-0 opacity-60" /> : <FolderClosed size={11} className="shrink-0 opacity-60" />}
        <span className="truncate">{node.name}</span>
      </button>
      {open && node.children.map((child) => (
        <TreeNodeView key={child.path} node={child} depth={depth + 1} activeFile={activeFile} onSelect={onSelect} />
      ))}
    </div>
  )
}

function buildTree(files: string[]): TreeNode[] {
  const root: TreeNode[] = []

  for (const f of files) {
    const parts = f.split('/')
    let current = root

    for (let i = 0; i < parts.length; i++) {
      const isLast = i === parts.length - 1
      const name = parts[i]
      const path = parts.slice(0, i + 1).join('/')

      if (isLast) {
        current.push({ name, path, children: [], isDir: false })
      } else {
        let dir = current.find((n) => n.isDir && n.name === name)
        if (!dir) {
          dir = { name, path: path + '/', children: [], isDir: true }
          current.push(dir)
        }
        current = dir.children
      }
    }
  }

  sortTree(root)
  return root
}

function sortTree(nodes: TreeNode[]) {
  nodes.sort((a, b) => {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1
    return a.name.localeCompare(b.name)
  })
  for (const n of nodes) {
    if (n.isDir) sortTree(n.children)
  }
}
