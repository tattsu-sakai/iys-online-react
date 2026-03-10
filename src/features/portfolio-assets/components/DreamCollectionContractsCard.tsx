import { ChevronDown } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { ContentCard } from '@/features/initial-setup/components';
import type { DreamCollectionContract, DreamCollectionDetailCell } from '@/features/portfolio-assets/model';
import { formatCurrency, formatSignedCurrency, getDreamCollectionContractKey } from '@/features/portfolio-assets/utils';
import { cn } from '@/lib/utils';

type DreamCollectionContractsCardProps = {
  contracts: DreamCollectionContract[];
  expandedContractIds: Record<string, boolean>;
  isLoading: boolean;
  onToggleContract: (id: string) => void;
};

function getCellAlignmentClass(align: DreamCollectionDetailCell['align']) {
  if (align === 'center') {
    return 'text-center';
  }

  if (align === 'left') {
    return 'text-left';
  }

  return 'text-right';
}

function DreamCollectionContractSkeleton() {
  return (
    <article className='overflow-hidden rounded-[14px] border border-[rgba(33,33,33,0.08)] bg-white shadow-[0_8px_22px_rgba(13,10,44,0.06)]'>
      <div className='space-y-3 px-4 py-4 sm:px-5'>
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-6 w-56 max-w-full' />
        <div className='grid gap-2 sm:grid-cols-2'>
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
        </div>
      </div>
    </article>
  );
}

type DreamCollectionContractCardProps = {
  contract: DreamCollectionContract;
  detailsOpen: boolean;
  onToggle: () => void;
};

function DreamCollectionContractCard({ contract, detailsOpen, onToggle }: DreamCollectionContractCardProps) {
  const isPositive = contract.pnl > 0;
  const isNegative = contract.pnl < 0;
  const detailCells = contract.detailRows.flatMap((row) => (row.right ? [row.left, row.right] : [row.left]));

  return (
    <article
      aria-expanded={detailsOpen}
      className='relative cursor-pointer overflow-hidden rounded-[14px] border border-[rgba(33,33,33,0.08)] bg-white shadow-[0_8px_22px_rgba(13,10,44,0.06)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(111,91,59,0.3)]'
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggle();
        }
      }}
      role='button'
      tabIndex={0}
    >
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

      <div className='space-y-4 px-4 py-4 sm:px-5'>
        <div className='relative flex flex-col gap-4 pr-10 sm:pr-12 lg:flex-row lg:items-start lg:justify-between'>
          <div className='min-w-0 flex-1'>
            <div className='flex flex-wrap items-center gap-2 text-[12px] text-[var(--ichiyoshi-ink-soft)]'>
              <span className='rounded-full bg-[rgba(162,133,86,0.12)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ichiyoshi-navy)]'>
                {contract.course}
              </span>
              <span className='rounded-full border border-[rgba(5,32,49,0.08)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--ichiyoshi-navy)]'>
                ドリコレ契約
              </span>
            </div>
            <h3 className='mt-3 text-[16px] font-bold leading-[1.4] tracking-[0.03em] text-[var(--ichiyoshi-navy)] sm:text-[17px]'>
              {contract.title}
            </h3>
          </div>

          <div className='grid shrink-0 gap-3 sm:grid-cols-2 lg:min-w-[20rem] lg:grid-cols-2 lg:items-start'>
            <div className='text-left lg:text-right'>
              <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>時価評価額</p>
              <p className='mt-1 text-[18px] font-bold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>{formatCurrency(contract.evaluationAmount)}</p>
            </div>
            <div className='text-left lg:text-right'>
              <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>評価損益</p>
              <p
                className={cn(
                  'mt-1 text-[17px] font-bold tracking-[0.03em]',
                  contract.pnl > 0 ? 'text-[#507ae7]' : contract.pnl < 0 ? 'text-[#b61704]' : 'text-[var(--ichiyoshi-navy)]',
                )}
              >
                {formatSignedCurrency(contract.pnl)}
              </p>
            </div>
          </div>
          <span
            aria-hidden='true'
            className='pointer-events-none absolute right-0 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] text-[var(--ichiyoshi-navy)]'
          >
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', detailsOpen && 'rotate-180')} />
          </span>
        </div>

        {detailsOpen ? (
          <div className='space-y-3 border-t border-[rgba(5,32,49,0.06)] pt-3'>
            <div className='grid gap-2 sm:[grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]'>
              {contract.summaryRows.map((row) => (
                <div key={row.label} className='rounded-[10px] border border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.03)] px-3 py-2.5'>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ichiyoshi-gold-soft)]'>{row.label}</p>
                  <p className='mt-1 text-[14px] font-semibold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>{formatCurrency(row.value)}</p>
                </div>
              ))}
            </div>

            <div className='grid gap-2 sm:[grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]'>
              {detailCells.map((cell, index) => (
                <div
                  key={`${contract.title}-${cell.label}-${index}`}
                  className='rounded-[10px] border border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.03)] px-3 py-2.5'
                >
                  <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ichiyoshi-gold-soft)]'>{cell.label}</p>
                  <p className={cn('mt-1 text-[14px] font-semibold leading-6 tracking-[0.03em] text-[var(--ichiyoshi-navy)]', getCellAlignmentClass(cell.align))}>
                    {cell.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function DreamCollectionContractsCard({
  contracts,
  expandedContractIds,
  isLoading,
  onToggleContract,
}: DreamCollectionContractsCardProps) {
  return (
    <ContentCard aria-busy={isLoading} className='space-y-4' data-node-id='32374:141286'>
      <h2 className='text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-gold-soft)]'>ドリコレ契約 一覧</h2>

      <div className='space-y-3'>
        {isLoading
          ? Array.from({ length: 2 }).map((_, index) => <DreamCollectionContractSkeleton key={index} />)
          : contracts.map((contract) => {
              const contractKey = getDreamCollectionContractKey(contract);

              return (
                <DreamCollectionContractCard
                  key={contractKey}
                  contract={contract}
                  detailsOpen={!!expandedContractIds[contractKey]}
                  onToggle={() => onToggleContract(contractKey)}
                />
              );
            })}
      </div>
    </ContentCard>
  );
}
