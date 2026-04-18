type SpinnerSize = 'sm' | 'md' | 'lg';

export type SpinnerProps = {
  size?: SpinnerSize;
  label?: string;
};

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

/**
 * Accessible loading indicator with screen-reader text via `role="status"`.
 */
function Spinner({
  size = 'md',
  label = 'Loading',
}: SpinnerProps): JSX.Element {
  return (
    <span
      aria-label={label}
      className={`inline-flex items-center gap-1.5 ${sizeMap[size]}`}
      role="status"
    >
      <span aria-hidden="true">⏳</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default Spinner;
