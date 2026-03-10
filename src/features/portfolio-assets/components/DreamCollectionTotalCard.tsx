import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { ContentCard } from '@/features/initial-setup/components';
import type { DreamCollectionTotal } from '@/features/portfolio-assets/model';
import { formatCurrency, formatSignedCurrency } from '@/features/portfolio-assets/utils';
import { cn } from '@/lib/utils';

type DreamCollectionTotalCardProps = {
  isLoading: boolean;
  summary: DreamCollectionTotal;
};

export default function DreamCollectionTotalCard({ isLoading, summary }: DreamCollectionTotalCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const isPositive = summary.pnl > 0;
  const isNegative = summary.pnl < 0;

  return (
    <ContentCard aria-busy={isLoading} className='space-y-4' data-node-id='32374:141285'>
      <h2 className='text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-gold-soft)]'>ドリコレ契約 合計</h2>

      <article className='relative overflow-hidden rounded-[14px] border border-[rgba(33,33,33,0.08)] bg-white shadow-[0_8px_22px_rgba(13,10,44,0.06)]'>
        <div
          className={cn(
            'absolute inset-y-0 left-0 w-1.5',
            isPositive
              ? 'bg-[linear-gradient(180deg,#7aa2ff_0%,#507ae7_100%)]'
              : isNegative
                ? 'bg-[linear-gradient(180deg,#d56b58_0%,#b61704_100%)]'
                : 'bg-[linear-gradient(180deg,#b8c3cb_0%,#8096a5_100%)]',
          )}
        />

        <button
          type='button'
          className='flex w-full items-start gap-3 px-4 py-4 text-left sm:px-5'
          onClick={() => setDetailsOpen((current) => !current)}
        >
          <div className='flex-1'>
            <div className='relative pr-10'>
              <div className='flex flex-wrap items-center gap-2 text-[12px] text-[var(--ichiyoshi-ink-soft)]'>
                <span className='rounded-full bg-[rgba(162,133,86,0.12)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ichiyoshi-navy)]'>
                  ドリコレ契約
                </span>
                <span className='font-semibold tracking-[0.04em]'>ポートフォリオ全体</span>
              </div>
              <h3 className='mt-3 text-[17px] font-bold leading-[1.35] tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>
                {summary.title}
              </h3>

              <span className='pointer-events-none absolute right-0 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] text-[var(--ichiyoshi-navy)]'>
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', detailsOpen && 'rotate-180')} />
              </span>
            </div>

            {isLoading ? (
              <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className='rounded-[10px] border border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.03)] px-3 py-2.5'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='mt-2 h-6 w-32' />
                  </div>
                ))}
              </div>
            ) : (
              <div className='mt-4 grid gap-2 sm:grid-cols-2'>
                <div className='rounded-[10px] border border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.03)] px-3 py-2.5'>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ichiyoshi-gold-soft)]'>時価評価額</p>
                  <p className='mt-1 text-[17px] font-bold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>
                    {formatCurrency(summary.evaluationAmount)}
                  </p>
                </div>
                <div className='rounded-[10px] border border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.03)] px-3 py-2.5'>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ichiyoshi-gold-soft)]'>評価損益</p>
                  <p
                    className={cn(
                      'mt-1 text-[17px] font-bold tracking-[0.03em]',
                      summary.pnl > 0 ? 'text-[#507ae7]' : summary.pnl < 0 ? 'text-[#b61704]' : 'text-[var(--ichiyoshi-navy)]',
                    )}
                  >
                    {formatSignedCurrency(summary.pnl)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </button>

        {detailsOpen ? (
          <div className='space-y-2 border-t border-[rgba(5,32,49,0.06)] px-4 py-3 sm:px-5'>
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className='rounded-[10px] border border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.03)] px-3 py-2.5'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='mt-2 h-5 w-28' />
                  </div>
                ))
              : summary.detailRows.map((row) => (
                  <div
                    key={row.label}
                    className='flex items-center justify-between gap-3 rounded-[10px] border border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.03)] px-3 py-2.5'
                  >
                    <p className='text-[13px] tracking-[0.04em] text-[var(--ichiyoshi-ink-soft)]'>{row.label}</p>
                    <p className='text-right text-[15px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                      {formatCurrency(row.value)}
                    </p>
                  </div>
                ))}
          </div>
        ) : null}
      </article>
    </ContentCard>
  );
}
