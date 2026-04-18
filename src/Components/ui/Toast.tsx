import { type ReactNode, useEffect } from 'react';

type ToastTone = 'success' | 'error' | 'info';
type ToastPosition = 'top-right' | 'bottom-right';

export type ToastProps = {
  tone?: ToastTone;
  message: ReactNode;
  open: boolean;
  duration?: number;
  onClose: () => void;
  position?: ToastPosition;
};

const toneStyles: Record<ToastTone, string> = {
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

/**
 * Lightweight toast for transient success, error, or info feedback.
 * Auto-dismisses and also exposes a manual close button.
 */
function Toast({
  tone = 'info',
  message,
  open,
  duration = 3000,
  onClose,
  position = 'top-right',
}: ToastProps): JSX.Element | null {
  useEffect(() => {
    if (!open) return undefined;

    const timeoutId = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timeoutId);
  }, [duration, onClose, open]);

  if (!open) return null;

  return (
    <div
      className={[
        'fixed right-4 z-[1000] flex items-center gap-3 rounded-lg px-4 py-3 shadow-sm',
        position === 'top-right' ? 'top-4' : 'bottom-4',
        toneStyles[tone],
      ].join(' ')}
      role="status"
    >
      <span>{message}</span>
      <button
        className="rounded-md px-2 py-1 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        onClick={onClose}
        type="button"
      >
        Close
      </button>
    </div>
  );
}

export default Toast;
