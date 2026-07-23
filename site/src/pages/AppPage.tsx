import { useEffect, useState } from 'react'
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
import ToolBar from '../components/ToolBar'
import StatusBar from '../components/StatusBar'

const PANEL_TABS: { key: RightPanel; label: string; icon: string }[] = [
  { key: 'code', label: 'Code', icon: '📄' },
  { key: 'editor', label: 'Edit', icon: '✏️' },
  { key: 'terminal', label: 'Terminal', icon: '>_' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
]

export default function AppPage() {
  const { state, dispatch, activeSession } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    listFiles().then((files) => dispatch({ type: 'SET_FILES', files })).catch(() => {})
  }, [])

  useEffect(() => {
    if (state.activeFile && state.fileContent === null) {
      readFile(state.activeFile).then((c) => dispatch({ type: 'SET_ACTIVE_FILE', path: state.activeFile, content: c })).catch(() => {})
    }
  }, [state.activeFile])

  const switchPanel = (panel: RightPanel) => {
    dispatch({ type: 'SET_RIGHT_PANEL', panel })
    setPanelOpen(true)
  }

  const renderRightPanel = () => {
    switch (state.rightPanel) {
      case 'code': return <CodeView path={state.activeFile} content={state.fileContent} onClose={() => dispatch({ type: 'SET_ACTIVE_FILE', path: null, content: null })} />
      case 'editor': return <FileEditor path={state.activeFile} content={state.fileContent} onSwitchPanel={switchPanel} />
      case 'terminal': return <TerminalPanel />
      case 'settings': return <ProviderConfig />
    }
  }

  return (
    <div className="flex h-screen flex-col bg-[#0a0a1a] overflow-hidden">
      {/* Top bar */}
      <header className="flex h-10 items-center justify-between border-b border-[#1e293b] px-2 sm:px-4 shrink-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1.5 text-[#64748b] hover:text-[#e2e8f0]" aria-label="Open sidebar">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link to="/" className="flex items-center gap-1.5 text-xs font-mono font-bold">
            <span className="text-[#F8FAFC]">open</span>
            <span className="text-[#22D3EE]">Ply</span>
            <span className="hidden xs:inline ml-1 rounded border border-[#1e293b] px-1 py-0.5 text-[9px] text-[#64748b]">web</span>
          </Link>
        </div>
        {activeSession && (
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-[#64748b]">
            <span className="hidden sm:inline">{activeSession.messages.length} messages</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: state.loading ? '#22D3EE' : '#22a34a' }} />
          </div>
        )}
      </header>

      {/* Agent bar */}
      <AgentBar />

      {/* Tool bar */}
      <div className="hidden sm:block"><ToolBar /></div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-[#0a0a1a]/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-[260px] bg-[#0f0f24] border-r border-[#1e293b] animate-in slide-in-from-left">
              <div className="flex items-center justify-between p-3 border-b border-[#1e293b]">
                <span className="text-xs font-semibold text-[#64748b]">Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="text-[#64748b] hover:text-[#e2e8f0] text-lg">&times;</button>
              </div>
              <SessionSidebar />
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-52 lg:w-56 border-r border-[#1e293b] bg-[#0f0f24] flex-col shrink-0 overflow-hidden">
          <SessionSidebar />
        </aside>

        {/* Center: chat */}
        <main className="flex flex-1 flex-col min-w-0">
          {/* Mobile tool bar */}
          <div className="sm:hidden"><ToolBar /></div>
          <ChatPanel />
        </main>

        {/* Desktop right panel */}
        <aside className="hidden lg:flex w-80 xl:w-96 border-l border-[#1e293b] bg-[#0f0f24] flex-col shrink-0 overflow-hidden">
          <div className="flex border-b border-[#1e293b] shrink-0 overflow-x-auto">
            {PANEL_TABS.map((tab) => (
              <button key={tab.key} onClick={() => switchPanel(tab.key)}
                className={`flex items-center gap-1 px-2.5 sm:px-4 py-2 text-[11px] font-medium transition-colors border-b-2 shrink-0 ${
                  state.rightPanel === tab.key ? 'border-[#22D3EE] text-[#22D3EE] bg-[#22D3EE]/5' : 'border-transparent text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#1a1a35]'
                }`}>
                <span>{tab.icon}</span>
                <span className="hidden xl:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden">{renderRightPanel()}</div>
        </aside>

        {/* Mobile right panel overlay */}
        {panelOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-[#0a0a1a]/60 backdrop-blur-sm" onClick={() => setPanelOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-[400px] bg-[#0f0f24] border-l border-[#1e293b] animate-in slide-in-from-right flex flex-col">
              <div className="flex items-center justify-between border-b border-[#1e293b] shrink-0">
                <div className="flex overflow-x-auto">
                  {PANEL_TABS.map((tab) => (
                    <button key={tab.key} onClick={() => dispatch({ type: 'SET_RIGHT_PANEL', panel: tab.key })}
                      className={`flex items-center gap-1 px-4 py-2.5 text-xs font-medium border-b-2 shrink-0 ${
                        state.rightPanel === tab.key ? 'border-[#22D3EE] text-[#22D3EE] bg-[#22D3EE]/5' : 'border-transparent text-[#64748b]'
                      }`}>
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setPanelOpen(false)} className="px-3 text-[#64748b] hover:text-[#e2e8f0] text-lg">&times;</button>
              </div>
              <div className="flex-1 overflow-hidden">{renderRightPanel()}</div>
            </div>
          </div>
        )}

        {/* Mobile bottom panel toggle */}
        <div className="lg:hidden fixed bottom-16 right-3 flex flex-col gap-2 z-30">
          {PANEL_TABS.map((tab) => (
            <button key={tab.key} onClick={() => switchPanel(tab.key)}
              className={`h-9 w-9 rounded-xl flex items-center justify-center text-sm transition-all shadow-lg ${
                state.rightPanel === tab.key ? 'bg-[#22D3EE] text-[#0a0a1a]' : 'bg-[#1a1a35] text-[#64748b] border border-[#1e293b]'
              }`}>{tab.icon}</button>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <StatusBar />
    </div>
  )
}
