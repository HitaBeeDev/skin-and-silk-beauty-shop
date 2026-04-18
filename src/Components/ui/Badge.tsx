import type { ReactNode } from 'react';

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export type BadgeProps = {
  tone?: BadgeTone;
  children: ReactNode;
};

const toneStyles: Record<BadgeTone, string> = {
  neutral: 'bg-gray-100 text-gray-800',
  accent: 'bg-[#F6E6DA] text-[#5A4034]',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
};

/**
 * Compact status badge for cart counts, "New" product labels, and order state.
 */
function Badge({ tone = 'neutral', children }: BadgeProps): JSX.Element {
  return (
    <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${toneStyles[tone]}`}>
      {children}
    </span>
  );
}

export default Badge;
