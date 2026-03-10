import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentCard } from '@/features/initial-setup/components';
import { cn } from '@/lib/utils';

type DomesticPaginationCardProps = {
  currentPage: number;
  isLoading: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSelectPage: (pageIndex: number) => void;
  totalPages: number;
};

export default function DomesticPaginationCard({
  currentPage,
  isLoading,
  onNext,
  onPrevious,
  onSelectPage,
  totalPages,
}: DomesticPaginationCardProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const paginationGridStyle = {
    gridTemplateColumns: `48px repeat(${safeTotalPages}, minmax(0, 1fr)) 48px`,
  };

  return (
    <ContentCard aria-busy={isLoading} className='space-y-4'>
      <div className='flex items-center justify-between gap-3'>
        <p className='text-[12px] font-semibold tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)]'>ページ</p>
        {isLoading ? (
          <Skeleton className='h-4 w-12' />
        ) : (
          <p className='text-[13px] text-[var(--ichiyoshi-ink-soft)]'>
            {currentPage + 1} / {safeTotalPages}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className='grid gap-2' style={paginationGridStyle}>
          {Array.from({ length: safeTotalPages + 2 }).map((_, index) => (
            <Skeleton key={index} className='h-12 rounded-[10px]' />
          ))}
        </div>
      ) : (
        <div className='grid gap-2' style={paginationGridStyle}>
          <Button
            type='button'
            variant='outline'
            onClick={onPrevious}
            disabled={currentPage === 0}
            className='h-12 rounded-[10px] border-[rgba(33,33,33,0.08)] bg-white text-[var(--ichiyoshi-gold-soft)] disabled:bg-white/70'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          {Array.from({ length: safeTotalPages }).map((_, index) => (
            <Button
              key={index}
              type='button'
              variant='outline'
              onClick={() => onSelectPage(index)}
              className={cn(
                'h-12 rounded-[10px] border-[rgba(33,33,33,0.08)] text-[15px] font-bold shadow-[0_6px_18px_rgba(13,10,44,0.06)]',
                currentPage === index
                  ? 'bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] text-white hover:opacity-95'
                  : 'bg-white text-[var(--ichiyoshi-gold-soft)] hover:bg-[rgba(111,91,59,0.04)]',
              )}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            type='button'
            variant='outline'
            onClick={onNext}
            disabled={currentPage === safeTotalPages - 1}
            className='h-12 rounded-[10px] border-[rgba(33,33,33,0.08)] bg-white text-[var(--ichiyoshi-gold-soft)] disabled:bg-white/70'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      )}
    </ContentCard>
  );
}
