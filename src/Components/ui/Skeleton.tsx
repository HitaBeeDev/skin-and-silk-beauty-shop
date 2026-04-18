export type SkeletonProps = {
  className?: string;
  circle?: boolean;
};

/**
 * Placeholder block for loading layouts.
 * Accepts `className` for future CSS-driven sizing and optional inline width/height today.
 */
function Skeleton({
  className,
  circle = false,
}: SkeletonProps): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={[
        'animate-pulse bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%]',
        circle ? 'rounded-full' : 'rounded-lg',
        className ?? 'h-4 w-full',
      ].join(' ')}
    />
  );
}

export default Skeleton;
