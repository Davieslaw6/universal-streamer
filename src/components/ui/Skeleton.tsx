export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-bg-hover ${className}`}
    />
  );
}

export function PosterSkeleton() {
  return (
    <div className="w-[150px] shrink-0 sm:w-[170px]">
      <Skeleton className="aspect-[2/3] w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-1 h-3 w-1/3" />
      <div className="mt-2 flex gap-1">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-5 w-5" />
      </div>
    </div>
  );
}

export function RowSkeleton({ title }: { title?: string }) {
  return (
    <section className="mb-10">
      {title ? (
        <div className="mb-3 h-5 w-48">
          <Skeleton className="h-5 w-48" />
        </div>
      ) : (
        <Skeleton className="mb-3 h-5 w-48" />
      )}
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <PosterSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
