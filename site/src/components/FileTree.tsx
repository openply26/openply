import { useState, useMemo } from 'react'

interface Props {
  files: string[]
  activeFile: string | null
  onSelect: (path: string) => void
}

interface TreeNode {
  name: string
  path: string
  children: TreeNode[]
  isDir: boolean
}

export default function FileTree({ files, activeFile, onSelect }: Props) {
  const [collapsed, setCollapsed] = useState(false)

  const tree = useMemo(() => buildTree(files), [files])

  return (
    <div className="h-full overflow-y-auto p-3">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-2 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#64748b] hover:text-[#e2e8f0]"
      >
        <span className={`transition-transform ${collapsed ? '-rotate-90' : ''}`}>▼</span>
        Explorer
      </button>
      {!collapsed && (
        <div className="space-y-0.5">
          {tree.map((node) => (
            <TreeNodeView key={node.path} node={node} depth={0} activeFile={activeFile} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

function TreeNodeView({ node, depth, activeFile, onSelect }: {
  node: TreeNode; depth: number; activeFile: string | null; onSelect: (p: string) => void
}) {
  const [open, setOpen] = useState(true)

  if (!node.isDir) {
    return (
      <button
        onClick={() => onSelect(node.path)}
        className={`flex w-full items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors ${
          activeFile === node.path
            ? 'bg-[#22D3EE]/10 text-[#22D3EE]'
            : 'text-[#64748b] hover:bg-[#1a1a35] hover:text-[#e2e8f0]'
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        📄 {node.name}
      </button>
    )
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-xs text-[#94a3b8] hover:bg-[#1a1a35]"
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        <span className={`text-[10px] transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
        📁 {node.name}
      </button>
      {open && node.children.map((child) => (
        <TreeNodeView key={child.path} node={child} depth={depth + 1} activeFile={activeFile} onSelect={onSelect} />
      ))}
    </div>
  )
}

function buildTree(files: string[]): TreeNode[] {
  const root: TreeNode[] = []
  const dirMap = new Map<string, TreeNode[]>()

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
