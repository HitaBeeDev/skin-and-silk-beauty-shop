import type { ReactNode } from "react";

export type DividerProps = {
  label?: ReactNode;
};

/**
 * Horizontal separator with an optional centered label.
 */
function Divider({ label }: DividerProps): JSX.Element {
  if (!label) return <hr className="border-t border-zinc-300" />;

  return (
    <div className="flex items-center gap-3">
      <hr className="flex-1 border-t border-zinc-300" />
      <span>{label}</span>
      <hr className="flex-1 border-t border-zinc-300" />
    </div>
  );
}

export default Divider;
