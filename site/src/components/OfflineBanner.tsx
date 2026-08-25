import { useStore } from '../lib/store'

export default function OfflineBanner() {
  const { state } = useStore()
  if (state.backend === 'online') return null

  if (state.backend === 'offline') {
    return (
      <div className="flex h-7 shrink-0 items-center justify-center gap-2 border-b border-[#f87171]/20 bg-[#f87171]/10 text-[11px] text-[#f87171]">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f87171]" />
        Backend offline — chat unavailable. Retrying every 15s…
      </div>
    )
  }

  return (
    <div className="flex h-7 shrink-0 items-center justify-center gap-2 border-b border-[#fbbf24]/20 bg-[#fbbf24]/5 text-[11px] text-[#fbbf24]">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#fbbf24]" />
      Connecting to backend…
    </div>
  )
}
