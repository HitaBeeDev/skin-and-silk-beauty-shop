import Skeleton from '@/components/ui/Skeleton';

function ProductGridSkeleton(): JSX.Element {
  return (
    <div
      aria-label="Loading products grid"
      role="status"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[2rem] border border-[#ead9ca] bg-white shadow-[0_20px_45px_-34px_rgba(36,25,21,0.34)]"
        >
          <div className="overflow-hidden bg-[#fbf3ec]">
            <Skeleton className="aspect-[4/5] w-full rounded-none" />
          </div>
          <div className="flex flex-col gap-3 px-5 py-5">
            <Skeleton className="h-7 w-[78%] rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-[88%] rounded-full" />
            <div className="mt-2 flex items-center justify-between">
              <Skeleton className="h-4 w-[5.5rem] rounded-full" />
              <Skeleton circle className="h-11 w-11" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGridSkeleton;
