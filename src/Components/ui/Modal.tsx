import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';

type ModalCompositionProps = {
  children: ReactNode;
};

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
};

const panelStyle: CSSProperties = {
  backgroundColor: '#fff',
  width: 'min(32rem, 100%)',
  borderRadius: '0.75rem',
  padding: '1rem',
};

const headerStyle: CSSProperties = {
  marginBottom: '1rem',
};

const bodyStyle: CSSProperties = {
  display: 'grid',
  gap: '0.75rem',
};

const footerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '1rem',
};

function ModalHeader({ children }: ModalCompositionProps): JSX.Element {
  return <div style={headerStyle}>{children}</div>;
}

function ModalBody({ children }: ModalCompositionProps): JSX.Element {
  return <div style={bodyStyle}>{children}</div>;
}

function ModalFooter({ children }: ModalCompositionProps): JSX.Element {
  return <div style={footerStyle}>{children}</div>;
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
  open,
  onClose,
  children,
}: ModalProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;

    lastActiveElementRef.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent | globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const focusable = panelRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      lastActiveElementRef.current?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;

  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !panelRef.current) return;

    const focusableElements = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hasAttribute('disabled'));

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
      onClick={onClose}
      role="presentation"
      style={overlayStyle}
    >
      <div
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={trapFocus}
        ref={panelRef}
        role="dialog"
        style={panelStyle}
      >
        <button
          aria-label="Close dialog"
          style={{ marginLeft: 'auto' }}
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
