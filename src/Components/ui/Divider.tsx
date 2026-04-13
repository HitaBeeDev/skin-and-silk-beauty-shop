import type { CSSProperties, ReactNode } from 'react';

export type DividerProps = {
  label?: ReactNode;
};

/**
 * Horizontal separator with an optional centered label.
 */
function Divider({ label }: DividerProps): JSX.Element {
  const lineStyle: CSSProperties = {
    flex: 1,
    border: 0,
    borderTop: '1px solid #d4d4d8',
  };

  if (!label) return <hr style={{ borderTop: '1px solid #d4d4d8' }} />;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <hr style={lineStyle} />
      <span>{label}</span>
      <hr style={lineStyle} />
    </div>
  );
}

export default Divider;
