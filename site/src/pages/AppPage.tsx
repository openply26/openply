import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore, type RightPanel } from '../lib/store'
import { listFiles, readFile } from '../lib/api'
import SessionSidebar from '../components/SessionSidebar'
import AgentBar from '../components/AgentBar'
import ChatPanel from '../components/ChatPanel'
import CodeView from '../components/CodeView'
import FileEditor from '../components/FileEditor'
import TerminalPanel from '../components/TerminalPanel'
import ProviderConfig from '../components/ProviderConfig'

const PANEL_TABS: { key: RightPanel; label: string; icon: string }[] = [
  { key: 'code', label: 'Code', icon: '📄' },
  { key: 'editor', label: 'Edit', icon: '✏️' },
  { key: 'terminal', label: 'Terminal', icon: '>_' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
]

export default function AppPage() {
  const { state, dispatch, activeSession } = useStore()

  // Load files on mount
  useEffect(() => {
    listFiles().then((files) => dispatch({ type: 'SET_FILES', files })).catch(() => {})
  }, [])

  // Load file content when selected
  useEffect(() => {
    if (state.activeFile && state.fileContent === null) {
      readFile(state.activeFile).then((c) => dispatch({ type: 'SET_ACTIVE_FILE', path: state.activeFile, content: c })).catch(() => {})
    }
  }, [state.activeFile])

  const switchPanel = (panel: RightPanel) => dispatch({ type: 'SET_RIGHT_PANEL', panel })

  const renderRightPanel = () => {
    switch (state.rightPanel) {
      case 'code':
        return <CodeView path={state.activeFile} content={state.fileContent} onClose={() => dispatch({ type: 'SET_ACTIVE_FILE', path: null, content: null })} />
      case 'editor':
        return <FileEditor path={state.activeFile} content={state.fileContent} onSwitchPanel={switchPanel} />
      case 'terminal':
        return <TerminalPanel />
      case 'settings':
        return <ProviderConfig />
    }
  }

  return (
    <div className="flex h-screen flex-col bg-[#0a0a1a]">
      {/* Top bar */}
      <header className="flex h-10 items-center justify-between border-b border-[#1e293b] px-4 shrink-0">
        <Link to="/" className="flex items-center gap-2 text-xs font-mono font-bold">
          <span className="text-[#F8FAFC]">open</span>
          <span className="text-[#22D3EE]">Ply</span>
          <span className="ml-1.5 rounded border border-[#1e293b] px-1 py-0.5 text-[9px] text-[#64748b]">web</span>
        </Link>
        {activeSession && (
          <div className="flex items-center gap-3 text-xs text-[#64748b]">
            <span className="hidden sm:inline">{activeSession.messages.length} messages</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: state.loading ? '#22D3EE' : '#22a34a' }} />
          </div>
        )}
      </header>

      {/* Agent bar */}
      <AgentBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar: sessions */}
        <aside className="w-56 border-r border-[#1e293b] bg-[#0f0f24] hidden md:flex flex-col shrink-0 overflow-hidden">
          <SessionSidebar />
        </aside>

        {/* Center: chat */}
        <main className="flex flex-1 flex-col min-w-0">
          <ChatPanel />
        </main>

        {/* Right panel: code/editor/terminal/settings */}
        <aside className="w-96 border-l border-[#1e293b] bg-[#0f0f24] hidden lg:flex flex-col shrink-0 overflow-hidden">
          {/* Panel tabs */}
          <div className="flex border-b border-[#1e293b] shrink-0">
            {PANEL_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => switchPanel(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 text-[11px] font-medium transition-colors border-b-2 ${
                  state.rightPanel === tab.key
                    ? 'border-[#22D3EE] text-[#22D3EE] bg-[#22D3EE]/5'
                    : 'border-transparent text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#1a1a35]'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden xl:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden">
            {renderRightPanel()}
          </div>
        </aside>

        {/* Mobile panel toggle */}
        <div className="lg:hidden fixed bottom-4 right-4 flex gap-2 z-50">
          {PANEL_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => switchPanel(tab.key)}
              className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm transition-all shadow-lg ${
                state.rightPanel === tab.key
                  ? 'bg-[#22D3EE] text-[#0a0a1a]'
                  : 'bg-[#1a1a35] text-[#64748b] border border-[#1e293b]'
              }`}
            >
              {tab.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
