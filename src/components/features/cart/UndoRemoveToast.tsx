import type { ReactNode } from "react";

import Toast from "@/components/ui/Toast";

type UndoRemoveToastProps = {
  isOpen: boolean;
  itemName?: string;
  onUndo: () => void;
  onClose: () => void;
};

function UndoRemoveToast({
  isOpen,
  itemName,
  onUndo,
  onClose,
}: UndoRemoveToastProps): JSX.Element {
  const message: ReactNode = (
    <div className="flex items-center gap-3">
      <span>{itemName ?? "Item"} removed.</span>
      <button
        className="rounded-md px-2 py-1 font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a4034] focus-visible:ring-offset-2"
        onClick={onUndo}
        type="button"
      >
        Undo
      </button>
    </div>
  );

  return (
    <Toast
      duration={4000}
      isOpen={isOpen}
      message={message}
      onClose={onClose}
      position="bottom-right"
      tone="info"
    />
  );
}

export default UndoRemoveToast;
