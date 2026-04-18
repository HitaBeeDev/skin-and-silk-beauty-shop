import Skeleton from '@/components/ui/Skeleton';

function OrderDetailSkeleton(): JSX.Element {
  return (
    <section aria-label="Loading order details" role="status">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <Skeleton height="2rem" width="12rem" />
        <Skeleton height="1.5rem" width="8rem" />
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <Skeleton height="1rem" width="18rem" />
        <div style={{ marginTop: '0.5rem' }}>
          <Skeleton height="1rem" width="14rem" />
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <Skeleton height="1rem" width="12rem" />
              <Skeleton height="1rem" width="4rem" />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <Skeleton height="0.9rem" width="70%" />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.75rem', display: 'grid', gap: '0.75rem' }}>
        <Skeleton height="1rem" width="10rem" />
        <Skeleton height="1rem" width="8rem" />
        <Skeleton height="1rem" width="12rem" />
        <div style={{ marginTop: '0.5rem' }}>
          <Skeleton height="2.5rem" width="9rem" />
        </div>
      </div>
    </section>
  );
}

export default OrderDetailSkeleton;
