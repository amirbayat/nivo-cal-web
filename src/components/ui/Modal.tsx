import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

// اولین کامپوننت مودال این اپ — قبل از این فقط window.confirm خام استفاده می‌شد (LogsPage).
export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-[0_20px_60px_rgba(20,35,29,0.25)]"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
