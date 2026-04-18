import Skeleton from "@/components/ui/Skeleton";

function ProductDetailSkeleton(): JSX.Element {
  return (
    <section aria-label="Loading product details" role="status">
      <Skeleton className="h-4 w-64" />

      <div className="mt-6 grid grid-cols-[minmax(16rem,26rem)_1fr] gap-8">
        <Skeleton className="h-[28rem]" />

        <div>
          <Skeleton className="h-4 w-28" />
          <div className="mt-3">
            <Skeleton className="h-10 w-[80%]" />
          </div>
          <div className="mt-3">
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="mt-2">
            <Skeleton className="h-4 w-[94%]" />
          </div>
          <div className="mt-2">
            <Skeleton className="h-4 w-[78%]" />
          </div>
          <div className="mt-5">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Skeleton className="h-5 w-40" />
        <div className="mt-2">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="h-48" />
              <div className="mt-3">
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="mt-2">
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductDetailSkeleton;
