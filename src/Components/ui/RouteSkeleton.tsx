import Skeleton from '@/components/ui/Skeleton';

function RouteSkeleton(): JSX.Element {
  return (
    <section aria-label="Loading page" role="status">
      <Skeleton height="2.25rem" width="12rem" />
      <div style={{ marginTop: '1rem' }}>
        <Skeleton height="1rem" width="18rem" />
      </div>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        <Skeleton height="12rem" />
        <Skeleton height="12rem" />
        <Skeleton height="12rem" />
      </div>
    </section>
  );
}

export default RouteSkeleton;
