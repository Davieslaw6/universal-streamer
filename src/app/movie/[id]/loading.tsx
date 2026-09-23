import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div aria-busy="true" className="flex flex-col gap-8">
      <span className="sr-only">Loading title…</span>
      <Skeleton className="-mx-4 -mt-4 aspect-[21/9] w-[calc(100%+2rem)] rounded-none" />
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <Skeleton className="aspect-[2/3] w-[160px] rounded md:w-full" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}
