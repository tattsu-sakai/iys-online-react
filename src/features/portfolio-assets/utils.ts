import type { DreamCollectionContract, HoldingItem, StructuredHoldingItem } from '@/features/portfolio-assets/model';

const currencyFormatter = new Intl.NumberFormat('ja-JP');

export function formatCurrency(value: number) {
  return `${currencyFormatter.format(value)}円`;
}

export function formatSignedCurrency(value: number) {
  if (value === 0) {
    return '0円';
  }

  return `${value > 0 ? '+' : '-'}${currencyFormatter.format(Math.abs(value))}円`;
}

export function formatSignedPercent(value: number) {
  if (!Number.isFinite(value) || value === 0) {
    return '0.0%';
  }

  return `${value > 0 ? '+' : '-'}${Math.abs(value).toFixed(1)}%`;
}

export function getHoldingItemKey(sectionTitle: string, item: HoldingItem) {
  return `${sectionTitle}-${item.code}-${item.name}-${item.accountType}`;
}

export function getStructuredHoldingItemKey(categoryTitle: string, sectionTitle: string | undefined, item: StructuredHoldingItem) {
  return `${categoryTitle}-${sectionTitle ?? 'no-section'}-${item.code ?? 'no-code'}-${item.name}-${item.accountType}-${item.badges?.join('-') ?? 'no-badge'}`;
}

export function getDreamCollectionContractKey(item: DreamCollectionContract) {
  return `${item.course}-${item.title}`;
}
