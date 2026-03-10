import type { ComponentType } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentCard } from '@/features/initial-setup/components';
import { assetTabs, type AssetTabKey } from '@/features/portfolio-assets/model';

type AssetTabsCardProps = {
  activeTab: AssetTabKey;
  onChangeTab: (tab: AssetTabKey) => void;
  tabIcons: Record<AssetTabKey, ComponentType<{ className?: string }>>;
};

export default function AssetTabsCard({ activeTab, onChangeTab, tabIcons }: AssetTabsCardProps) {
  return (
    <ContentCard className='space-y-5' data-node-id='32374:141110'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>商品分類</p>
          <p className='mt-2 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
            商品分類を切り替えて、保有明細の一覧とサマリーを確認できます。
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          const nextTab = assetTabs.find((tab) => tab.key === value)?.key;

          if (nextTab) {
            onChangeTab(nextTab);
          }
        }}
      >
        <TabsList className='grid h-auto w-full grid-cols-3 gap-2 rounded-[14px] bg-[rgba(5,32,49,0.05)] p-2 sm:grid-cols-6'>
          {assetTabs.map((tab) => {
            const Icon = tabIcons[tab.key];

            return (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className='flex h-auto flex-col gap-2 rounded-[10px] px-2 py-3 text-[12px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-ink-soft)] data-[state=active]:bg-white data-[state=active]:text-[var(--ichiyoshi-navy)] data-[state=active]:shadow-[0_12px_24px_rgba(5,32,49,0.08)]'
              >
                <Icon className='h-5 w-5' />
                <span>{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </ContentCard>
  );
}
