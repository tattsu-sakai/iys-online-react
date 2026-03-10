import { Bell, ChevronRight } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { ContentCard, SectionLabel } from '@/features/initial-setup/components';
import { topNewsItems } from '@/features/top-screen/model';

type NewsCardProps = {
  isLoading: boolean;
};

export default function NewsCard({ isLoading }: NewsCardProps) {
  const featuredNews = topNewsItems[0];
  const secondaryNewsItems = topNewsItems.slice(1);

  return (
    <ContentCard aria-busy={isLoading} className='space-y-5'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <SectionLabel>お知らせ / NEWS</SectionLabel>
          <p className='mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
            重要なお知らせと新着情報を、TOP 画面からすぐ確認できるようにまとめています。
          </p>
        </div>
        {isLoading ? (
          <Skeleton className='h-8 w-24 shrink-0 rounded-full' />
        ) : (
          <span className='inline-flex shrink-0 self-start items-center justify-center rounded-full bg-[rgba(162,133,86,0.12)] px-3 py-1 text-[12px] font-semibold leading-none tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)] whitespace-nowrap'>
            新着 {topNewsItems.length} 件
          </span>
        )}
      </div>

      {isLoading ? (
        <>
          <article className='rounded-[14px] border border-[rgba(162,133,86,0.16)] bg-[linear-gradient(145deg,rgba(133,104,63,0.12),rgba(255,255,255,0.96)_45%,rgba(5,32,49,0.03)_100%)] p-5 shadow-[0_18px_40px_rgba(5,32,49,0.08)]'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div className='flex min-w-0 items-start gap-3'>
                <Skeleton className='h-10 w-10 shrink-0 rounded-[12px]' />
                <div className='min-w-0 space-y-3'>
                  <Skeleton className='h-6 w-16 rounded-full' />
                  <Skeleton className='h-7 w-64 max-w-full' />
                </div>
              </div>
              <Skeleton className='h-7 w-20 rounded-full' />
            </div>
            <div className='mt-4 space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-[88%]' />
            </div>
          </article>

          <div className='space-y-3'>
            {Array.from({ length: secondaryNewsItems.length }).map((_, index) => (
              <article
                key={index}
                className='flex items-start justify-between gap-4 rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-white/90 px-4 py-4 shadow-[0_12px_28px_rgba(5,32,49,0.05)]'
              >
                <div className='min-w-0 flex-1 space-y-3'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <Skeleton className='h-5 w-14 rounded-full' />
                    <Skeleton className='h-4 w-20' />
                  </div>
                  <Skeleton className='h-5 w-56 max-w-full' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-[82%]' />
                </div>
                <Skeleton className='hidden h-9 w-9 shrink-0 rounded-full sm:block' />
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          <article className='rounded-[14px] border border-[rgba(162,133,86,0.16)] bg-[linear-gradient(145deg,rgba(133,104,63,0.12),rgba(255,255,255,0.96)_45%,rgba(5,32,49,0.03)_100%)] p-5 shadow-[0_18px_40px_rgba(5,32,49,0.08)]'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div className='flex min-w-0 items-start gap-3'>
                <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[rgba(162,133,86,0.14)] text-[var(--ichiyoshi-gold-soft)]'>
                  <Bell className='h-4 w-4' />
                </span>
                <div className='min-w-0'>
                  <div className='inline-flex rounded-full border border-[rgba(111,91,59,0.14)] bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>
                    {featuredNews.category}
                  </div>
                  <h3 className='mt-3 text-[20px] font-bold leading-[1.45] tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                    {featuredNews.title}
                  </h3>
                </div>
              </div>
              <span className='inline-flex shrink-0 self-start items-center justify-center rounded-full border border-[rgba(5,32,49,0.08)] bg-white/88 px-3 py-1 text-[11px] font-semibold leading-none tracking-[0.08em] text-[var(--ichiyoshi-ink-soft)] whitespace-nowrap'>
                {featuredNews.date}
              </span>
            </div>

            <p className='mt-4 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>{featuredNews.summary}</p>
          </article>

          <div className='space-y-3'>
            {secondaryNewsItems.map((item) => (
              <article
                key={item.title}
                className='flex items-start justify-between gap-4 rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-white/90 px-4 py-4 shadow-[0_12px_28px_rgba(5,32,49,0.05)]'
              >
                <div className='min-w-0'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='rounded-full bg-[rgba(5,32,49,0.05)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ichiyoshi-ink-soft)]'>
                      {item.category}
                    </span>
                    <span className='text-[11px] font-semibold tracking-[0.08em] text-[var(--ichiyoshi-muted)]'>{item.date}</span>
                  </div>
                  <p className='mt-3 text-[15px] font-bold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>{item.title}</p>
                  <p className='mt-2 text-[13px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>{item.summary}</p>
                </div>
                <span className='hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(5,32,49,0.05)] text-[var(--ichiyoshi-navy)] sm:flex'>
                  <ChevronRight className='h-4 w-4' />
                </span>
              </article>
            ))}
          </div>
        </>
      )}
    </ContentCard>
  );
}
