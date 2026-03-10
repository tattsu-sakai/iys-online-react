import type { ComponentType } from 'react';

import { Button } from '@/components/ui/button';
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

type PortfolioSidebarSummaryProps = {
  activeTabIcon: ComponentType<{ className?: string }>;
  activeTabLabel: string;
  isLoading: boolean;
  onBackToTop: () => void;
  selectedSummary: SelectedSummary;
};

export default function PortfolioSidebarSummary({
  activeTabIcon: ActiveTabIcon,
  activeTabLabel,
  isLoading,
  onBackToTop,
  selectedSummary,
}: PortfolioSidebarSummaryProps) {
  return (
    <ContentCard aria-busy={isLoading} className='space-y-4'>
      <div className='flex items-center gap-3'>
        <span className='flex h-11 w-11 items-center justify-center rounded-[12px] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-gold-soft)]'>
          <ActiveTabIcon className='h-5 w-5' />
        </span>
        <div>
          <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>表示中の商品</p>
          <h2 className='mt-1 text-[20px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>{activeTabLabel}</h2>
        </div>
      </div>

      <div className='grid gap-3'>
        <div className='rounded-[12px] bg-[rgba(5,32,49,0.03)] px-4 py-4'>
          <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>保有サマリー</p>
          {isLoading ? (
            <>
              <Skeleton className='mt-3 h-5 w-32' />
              <Skeleton className='mt-3 h-4 w-full' />
              <Skeleton className='mt-2 h-4 w-[82%]' />
            </>
          ) : (
            <>
              <p className='mt-2 text-[15px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>{selectedSummary.holdingsLabel}</p>
              <p className='mt-2 text-[14px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>{selectedSummary.note}</p>
            </>
          )}
        </div>
        <div className='rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-white px-4 py-4'>
          <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>評価額合計</p>
          {isLoading ? (
            <Skeleton className='mt-3 h-8 w-32' />
          ) : (
            <p className='mt-2 text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>{formatCurrency(selectedSummary.totalAmount)}</p>
          )}
        </div>
        <div className='rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-white px-4 py-4'>
          <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>評価損益</p>
          {isLoading ? (
            <Skeleton className='mt-3 h-8 w-28' />
          ) : (
            <p
              className={cn(
                'mt-2 text-[22px] font-bold tracking-[0.04em]',
                selectedSummary.totalPnl > 0
                  ? 'text-[#507ae7]'
                  : selectedSummary.totalPnl < 0
                    ? 'text-[#b61704]'
                    : 'text-[var(--ichiyoshi-navy)]',
              )}
            >
              {formatSignedCurrency(selectedSummary.totalPnl)}
            </p>
          )}
        </div>
      </div>

      <Button
        type='button'
        onClick={onBackToTop}
        className='h-12 w-full rounded-[12px] border border-[rgba(33,33,33,0.08)] bg-white text-[15px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-gold-soft)] shadow-[0_10px_26px_rgba(13,10,44,0.08)] hover:bg-[rgba(111,91,59,0.04)]'
      >
        TOPページへ戻る
      </Button>
    </ContentCard>
  );
}
