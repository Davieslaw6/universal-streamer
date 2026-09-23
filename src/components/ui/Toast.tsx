'use client';

import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

export type ToastTone = 'success' | 'info' | 'warning';

export interface ToastRecord {
  id: string;
  message: string;
  tone: ToastTone;
}

const TONE_ICON = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
} as const;

export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastRecord;
  onDismiss: (id: string) => void;
}) {
  const Icon = TONE_ICON[toast.tone];

  return (
    <div
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded border border-border bg-bg-elevated px-4 py-3 shadow-lg"
      role="status"
    >
      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      <p className="flex-1 text-sm text-text-primary">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="min-h-touch min-w-touch -mr-2 -mt-1 flex items-center justify-center rounded text-text-secondary hover:bg-bg-hover hover:text-text-primary"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
