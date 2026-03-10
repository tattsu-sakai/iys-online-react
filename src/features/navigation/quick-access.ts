import { FileText, History, Landmark, User } from 'lucide-react';

export type QuickAccessKey =
  | 'applications'
  | 'customerInfo'
  | 'portfolioAssets'
  | 'tradeHistory';

export type QuickAccessHandlerMap = Partial<Record<QuickAccessKey, () => void>>;

const quickAccessDefinitions: Array<{
  icon: typeof Landmark;
  key: QuickAccessKey;
  label: string;
}> = [
  { key: 'portfolioAssets', label: '預り資産', icon: Landmark },
  { key: 'tradeHistory', label: '取引履歴', icon: History },
  { key: 'customerInfo', label: 'お客様情報', icon: User },
  { key: 'applications', label: '各種申込み', icon: FileText },
];

export function createQuickAccessItems({
  activeKey,
  handlers,
}: {
  activeKey?: QuickAccessKey;
  handlers: QuickAccessHandlerMap;
}) {
  return quickAccessDefinitions.map((item) => ({
    active: item.key === activeKey,
    icon: item.icon,
    label: item.label,
    onClick: handlers[item.key],
  }));
}

