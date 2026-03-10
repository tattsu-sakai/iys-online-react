import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentCard } from '@/features/initial-setup/components';
import HoldingsSectionBlock from '@/features/portfolio-assets/components/HoldingsSectionBlock';
import { HoldingsSectionSkeleton } from '@/features/portfolio-assets/components/HoldingsSkeleton';
import type { HoldingsSection } from '@/features/portfolio-assets/model';
import { cn } from '@/lib/utils';

type EquityHoldingsCardProps = {
  allDetailsOpen: boolean;
  expandedHoldingIds: Record<string, boolean>;
  isLoading: boolean;
  itemIds: string[];
  onToggleAllDetails: (open: boolean) => void;
  onToggleDetails: (id: string) => void;
  sections: HoldingsSection[];
  title: string;
  dataNodeId?: string;
};

export default function EquityHoldingsCard({
  allDetailsOpen,
  expandedHoldingIds,
  isLoading,
  itemIds,
  onToggleAllDetails,
  onToggleDetails,
  sections,
  title,
  dataNodeId,
}: EquityHoldingsCardProps) {
  return (
    <ContentCard aria-busy={isLoading} className='space-y-5' data-node-id={dataNodeId}>
      <div className='flex flex-col gap-3 border-b border-[rgba(176,149,36,0.38)] pb-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-gold-soft)]'>{title}</h2>
        </div>
        {isLoading ? (
          <Skeleton className='h-10 w-36 rounded-[12px]' />
        ) : (
          <Button
            type='button'
            variant='outline'
            onClick={() => onToggleAllDetails(!allDetailsOpen)}
            className='h-10 rounded-[12px] border-[rgba(33,33,33,0.08)] bg-white px-4 text-[13px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-gold-soft)] shadow-[0_8px_20px_rgba(13,10,44,0.06)] hover:bg-[rgba(111,91,59,0.04)]'
            disabled={itemIds.length === 0}
          >
            {allDetailsOpen ? '全銘柄の詳細を閉じる' : '全銘柄の詳細を表示'}
            <ChevronDown className={cn('h-4 w-4 transition-transform', allDetailsOpen && 'rotate-180')} />
          </Button>
        )}
      </div>

      <div className='space-y-6'>
        {isLoading
          ? Array.from({ length: 2 }).map((_, index) => (
              <HoldingsSectionSkeleton key={index} title={index === 0 ? '特定預り' : 'NISA預り'} />
            ))
          : sections.map((section) => (
              <HoldingsSectionBlock
                key={`${title}-${section.title}`}
                expandedHoldingIds={expandedHoldingIds}
                onToggleDetails={onToggleDetails}
                section={section}
              />
            ))}
      </div>
    </ContentCard>
  );
}
