import { type ReactNode, useEffect } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

type ToastTone = "success" | "error" | "info";
type ToastPosition = "top-right" | "bottom-right";

export type ToastProps = {
  tone?: ToastTone;
  message: ReactNode;
  isOpen: boolean;
  duration?: number;
  onClose: () => void;
  position?: ToastPosition;
};

const toneStyles: Record<
  ToastTone,
  {
    container: string;
    badge: string;
    icon: typeof CheckCircle2;
    label: string;
    closeRing: string;
  }
> = {
  success: {
    container:
      "border-[#e7d7cb] bg-[#fffaf5] text-[#241915] shadow-[0_24px_60px_-40px_rgba(36,25,21,0.42)]",
    badge: "bg-[#f6e6da] text-[#8c1d40]",
    icon: CheckCircle2,
    label: "Added",
    closeRing: "focus-visible:ring-[#8c1d40]/30",
  },
  error: {
    container:
      "border-[#efcfcd] bg-[#fff5f3] text-[#3d1f1a] shadow-[0_24px_60px_-40px_rgba(92,1,32,0.32)]",
    badge: "bg-[#f8dede] text-[#9f1239]",
    icon: XCircle,
    label: "Issue",
    closeRing: "focus-visible:ring-[#9f1239]/30",
  },
  info: {
    container:
      "border-[#ead9ca] bg-[#fffaf5] text-[#241915] shadow-[0_24px_60px_-40px_rgba(36,25,21,0.38)]",
    badge: "bg-[#f6e6da] text-[#5a4034]",
    icon: Info,
    label: "Notice",
    closeRing: "focus-visible:ring-[#5a4034]/30",
  },
};

/**
 * Lightweight toast for transient success, error, or info feedback.
 * Auto-dismisses and also exposes a manual close button.
 */
function Toast({
  tone = "info",
  message,
  isOpen,
  duration = 3000,
  onClose,
  position = "top-right",
}: ToastProps): JSX.Element | null {
  useEffect(() => {
    if (!isOpen) return undefined;

    const timeoutId = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timeoutId);
  }, [duration, isOpen, onClose]);

  if (!isOpen) return null;

  const toastTone = toneStyles[tone];
  const Icon = toastTone.icon;

  return (
    <div
      className={[
        "fixed right-4 z-[1000] w-[min(calc(100vw-2rem),24rem)] overflow-hidden rounded-[1.6rem] border backdrop-blur-sm transition-all duration-300 ease-out",
        position === "top-right" ? "top-4" : "bottom-6",
        toastTone.container,
      ].join(" ")}
      aria-live={tone === "error" ? "assertive" : "polite"}
      role={tone === "error" ? "alert" : "status"}
    >
      <div className="absolute inset-y-0 left-0 w-1.5 bg-[#8c1d40]" />
      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3 px-5 py-4">
        <div
          className={`mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full ${toastTone.badge}`}
        >
          <Icon aria-hidden="true" size={18} strokeWidth={2.1} />
        </div>

        <div className="min-w-0">
          <p
            className={`font-['Quicksand',sans-serif] text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${toastTone.badge} inline-flex rounded-full px-2.5 py-1`}
          >
            {toastTone.label}
          </p>
          <div className="mt-2 text-sm leading-6 text-inherit">{message}</div>
        </div>

        <button
          aria-label="Close notification"
          className={[
            "inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-white/60 text-[#5a4034] transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            toastTone.closeRing,
          ].join(" ")}
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={16} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}

export default Toast;
