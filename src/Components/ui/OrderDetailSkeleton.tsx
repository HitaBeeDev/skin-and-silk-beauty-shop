import Skeleton from "@/components/ui/Skeleton";

function OrderDetailSkeleton(): JSX.Element {
  return (
    <section aria-label="Loading order details" role="status">
      <div className="flex justify-between gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>

      <div className="mt-5">
        <Skeleton className="h-4 w-72" />
        <div className="mt-2">
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <div className="flex justify-between gap-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="mt-2">
              <Skeleton className="h-4 w-[70%]" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48" />
        <div className="mt-2">
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </section>
  );
}

export default OrderDetailSkeleton;
