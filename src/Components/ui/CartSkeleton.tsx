import Skeleton from '@/components/ui/Skeleton';

function CartSkeleton(): JSX.Element {
  return (
    <section aria-label="Loading cart" role="status">
      <Skeleton height="2rem" width="14rem" />

      <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto auto',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <Skeleton height="1rem" width="75%" />
            <Skeleton height="1rem" width="4rem" />
            <Skeleton height="2rem" width="6rem" />
            <Skeleton circle height="2rem" width="2rem" />
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1.5rem',
          gap: '1rem',
        }}
      >
        <Skeleton height="2.5rem" width="10rem" />
        <Skeleton height="2.5rem" width="8rem" />
        <Skeleton height="2.5rem" width="6rem" />
      </div>
    </section>
  );
}

export default CartSkeleton;
