import type { ComponentType } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { ContentCard } from '@/features/initial-setup/components';
import { formatCurrency, formatSignedCurrency } from '@/features/portfolio-assets/utils';
import { cn } from '@/lib/utils';

type SelectedSummary = {
  holdingsLabel: string;
  note: string;
  totalAmount: number;
  totalPnl: number;
};

type NonEquitySummaryCardProps = {
  activeTabIcon: ComponentType<{ className?: string }>;
  activeTabLabel: string;
  isLoading: boolean;
  selectedSummary: SelectedSummary;
};

export default function NonEquitySummaryCard({
  activeTabIcon: ActiveTabIcon,
  activeTabLabel,
  isLoading,
  selectedSummary,
}: NonEquitySummaryCardProps) {
  return (
    <ContentCard aria-busy={isLoading} className='space-y-4'>
      <div className='flex items-center gap-3'>
        <span className='flex h-11 w-11 items-center justify-center rounded-[12px] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-gold-soft)]'>
          <ActiveTabIcon className='h-5 w-5' />
        </span>
        <div>
          {isLoading ? (
            <Skeleton className='h-4 w-28' />
          ) : (
            <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>
              {selectedSummary.holdingsLabel}
            </p>
          )}
          <h2 className='mt-1 text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>{activeTabLabel}</h2>
        </div>
      </div>
      {isLoading ? (
        <>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-[86%]' />
          </div>
          <div className='grid gap-3 sm:grid-cols-2'>
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className='rounded-[12px] bg-[rgba(5,32,49,0.03)] px-4 py-4'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='mt-3 h-8 w-28' />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className='text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>{selectedSummary.note}</p>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div className='rounded-[12px] bg-[rgba(5,32,49,0.03)] px-4 py-4'>
              <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>評価額合計</p>
              <p className='mt-2 text-[20px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>{formatCurrency(selectedSummary.totalAmount)}</p>
            </div>
            <div className='rounded-[12px] bg-[rgba(5,32,49,0.03)] px-4 py-4'>
              <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>評価損益</p>
              <p
                className={cn(
                  'mt-2 text-[20px] font-bold tracking-[0.04em]',
                  selectedSummary.totalPnl > 0
                    ? 'text-[#507ae7]'
                    : selectedSummary.totalPnl < 0
                      ? 'text-[#b61704]'
                      : 'text-[var(--ichiyoshi-navy)]',
                )}
              >
                {formatSignedCurrency(selectedSummary.totalPnl)}
              </p>
            </div>
          </div>
        </>
      )}
    </ContentCard>
  );
}
