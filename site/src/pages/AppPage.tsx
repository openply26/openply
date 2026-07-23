import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ChatPanel from '../components/ChatPanel'
import FileTree from '../components/FileTree'
import CodeView from '../components/CodeView'
import SettingsPanel from '../components/SettingsPanel'
import { sendMessage, listFiles, readFile } from '../lib/api'
import type { ChatMessage } from '../lib/api'

export default function AppPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [activeFile, setActiveFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [model, setModel] = useState('deepseek/deepseek-v4-flash')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openrouter_key') || '')
  const [files, setFiles] = useState<string[]>([])

  useEffect(() => {
    listFiles().then(setFiles).catch(() => {})
  }, [])

  const handleSend = useCallback(async (prompt: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    }

    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setLoading(true)

    const history = [...messages, userMsg]

    await sendMessage(
      prompt,
      history,
      model,
      apiKey,
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          ),
        )
      },
      () => setLoading(false),
      (err) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `Error: ${err}` }
              : m,
          ),
        )
        setLoading(false)
      },
    )
  }, [messages, model, apiKey])

  const handleFileSelect = async (path: string) => {
    setActiveFile(path)
    try {
      const content = await readFile(path)
      setFileContent(content)
    } catch {
      setFileContent(`// ${path}\n// Unable to load file`)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-[#0a0a1a]">
      <header className="flex h-12 items-center justify-between border-b border-[#1e293b] px-4">
        <Link to="/" className="flex items-center gap-2 text-sm font-mono font-bold">
          <span className="text-[#F8FAFC]">open</span>
          <span className="text-[#22D3EE]">Ply</span>
          <span className="ml-2 rounded border border-[#1e293b] px-1.5 py-0.5 text-[10px] text-[#64748b]">web</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#64748b] font-mono">{model.split('/').pop()}</span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="rounded-lg px-3 py-1.5 text-xs text-[#94a3b8] transition-colors hover:bg-[#1a1a35] hover:text-[#e2e8f0]"
          >
            ⚙ Settings
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 border-r border-[#1e293b] bg-[#0f0f24] overflow-auto">
          <FileTree files={files} activeFile={activeFile} onSelect={handleFileSelect} />
        </aside>

        <main className="flex flex-1 flex-col">
          <ChatPanel messages={messages} onSend={handleSend} loading={loading} />
        </main>

        <aside className="w-96 border-l border-[#1e293b] bg-[#0f0f24]">
          {showSettings ? (
            <SettingsPanel model={model} onModelChange={setModel} apiKey={apiKey} onApiKeyChange={(k) => { setApiKey(k); localStorage.setItem('openrouter_key', k) }} />
          ) : activeFile ? (
            <CodeView path={activeFile} content={fileContent} onClose={() => { setActiveFile(null); setFileContent(null) }} />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center">
              <div>
                <div className="text-3xl mb-2">📄</div>
                <p className="text-sm text-[#64748b]">Select a file to view its contents</p>
                <p className="mt-2 text-xs text-[#64748b]">Full editing available in the CLI</p>
                <Link to="/" className="mt-4 inline-block rounded-lg border border-[#1e293b] px-4 py-2 text-xs text-[#22D3EE] hover:bg-[#1a1a35]">← Back to home</Link>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
