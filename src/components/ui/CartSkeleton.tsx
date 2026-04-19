import Skeleton from "@/components/ui/Skeleton";

function CartSkeleton(): JSX.Element {
  return (
    <section aria-label="Loading cart" role="status">
      <Skeleton className="h-8 w-56" />

      <div className="mt-6 grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4"
          >
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-24" />
            <Skeleton isCircle className="h-8 w-8" />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </section>
  );
}

export default CartSkeleton;
