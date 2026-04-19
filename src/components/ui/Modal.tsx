import { type KeyboardEvent, type ReactNode, useEffect, useRef } from "react";

type ModalCompositionProps = {
  children: ReactNode;
};

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

function ModalHeader({ children }: ModalCompositionProps): JSX.Element {
  return <div className="mb-4">{children}</div>;
}

function ModalBody({ children }: ModalCompositionProps): JSX.Element {
  return <div className="grid gap-3">{children}</div>;
}

function ModalFooter({ children }: ModalCompositionProps): JSX.Element {
  return <div className="mt-4 flex justify-end gap-3">{children}</div>;
}

type ModalComponent = ((props: ModalProps) => JSX.Element | null) & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
};

/**
 * Accessible modal dialog with Escape handling, focus trap, and backdrop close.
 */
const Modal: ModalComponent = function Modal({
  isOpen,
  onClose,
  children,
}: ModalProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    lastActiveElementRef.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent | globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const focusable = panelRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      lastActiveElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;

    const focusableElements = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hasAttribute("disabled"));

    if (!focusableElements.length) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      aria-hidden={false}
      className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-lg rounded-xl bg-white p-4"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={trapFocus}
        ref={panelRef}
        role="dialog"
      >
        <button
          aria-label="Close dialog"
          className="ml-auto rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
