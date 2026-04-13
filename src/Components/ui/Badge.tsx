import type { CSSProperties, ReactNode } from 'react';

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export type BadgeProps = {
  tone?: BadgeTone;
  children: ReactNode;
};

const toneStyles: Record<BadgeTone, CSSProperties> = {
  neutral: { backgroundColor: '#f3f4f6', color: '#1f2937' },
  accent: { backgroundColor: '#F6E6DA', color: '#5A4034' },
  success: { backgroundColor: '#dcfce7', color: '#166534' },
  warning: { backgroundColor: '#fef3c7', color: '#92400e' },
  danger: { backgroundColor: '#fee2e2', color: '#991b1b' },
};

/**
 * Compact status badge for cart counts, "New" product labels, and order state.
 */
function Badge({ tone = 'neutral', children }: BadgeProps): JSX.Element {
  return (
    <span
      style={{
        ...toneStyles[tone],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '999px',
        padding: '0.2rem 0.55rem',
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}

export default Badge;
