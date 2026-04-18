import Skeleton from '@/components/ui/Skeleton';

function ProductGridSkeleton(): JSX.Element {
  return (
    <div
      aria-label="Loading products grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
        gap: '1.5rem',
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <Skeleton height="14rem" />
          <div style={{ marginTop: '0.75rem' }}>
            <Skeleton height="1.25rem" width="70%" />
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <Skeleton height="0.9rem" width="100%" />
          </div>
          <div style={{ marginTop: '0.35rem' }}>
            <Skeleton height="0.9rem" width="85%" />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.9rem',
            }}
          >
            <Skeleton height="1rem" width="4.5rem" />
            <Skeleton circle height="2rem" width="2rem" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGridSkeleton;
