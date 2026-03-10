import { ChevronDown } from 'lucide-react';

import type { StructuredDetailCell, StructuredHoldingItem } from '@/features/portfolio-assets/model';
import { formatCurrency, formatSignedCurrency } from '@/features/portfolio-assets/utils';
import { cn } from '@/lib/utils';

type StructuredHoldingCardProps = {
  detailsOpen: boolean;
  item: StructuredHoldingItem;
  onToggleDetails: () => void;
};

type InfoPairProps = {
  emphasize?: boolean;
  label: string;
  value: string;
};

function InfoPair({ emphasize = false, label, value }: InfoPairProps) {
  return (
    <div className='rounded-[10px] border border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.03)] px-3 py-2.5'>
      <span className='block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ichiyoshi-gold-soft)]'>{label}</span>
      <span
        className={cn(
          'mt-1 block text-[13px] font-semibold leading-6 text-[var(--ichiyoshi-navy)] whitespace-pre-line break-words',
          emphasize && 'text-[#507ae7]',
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function StructuredHoldingCard({ detailsOpen, item, onToggleDetails }: StructuredHoldingCardProps) {
  const isPositive = item.pnl > 0;
  const isNegative = item.pnl < 0;
  const detailCells: StructuredDetailCell[] = item.detailRows.flatMap((row) => (row.right ? [row.left, row.right] : [row.left]));

  return (
    <article
      aria-expanded={detailsOpen}
      className='relative cursor-pointer overflow-hidden rounded-[14px] border border-[rgba(33,33,33,0.08)] bg-white shadow-[0_8px_22px_rgba(13,10,44,0.06)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(111,91,59,0.32)]'
      onClick={onToggleDetails}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggleDetails();
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
                {item.accountType}
              </span>
              {item.code ? <span className='font-semibold tracking-[0.04em] text-[var(--ichiyoshi-ink-soft)]'>コード {item.code}</span> : null}
              {item.badges?.map((badge) => (
                <span
                  key={badge}
                  className='rounded-full border border-[rgba(5,32,49,0.08)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--ichiyoshi-navy)]'
                >
                  {badge}
                </span>
              ))}
            </div>
            <h3 className='mt-3 text-[16px] font-bold leading-[1.4] tracking-[0.03em] text-[var(--ichiyoshi-navy)] sm:text-[17px]'>
              {item.name}
            </h3>
          </div>

          <div className='grid shrink-0 gap-3 sm:grid-cols-2 lg:min-w-[22rem] lg:grid-cols-2 lg:items-start'>
            <div className='text-left lg:text-right'>
              <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>評価額</p>
              <p className='mt-1 text-[20px] font-bold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>{formatCurrency(item.evaluationAmount)}</p>
            </div>
            <div className='text-left lg:text-right'>
              <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>評価損益</p>
              <p
                className={cn(
                  'mt-1 text-[18px] font-bold tracking-[0.03em]',
                  isPositive ? 'text-[#507ae7]' : isNegative ? 'text-[#b61704]' : 'text-[var(--ichiyoshi-navy)]',
                )}
              >
                {formatSignedCurrency(item.pnl)}
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
            <div className='flex flex-wrap gap-2'>
              {item.code ? (
                <span className='rounded-full bg-[rgba(5,32,49,0.05)] px-2.5 py-1 text-[11px] font-semibold tracking-[0.06em] text-[var(--ichiyoshi-navy)]'>
                  コード {item.code}
                </span>
              ) : null}
              <span className='rounded-full border border-[rgba(5,32,49,0.08)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--ichiyoshi-navy)]'>
                {item.accountType}
              </span>
              {item.badges?.map((badge) => (
                <span
                  key={badge}
                  className='rounded-full border border-[rgba(5,32,49,0.08)] bg-white px-2.5 py-1 text-[11px] text-[var(--ichiyoshi-ink-soft)]'
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className='grid gap-2 sm:[grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]'>
              {detailCells.map((cell) => (
                <InfoPair key={`${cell.label}-${cell.value}`} label={cell.label} value={cell.value} />
              ))}
              <InfoPair emphasize={isPositive} label='評価損益' value={formatSignedCurrency(item.pnl)} />
              <InfoPair label='評価額' value={formatCurrency(item.evaluationAmount)} />
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
