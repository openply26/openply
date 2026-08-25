import { useEffect } from 'react'
import { useStore } from '../lib/store'

function ToastItem({ toast, onDismiss }: { toast: { id: string; type: string; message: string }; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  const color = toast.type === 'success' ? '#4ade80' : toast.type === 'error' ? '#f87171' : '#22D3EE'
  const bg = toast.type === 'success' ? 'rgba(74,222,128,0.1)' : toast.type === 'error' ? 'rgba(248,113,113,0.1)' : 'rgba(34,211,238,0.1)'

  return (
    <div
      className="pointer-events-auto flex max-w-sm items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs shadow-xl"
      style={{ borderColor: `${color}30`, background: bg, color }}
    >
      <span className="flex-1 break-words">{toast.message}</span>
      <button onClick={onDismiss} className="opacity-50 transition-opacity hover:opacity-100">✕</button>
    </div>
  )
}

export default function ToastHost() {
  const { state, dispatch } = useStore()
  if (state.toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {state.toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dispatch({ type: 'DISMISS_TOAST', id: t.id })} />
      ))}
    </div>
  )
}
