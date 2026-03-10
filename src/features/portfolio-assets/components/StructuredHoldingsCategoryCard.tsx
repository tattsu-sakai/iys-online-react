import { Skeleton } from '@/components/ui/skeleton';
import { ContentCard } from '@/features/initial-setup/components';
import StructuredHoldingCard from '@/features/portfolio-assets/components/StructuredHoldingCard';
import type { StructuredHoldingCategory } from '@/features/portfolio-assets/model';
import { getStructuredHoldingItemKey } from '@/features/portfolio-assets/utils';

type StructuredHoldingsCategoryCardProps = {
  category: StructuredHoldingCategory;
  expandedHoldingIds: Record<string, boolean>;
  isLoading: boolean;
  onToggleDetails: (id: string) => void;
};

function StructuredHoldingCardSkeleton() {
  return (
    <article className='overflow-hidden rounded-[10px] border border-[rgba(33,33,33,0.08)] bg-white shadow-[0_2px_12px_rgba(13,10,44,0.08)]'>
      <div className='space-y-2 bg-[var(--ichiyoshi-sub)] px-3 py-2.5'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-8 w-64 max-w-full' />
        <div className='space-y-2 border-t border-[rgba(176,149,36,0.25)] pt-2'>
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-full' />
        </div>
      </div>
    </article>
  );
}

export default function StructuredHoldingsCategoryCard({
  category,
  expandedHoldingIds,
  isLoading,
  onToggleDetails,
}: StructuredHoldingsCategoryCardProps) {
  return (
    <ContentCard aria-busy={isLoading} className='space-y-5'>
      <div className='border-b border-[rgba(176,149,36,0.38)] pb-3'>
        <h2 className='text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-gold-soft)]'>{category.title}</h2>
      </div>

      <div className='space-y-6'>
        {category.sections.map((section) => (
          <section key={`${category.title}-${section.title ?? 'no-section'}`} className='space-y-3'>
            {section.title ? (
              <div className='border-b border-[rgba(5,32,49,0.08)] pb-2'>
                <h3 className='text-[16px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>{section.title}</h3>
              </div>
            ) : null}

            <div className='space-y-3'>
              {isLoading
                ? Array.from({ length: 2 }).map((_, index) => <StructuredHoldingCardSkeleton key={index} />)
                : section.items.map((item) => {
                    const itemKey = getStructuredHoldingItemKey(category.title, section.title, item);

                    return (
                      <StructuredHoldingCard
                        key={itemKey}
                        detailsOpen={!!expandedHoldingIds[itemKey]}
                        item={item}
                        onToggleDetails={() => onToggleDetails(itemKey)}
                      />
                    );
                  })}
            </div>
          </section>
        ))}
      </div>
    </ContentCard>
  );
}
