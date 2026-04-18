import Skeleton from '@/components/ui/Skeleton';

function ProductGridSkeleton(): JSX.Element {
  return (
    <div
      aria-label="Loading products grid"
      role="status"
      className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-6"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <Skeleton className="h-56" />
          <div className="mt-3">
            <Skeleton className="h-5 w-[70%]" />
          </div>
          <div className="mt-2">
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="mt-1.5">
            <Skeleton className="h-4 w-[85%]" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-4 w-[4.5rem]" />
            <Skeleton circle className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGridSkeleton;
