import Skeleton from '@/components/ui/Skeleton';

function ProductDetailSkeleton(): JSX.Element {
  return (
    <section aria-label="Loading product details" role="status">
      <Skeleton height="1rem" width="16rem" />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(16rem, 26rem) 1fr',
          gap: '2rem',
          marginTop: '1.5rem',
        }}
      >
        <Skeleton height="28rem" />

        <div>
          <Skeleton height="0.9rem" width="7rem" />
          <div style={{ marginTop: '0.75rem' }}>
            <Skeleton height="2.5rem" width="80%" />
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <Skeleton height="1.5rem" width="6rem" />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Skeleton height="1rem" width="100%" />
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <Skeleton height="1rem" width="94%" />
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <Skeleton height="1rem" width="78%" />
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <Skeleton height="1rem" width="5rem" />
          </div>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              marginTop: '1.5rem',
            }}
          >
            <Skeleton height="2.5rem" width="8rem" />
            <Skeleton height="2.5rem" width="12rem" />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Skeleton height="1.25rem" width="10rem" />
        <div style={{ marginTop: '0.5rem' }}>
          <Skeleton height="1rem" width="8rem" />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
            gap: '1rem',
            marginTop: '1.25rem',
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <Skeleton height="12rem" />
              <div style={{ marginTop: '0.75rem' }}>
                <Skeleton height="1rem" width="75%" />
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <Skeleton height="1rem" width="4rem" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductDetailSkeleton;
