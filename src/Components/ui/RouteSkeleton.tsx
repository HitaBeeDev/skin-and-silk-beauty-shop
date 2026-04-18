import Skeleton from "@/components/ui/Skeleton";

function RouteSkeleton(): JSX.Element {
  return (
    <section aria-label="Loading page" role="status">
      <Skeleton className="h-9 w-48" />
      <div className="mt-4">
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="mt-8 grid gap-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </section>
  );
}

export default RouteSkeleton;
