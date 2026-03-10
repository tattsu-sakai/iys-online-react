import { type ComponentType, useEffect, useMemo, useState } from 'react';
import { ChartPie, FileText, Handshake, History, Landmark, Menu, Sparkles, TrendingUp, User, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { BrandFooter, QuickAccessBar, ServiceScreenHeader, ServiceScreenHeroPanel } from '@/features/initial-setup/components';
import AppNavigationMenu from '@/features/navigation/AppNavigationMenu';
import AssetTabsCard from '@/features/portfolio-assets/components/AssetTabsCard';
import DisplayNotesCard from '@/features/portfolio-assets/components/DisplayNotesCard';
import DomesticPaginationCard from '@/features/portfolio-assets/components/DomesticPaginationCard';
import DreamCollectionContractsCard from '@/features/portfolio-assets/components/DreamCollectionContractsCard';
import DreamCollectionTotalCard from '@/features/portfolio-assets/components/DreamCollectionTotalCard';
import EquityHoldingsCard from '@/features/portfolio-assets/components/EquityHoldingsCard';
import NonEquitySummaryCard from '@/features/portfolio-assets/components/NonEquitySummaryCard';
import PortfolioSidebarSummary from '@/features/portfolio-assets/components/PortfolioSidebarSummary';
import StructuredHoldingsCategoryCard from '@/features/portfolio-assets/components/StructuredHoldingsCategoryCard';
import {
  assetTabs,
  assetTabSummary,
  displayNotesByTab,
  detailedAssetTabs,
  detailedHoldingsPagesByTab,
  domesticEquityPages,
  dreamCollectionContracts,
  dreamCollectionTotal,
  foreignEquitySections,
  type AssetTabKey,
  type DetailedAssetTabKey,
} from '@/features/portfolio-assets/model';
import { getDreamCollectionContractKey, getHoldingItemKey } from '@/features/portfolio-assets/utils';
import { useSimulatedLoading } from '@/hooks/use-simulated-loading';
import { useSearchParams } from 'react-router-dom';

type PortfolioAssetsScreenProps = {
  onBackToTop: () => void;
  onOpenApplications: () => void;
  onOpenCustomerInfo: () => void;
  onOpenTradeHistory: () => void;
  onLogout: () => void;
};

const quickActions: Array<{
  icon: ComponentType<{ className?: string }>;
  label: string;
}> = [
  { label: '預り資産', icon: Landmark },
  { label: '取引履歴', icon: History },
  { label: 'お客様情報', icon: User },
  { label: '各種申込み', icon: FileText },
];

const tabIcons: Record<AssetTabKey, ComponentType<{ className?: string }>> = {
  bond: Landmark,
  cash: Wallet,
  dreamCollection: Sparkles,
  equity: TrendingUp,
  investmentTrust: ChartPie,
  margin: Handshake,
};

function isAssetTabKey(value: string | null): value is AssetTabKey {
  return assetTabs.some((tab) => tab.key === value);
}

function isDetailedAssetTabKey(value: AssetTabKey): value is DetailedAssetTabKey {
  return detailedAssetTabs.includes(value as DetailedAssetTabKey);
}

export default function PortfolioAssetsScreen({
  onBackToTop,
  onOpenApplications,
  onOpenCustomerInfo,
  onOpenTradeHistory,
  onLogout,
}: PortfolioAssetsScreenProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [expandedHoldingIds, setExpandedHoldingIds] = useState<Record<string, boolean>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const tabParam = searchParams.get('tab');
  const activeTab: AssetTabKey = isAssetTabKey(tabParam) ? tabParam : 'equity';
  const isHoldingsLoading = useSimulatedLoading(`${activeTab}-${currentPage}`);

  useEffect(() => {
    setCurrentPage(0);
  }, [activeTab]);

  const currentDomesticSections = activeTab === 'equity' ? (domesticEquityPages[currentPage]?.sections ?? []) : [];
  const currentDetailedPages = isDetailedAssetTabKey(activeTab) ? detailedHoldingsPagesByTab[activeTab] : null;
  const currentDetailedCategories = currentDetailedPages?.[currentPage]?.categories ?? [];

  useEffect(() => {
    if (!currentDetailedPages) {
      return;
    }

    if (currentPage > currentDetailedPages.length - 1) {
      setCurrentPage(0);
    }
  }, [currentDetailedPages, currentPage]);

  const domesticHoldingIds = useMemo(
    () => currentDomesticSections.flatMap((section) => section.items.map((item) => getHoldingItemKey(section.title, item))),
    [currentDomesticSections],
  );
  const foreignHoldingIds = useMemo(
    () => foreignEquitySections.flatMap((section) => section.items.map((item) => getHoldingItemKey(section.title, item))),
    [],
  );
  const dreamCollectionContractIds = useMemo(
    () => dreamCollectionContracts.map((contract) => getDreamCollectionContractKey(contract)),
    [],
  );
  const equitySummary = useMemo(() => {
    const domesticItems = domesticEquityPages.flatMap((page) => page.sections.flatMap((section) => section.items));
    const foreignItems = foreignEquitySections.flatMap((section) => section.items);
    const allItems = [...domesticItems, ...foreignItems];

    return {
      holdingsCount: allItems.length,
      totalAmount: allItems.reduce((sum, item) => sum + item.evaluationAmount, 0),
      totalPnl: allItems.reduce((sum, item) => sum + item.pnl, 0),
    };
  }, []);

  const detailedTabSummary = useMemo(() => {
    if (!isDetailedAssetTabKey(activeTab)) {
      return null;
    }

    const allItems = detailedHoldingsPagesByTab[activeTab].flatMap((page) =>
      page.categories.flatMap((category) => category.sections.flatMap((section) => section.items)),
    );

    const tabLabel = assetTabs.find((tab) => tab.key === activeTab)?.label ?? '';

    return {
      holdingsLabel: `${tabLabel} ${allItems.length}銘柄`,
      note: assetTabSummary[activeTab].note,
      totalAmount: allItems.reduce((sum, item) => sum + item.evaluationAmount, 0),
      totalPnl: allItems.reduce((sum, item) => sum + item.pnl, 0),
    };
  }, [activeTab]);

  const selectedSummary =
    activeTab === 'equity'
      ? {
          holdingsLabel: `${equitySummary.holdingsCount}銘柄を表示`,
          note: assetTabSummary.equity.note,
          totalAmount: equitySummary.totalAmount,
          totalPnl: equitySummary.totalPnl,
        }
      : detailedTabSummary ?? assetTabSummary[activeTab];

  const activeTabLabel = assetTabs.find((tab) => tab.key === activeTab)?.label ?? '';
  const ActiveTabIcon = tabIcons[activeTab];
  const domesticExpandedCount = domesticHoldingIds.filter((itemId) => expandedHoldingIds[itemId]).length;
  const foreignExpandedCount = foreignHoldingIds.filter((itemId) => expandedHoldingIds[itemId]).length;
  const allDomesticDetailsOpen = domesticHoldingIds.length > 0 && domesticExpandedCount === domesticHoldingIds.length;
  const allForeignDetailsOpen = foreignHoldingIds.length > 0 && foreignExpandedCount === foreignHoldingIds.length;
  const notesContent = displayNotesByTab[activeTab];
  const quickAccessItems = quickActions.map((action) => ({
    ...action,
    active: action.label === '預り資産',
    onClick:
      action.label === '取引履歴'
        ? onOpenTradeHistory
        : action.label === 'お客様情報'
          ? onOpenCustomerInfo
          : action.label === '各種申込み'
            ? onOpenApplications
            : undefined,
  }));

  const handleToggleHoldingDetails = (itemId: string) => {
    setExpandedHoldingIds((current) => ({
      ...current,
      [itemId]: !current[itemId],
    }));
  };

  const handleSetSectionHoldingDetails = (itemIds: string[], open: boolean) => {
    setExpandedHoldingIds((current) => {
      const next = { ...current };

      itemIds.forEach((itemId) => {
        next[itemId] = open;
      });

      return next;
    });
  };

  useEffect(() => {
    if (activeTab !== 'dreamCollection') {
      return;
    }

    setExpandedHoldingIds((current) => {
      const hasInitialized = dreamCollectionContractIds.some((itemId) => itemId in current);

      if (hasInitialized) {
        return current;
      }

      const next = { ...current };
      const defaultOpenId = dreamCollectionContractIds[1] ?? dreamCollectionContractIds[0];

      if (defaultOpenId) {
        next[defaultOpenId] = true;
      }

      return next;
    });
  }, [activeTab, dreamCollectionContractIds]);

  const handleChangeTab = (tab: AssetTabKey) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('tab', tab);
    setSearchParams(nextSearchParams, { replace: true });
  };

  return (
    <main className='min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(162,133,86,0.18),transparent_24%),radial-gradient(circle_at_90%_10%,rgba(5,32,49,0.16),transparent_20%),linear-gradient(180deg,#f7f3eb_0%,#eef2f4_34%,#e6ebee_100%)]'>
      <div className='mx-auto flex min-h-screen max-w-[1380px] flex-col'>
        <section className='relative flex flex-1 items-stretch justify-center px-0 py-0 sm:px-4 lg:px-6 xl:px-10'>
          <div className='relative w-full max-w-[1180px]'>
            <div className='pointer-events-none absolute inset-x-10 top-5 h-32 rounded-full bg-[rgba(162,133,86,0.18)] blur-3xl' />

            <div className='relative'>
              <ServiceScreenHeader
                className='border-b border-[rgba(255,255,255,0.14)]'
                actions={
                  <>
                    <button
                      type='button'
                      className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white backdrop-blur'
                      aria-label='メニュー'
                      aria-expanded={menuOpen}
                      aria-haspopup='dialog'
                      onClick={() => setMenuOpen(true)}
                    >
                      <Menu className='h-4 w-4' />
                    </button>
                    <Button
                      type='button'
                      onClick={onBackToTop}
                      className='h-11 rounded-full border border-white/12 bg-white/10 px-4 text-[13px] font-semibold tracking-[0.08em] text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur hover:bg-white/16'
                    >
                      TOPへ戻る
                    </Button>
                  </>
                }
              >
                <ServiceScreenHeroPanel
                  badge='資産一覧'
                  description='商品分類ごとに保有明細を見渡せる一覧画面です。'
                  title='預り資産'
                />
              </ServiceScreenHeader>

              <QuickAccessBar actions={quickAccessItems} containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <div className='px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8'>
                <div className='grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
                  <div className='space-y-4'>
                    <AssetTabsCard activeTab={activeTab} onChangeTab={handleChangeTab} tabIcons={tabIcons} />

                    <DisplayNotesCard
                      description={notesContent.description}
                      notes={notesContent.notes}
                      notesOpen={notesOpen}
                      onToggle={() => setNotesOpen((current) => !current)}
                    />

                    {activeTab === 'dreamCollection' ? (
                      <>
                        <DreamCollectionTotalCard isLoading={isHoldingsLoading} summary={dreamCollectionTotal} />
                        <DreamCollectionContractsCard
                          contracts={dreamCollectionContracts}
                          expandedContractIds={expandedHoldingIds}
                          isLoading={isHoldingsLoading}
                          onToggleContract={handleToggleHoldingDetails}
                        />
                      </>
                    ) : activeTab === 'equity' ? (
                      <>
                        <EquityHoldingsCard
                          allDetailsOpen={allDomesticDetailsOpen}
                          expandedHoldingIds={expandedHoldingIds}
                          isLoading={isHoldingsLoading}
                          itemIds={domesticHoldingIds}
                          onToggleAllDetails={(open) => handleSetSectionHoldingDetails(domesticHoldingIds, open)}
                          onToggleDetails={handleToggleHoldingDetails}
                          sections={currentDomesticSections}
                          title='国内株式'
                          dataNodeId='32374:141137'
                        />

                        <EquityHoldingsCard
                          allDetailsOpen={allForeignDetailsOpen}
                          expandedHoldingIds={expandedHoldingIds}
                          isLoading={isHoldingsLoading}
                          itemIds={foreignHoldingIds}
                          onToggleAllDetails={(open) => handleSetSectionHoldingDetails(foreignHoldingIds, open)}
                          onToggleDetails={handleToggleHoldingDetails}
                          sections={foreignEquitySections}
                          title='外国株式'
                        />

                        <DomesticPaginationCard
                          currentPage={currentPage}
                          isLoading={isHoldingsLoading}
                          onNext={() => setCurrentPage((current) => Math.min(current + 1, domesticEquityPages.length - 1))}
                          onPrevious={() => setCurrentPage((current) => Math.max(current - 1, 0))}
                          onSelectPage={setCurrentPage}
                          totalPages={domesticEquityPages.length}
                        />
                      </>
                    ) : isDetailedAssetTabKey(activeTab) ? (
                      <>
                        {currentDetailedCategories.map((category) => (
                          <StructuredHoldingsCategoryCard
                            key={`${activeTab}-${currentPage}-${category.title}`}
                            category={category}
                            expandedHoldingIds={expandedHoldingIds}
                            isLoading={isHoldingsLoading}
                            onToggleDetails={handleToggleHoldingDetails}
                          />
                        ))}

                        <DomesticPaginationCard
                          currentPage={currentPage}
                          isLoading={isHoldingsLoading}
                          onNext={() =>
                            setCurrentPage((current) => Math.min(current + 1, (currentDetailedPages?.length ?? 1) - 1))
                          }
                          onPrevious={() => setCurrentPage((current) => Math.max(current - 1, 0))}
                          onSelectPage={setCurrentPage}
                          totalPages={currentDetailedPages?.length ?? 1}
                        />
                      </>
                    ) : (
                      <NonEquitySummaryCard
                        activeTabIcon={ActiveTabIcon}
                        activeTabLabel={activeTabLabel}
                        isLoading={isHoldingsLoading}
                        selectedSummary={selectedSummary}
                      />
                    )}

                    <div className='xl:hidden'>
                      <Button
                        type='button'
                        onClick={onBackToTop}
                        className='h-12 w-full rounded-[12px] border border-[rgba(33,33,33,0.08)] bg-white text-[15px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-gold-soft)] shadow-[0_10px_26px_rgba(13,10,44,0.08)] hover:bg-[rgba(111,91,59,0.04)]'
                      >
                        TOPページへ戻る
                      </Button>
                    </div>
                  </div>

                  <div className='hidden xl:block xl:self-stretch'>
                    <div className='xl:sticky xl:top-6'>
                      <PortfolioSidebarSummary
                        activeTabIcon={ActiveTabIcon}
                        activeTabLabel={activeTabLabel}
                        isLoading={isHoldingsLoading}
                        onBackToTop={onBackToTop}
                        selectedSummary={selectedSummary}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <BrandFooter containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <AppNavigationMenu
                activeScreen='portfolioAssets'
                onClose={() => setMenuOpen(false)}
                onLogout={onLogout}
                onOpenApplications={onOpenApplications}
                onOpenCustomerInfo={onOpenCustomerInfo}
                onOpenPortfolioAssets={() => setMenuOpen(false)}
                onOpenTradeHistory={onOpenTradeHistory}
                onOpenTop={onBackToTop}
                open={menuOpen}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
