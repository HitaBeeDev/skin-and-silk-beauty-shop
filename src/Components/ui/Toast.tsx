import { type CSSProperties, type ReactNode, useEffect } from 'react';

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

const toneStyles: Record<ToastTone, CSSProperties> = {
  success: { backgroundColor: '#dcfce7', color: '#166534' },
  error: { backgroundColor: '#fee2e2', color: '#991b1b' },
  info: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
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
      role="status"
      style={{
        ...toneStyles[tone],
        position: 'fixed',
        right: '1rem',
        top: position === 'top-right' ? '1rem' : undefined,
        bottom: position === 'bottom-right' ? '1rem' : undefined,
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <span>{message}</span>
      <button onClick={onClose} type="button">
        Close
      </button>
    </div>
  );
}

export default Toast;
