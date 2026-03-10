import type { HoldingsSection } from '@/features/portfolio-assets/model';
import HoldingCard from '@/features/portfolio-assets/components/HoldingCard';
import { getHoldingItemKey, formatCurrency, formatSignedCurrency } from '@/features/portfolio-assets/utils';
import { cn } from '@/lib/utils';

type HoldingsSectionBlockProps = {
  expandedHoldingIds: Record<string, boolean>;
  onToggleDetails: (id: string) => void;
  section: HoldingsSection;
};

export default function HoldingsSectionBlock({ expandedHoldingIds, onToggleDetails, section }: HoldingsSectionBlockProps) {
  const sectionEvaluationAmount = section.items.reduce((sum, item) => sum + item.evaluationAmount, 0);
  const sectionPnl = section.items.reduce((sum, item) => sum + item.pnl, 0);

  return (
    <section className='space-y-4'>
      <div className='flex flex-col gap-3 border-b-2 border-[rgba(176,149,36,0.32)] pb-3 xl:flex-row xl:items-end xl:justify-between'>
        <div>
          <h2 className='text-[17px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>{section.title}</h2>
        </div>
        <div className='flex flex-wrap gap-2'>
          <span className='rounded-full bg-[rgba(5,32,49,0.05)] px-3 py-1.5 text-[12px] font-semibold text-[var(--ichiyoshi-navy)]'>
            評価額 {formatCurrency(sectionEvaluationAmount)}
          </span>
          <span
            className={cn(
              'rounded-full px-3 py-1.5 text-[12px] font-semibold',
              sectionPnl > 0
                ? 'bg-[rgba(80,122,231,0.12)] text-[#507ae7]'
                : sectionPnl < 0
                  ? 'bg-[rgba(182,23,4,0.1)] text-[#b61704]'
                  : 'bg-[rgba(5,32,49,0.06)] text-[var(--ichiyoshi-ink-soft)]',
            )}
          >
            損益 {formatSignedCurrency(sectionPnl)}
          </span>
        </div>
      </div>
      <div className='space-y-3'>
        {section.items.map((item) => {
          const itemKey = getHoldingItemKey(section.title, item);

          return (
            <HoldingCard
              key={itemKey}
              detailsOpen={!!expandedHoldingIds[itemKey]}
              item={item}
              onToggleDetails={() => onToggleDetails(itemKey)}
            />
          );
        })}
      </div>
    </section>
  );
}
