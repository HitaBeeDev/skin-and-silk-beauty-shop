import Skeleton from "@/components/ui/Skeleton";

function ProductGridSkeleton(): JSX.Element {
  return (
    <div
      aria-label="Loading products grid"
      role="status"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.1rem] border border-[#8c1d40]/10 bg-white shadow-[0_18px_45px_rgba(85,0,0,0.08)]"
        >
          <div className="overflow-hidden bg-[#fff0f2]">
            <Skeleton className="aspect-[4/5] w-full rounded-none" />
          </div>
          <div className="flex flex-col gap-3 px-5 py-5">
            <Skeleton className="h-7 w-[78%] rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-[88%] rounded-full" />
            <div className="mt-2 flex items-center justify-between">
              <Skeleton className="h-4 w-[5.5rem] rounded-full" />
              <Skeleton isCircle className="h-11 w-11" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGridSkeleton;
