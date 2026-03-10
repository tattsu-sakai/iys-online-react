import { Skeleton } from '@/components/ui/skeleton';

export function HoldingCardSkeleton() {
  return (
    <article className='relative overflow-hidden rounded-[14px] border border-[rgba(33,33,33,0.08)] bg-white shadow-[0_8px_22px_rgba(13,10,44,0.06)]'>
      <div className='absolute inset-y-0 left-0 w-1.5 bg-[linear-gradient(180deg,#d8dee3_0%,#b9c4cc_100%)]' />
      <div className='space-y-4 px-4 py-4 sm:px-5'>
        <div className='relative flex flex-col gap-4 pr-10 sm:pr-12 lg:flex-row lg:items-start lg:justify-between'>
          <div className='min-w-0 flex-1 space-y-3'>
            <div className='flex flex-wrap items-center gap-3'>
              <div className='flex flex-wrap items-center gap-2'>
                <Skeleton className='h-6 w-20 rounded-full' />
                <Skeleton className='h-4 w-24' />
              </div>
            </div>
            <Skeleton className='h-6 w-56 max-w-full' />
          </div>

          <div className='grid shrink-0 gap-3 sm:grid-cols-2 lg:min-w-[22rem] lg:grid-cols-2 lg:items-start'>
            <div className='space-y-2 text-left lg:text-right'>
              <Skeleton className='h-4 w-12 lg:ml-auto' />
              <Skeleton className='h-8 w-36 lg:ml-auto' />
            </div>
            <div className='space-y-2 text-left lg:text-right'>
              <Skeleton className='h-4 w-14 lg:ml-auto' />
              <div className='flex flex-wrap items-center gap-2 lg:flex-col lg:items-end'>
                <Skeleton className='h-7 w-24' />
                <Skeleton className='h-6 w-16 rounded-full' />
              </div>
            </div>
          </div>
          <Skeleton className='absolute right-0 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full' />
        </div>
      </div>
    </article>
  );
}

type HoldingsSectionSkeletonProps = {
  title: string;
};

export function HoldingsSectionSkeleton({ title }: HoldingsSectionSkeletonProps) {
  return (
    <section className='space-y-4'>
      <div className='flex flex-col gap-3 border-b-2 border-[rgba(176,149,36,0.32)] pb-3 xl:flex-row xl:items-end xl:justify-between'>
        <div>
          <h2 className='text-[17px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>{title}</h2>
          <Skeleton className='mt-2 h-4 w-36' />
        </div>
        <Skeleton className='h-10 w-36 rounded-[12px]' />
      </div>
      <div className='space-y-3'>
        {Array.from({ length: 2 }).map((_, index) => (
          <HoldingCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
