import type { CSSProperties } from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';

export type SpinnerProps = {
  size?: SpinnerSize;
  label?: string;
};

const sizeMap: Record<SpinnerSize, string> = {
  sm: '0.875rem',
  md: '1rem',
  lg: '1.25rem',
};

/**
 * Accessible loading indicator with screen-reader text via `role="status"`.
 */
function Spinner({
  size = 'md',
  label = 'Loading',
}: SpinnerProps): JSX.Element {
  const spinnerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: sizeMap[size],
  };

  return (
    <span aria-label={label} role="status" style={spinnerStyle}>
      <span aria-hidden="true">⏳</span>
      <span style={{ position: 'absolute', left: '-9999px' }}>{label}</span>
    </span>
  );
}

export default Spinner;
