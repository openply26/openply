import { useStore } from '../lib/store'

const DESIGN_MODES = [
  { id: 'audit', label: 'Audit', icon: '🔍', desc: 'Scan UI for issues, score, and prioritize fixes' },
  { id: 'checkup', label: 'Checkup', icon: '🏥', desc: 'Traffic-light score — what to fix and in what order' },
  { id: 'smell', label: 'Smell', icon: '👃', desc: 'Detect visual inconsistencies and anti-patterns' },
  { id: 'recolor', label: 'Recolor', icon: '🎨', desc: 'Build full color system in OKLCH palette' },
  { id: 'typeset', label: 'Typeset', icon: '🔤', desc: 'Typography scale, hierarchy, and rhythm' },
  { id: 'spacing', label: 'Spacing', icon: '📐', desc: 'Consistent spacing and layout grid' },
  { id: 'icons', label: 'Icons', icon: '⭐', desc: 'Icon audit, consistency check, and replacement' },
  { id: 'redesign', label: 'Redesign', icon: '✨', desc: 'Complete visual transformation of interface' },
  { id: 'relayout', label: 'Relayout', icon: '📋', desc: 'Reorganize layout structure and component tree' },
  { id: 'finish', label: 'Finish', icon: '🏁', desc: 'Final pre-ship polish — friction removal, hardening' },
  { id: 'create', label: 'Create', icon: '🆕', desc: 'Design a new page from brief and taste' },
  { id: 'access', label: 'Accessibility', icon: '♿', desc: 'Audit and fix accessibility issues (WCAG)' },
  { id: 'responsive', label: 'Responsive', icon: '📱', desc: 'Responsive design review and fixes' },
  { id: 'dark', label: 'Dark Mode', icon: '🌙', desc: 'Dark mode implementation and review' },
  { id: 'motion', label: 'Motion', icon: '🎬', desc: 'Animation audit, polish, and performance' },
  { id: 'tokens', label: 'Tokens', icon: '🔧', desc: 'Extract repeated patterns into design tokens' },
  { id: 'review', label: 'Review', icon: '👁️', desc: 'Full design review with structured feedback' },
]

interface Props {
  onSelectMode: (modeId: string, component?: string) => void
  onClose: () => void
}

export default function DesignPartner({ onSelectMode, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a1a]/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-[640px] max-h-[80vh] rounded-xl sm:rounded-2xl border border-[#1e293b] bg-[#0d0d20] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#1e293b] px-4 sm:px-5 py-3">
          <h2 className="text-xs sm:text-sm font-semibold text-[#e2e8f0]">🎨 Design Partner — 17 modes</h2>
          <button onClick={onClose} className="text-lg text-[#64748b] hover:text-[#e2e8f0]">&times;</button>
        </div>
        <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto max-h-[60vh]">
          {DESIGN_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => { onSelectMode(mode.id); onClose() }}
              className="flex items-start gap-2.5 sm:gap-3 rounded-xl border border-[#1e293b] bg-[#0f0f24] p-3 text-left transition-all hover:border-[#22D3EE]/30 hover:bg-[#1a1a35] group"
            >
              <span className="text-lg mt-0.5">{mode.icon}</span>
              <div>
                <div className="text-[11px] sm:text-xs font-semibold text-[#e2e8f0] group-hover:text-[#22D3EE] transition-colors">{mode.label}</div>
                <div className="text-[10px] text-[#64748b] mt-0.5">{mode.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
