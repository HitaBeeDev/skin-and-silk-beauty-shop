import type { CSSProperties } from 'react';

export type SkeletonProps = {
  className?: string;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  circle?: boolean;
};

/**
 * Placeholder block for loading layouts.
 * Accepts `className` for future CSS-driven sizing and optional inline width/height today.
 */
function Skeleton({
  className,
  width = '100%',
  height = '1rem',
  circle = false,
}: SkeletonProps): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        width,
        height,
        borderRadius: circle ? '999px' : '0.5rem',
        background:
          'linear-gradient(90deg, rgba(230,230,230,1) 0%, rgba(245,245,245,1) 50%, rgba(230,230,230,1) 100%)',
        backgroundSize: '200% 100%',
      }}
    />
  );
}

export default Skeleton;
