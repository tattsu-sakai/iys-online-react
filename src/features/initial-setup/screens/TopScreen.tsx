import { useEffect, useRef, useState } from 'react';
import { Bell, LogOut, Menu } from 'lucide-react';

import ImportantInfoPanel from '@/components/ui/important-info-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { BrandFooter, QuickAccessBar, ServiceScreenHeader, ServiceScreenHeroPanel } from '@/features/initial-setup/components';
import AppNavigationMenu from '@/features/navigation/AppNavigationMenu';
import { createQuickAccessItems } from '@/features/navigation/quick-access';
import type { AssetTabKey } from '@/features/portfolio-assets/model';
import NewsCard from '@/features/top-screen/NewsCard';
import OnlineApplicationsCard from '@/features/top-screen/OnlineApplicationsCard';
import PortfolioSummaryCard from '@/features/top-screen/PortfolioSummaryCard';
import { topNotes } from '@/features/top-screen/model';
import { useSimulatedLoading } from '@/hooks/use-simulated-loading';
import { apiClient } from '@/lib/api/mock-client';

type TopScreenProps = {
  onLogout: () => void;
  onOpenApplications: () => void;
  onOpenCustomerInfo: () => void;
  onOpenPortfolioAssets: (tab?: AssetTabKey) => void;
  onOpenTradeHistory: () => void;
  onStartPersonalAccountOpening: () => void;
};

export default function TopScreen({
  onLogout,
  onOpenApplications,
  onOpenCustomerInfo,
  onOpenPortfolioAssets,
  onOpenTradeHistory,
  onStartPersonalAccountOpening,
}: TopScreenProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState('');
  const newsCardRef = useRef<HTMLDivElement>(null);
  const isDashboardLoading = useSimulatedLoading('top-dashboard');
  useEffect(() => {
    void apiClient.tradeHistory
      .getLastUpdatedAt()
      .then((value) => setLastUpdatedAt(new Date(value).toLocaleString('ja-JP')))
      .catch(() => setLastUpdatedAt(''));
  }, []);
  const getQuickActionHandler = (label: string) => {
    if (label === '預り資産') {
      return () => onOpenPortfolioAssets();
    }

    if (label === 'お客様情報') {
      return onOpenCustomerInfo;
    }

    if (label === '各種申込み') {
      return onOpenApplications;
    }

    if (label === '取引履歴') {
      return onOpenTradeHistory;
    }

    return undefined;
  };
  const quickAccessItems = createQuickAccessItems({
    handlers: {
      applications: getQuickActionHandler('各種申込み'),
      customerInfo: getQuickActionHandler('お客様情報'),
      portfolioAssets: getQuickActionHandler('預り資産'),
      tradeHistory: getQuickActionHandler('取引履歴'),
    },
  });

  return (
    <main className='min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(162,133,86,0.18),transparent_24%),radial-gradient(circle_at_90%_10%,rgba(5,32,49,0.16),transparent_20%),linear-gradient(180deg,#f7f3eb_0%,#eef2f4_34%,#e6ebee_100%)]'>
      <div className='mx-auto flex min-h-screen max-w-[1380px] flex-col'>
        <section className='relative flex flex-1 items-stretch justify-center px-0 py-0 sm:px-4 lg:px-6 xl:px-10'>
          <div className='relative w-full max-w-[1180px]'>
            <div className='pointer-events-none absolute inset-x-10 top-5 h-32 rounded-full bg-[rgba(162,133,86,0.18)] blur-3xl' />

            <div className='relative'>
              <ServiceScreenHeader
                actions={
                  <>
                    <button
                      type='button'
                      className='hidden h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white backdrop-blur xl:inline-flex'
                      aria-label='お知らせ'
                      onClick={() => newsCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    >
                      <Bell className='h-4 w-4' />
                    </button>
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
                    <button
                      type='button'
                      onClick={onLogout}
                      className='inline-flex h-11 items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 text-[13px] font-semibold tracking-[0.08em] text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur transition-colors hover:bg-white/16'
                    >
                      <LogOut className='h-4 w-4' />
                      <span className='hidden sm:inline'>ログアウト</span>
                    </button>
                  </>
                }
              >
                <ServiceScreenHeroPanel
                  badge='資産ダッシュボード'
                  description='保有資産と取引状況を、商品分類ごとにひと目で確認できるダッシュボードです。'
                  pretitle={isDashboardLoading ? <Skeleton className='h-5 w-36 rounded-full bg-white/20' /> : 'サンプル太郎 様'}
                  title='サンプルオンライン'
                />
              </ServiceScreenHeader>

              <QuickAccessBar actions={quickAccessItems} containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <div className='px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8'>
                <div className='grid items-start gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]'>
                  <div className='xl:col-span-2'>
                    <PortfolioSummaryCard isLoading={isDashboardLoading} onOpenPortfolioAssets={onOpenPortfolioAssets} />
                  </div>
                  <div ref={newsCardRef}>
                    <NewsCard isLoading={isDashboardLoading} />
                  </div>
                  <div>
                    <OnlineApplicationsCard onStartPersonalAccountOpening={onStartPersonalAccountOpening} />
                  </div>
                  <div className='xl:col-span-2'>
                    <ImportantInfoPanel
                      notes={topNotes}
                      referenceDate='前営業日約定基準'
                      reflectionTiming='翌営業日 06:00 反映'
                      title='表示内容に関する重要なお知らせ'
                      updatedAt={lastUpdatedAt || undefined}
                    />
                  </div>
                </div>
              </div>

              <BrandFooter containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <AppNavigationMenu
                activeScreen='top'
                onClose={() => setMenuOpen(false)}
                onLogout={onLogout}
                onOpenApplications={onOpenApplications}
                onOpenCustomerInfo={onOpenCustomerInfo}
                onOpenPortfolioAssets={() => onOpenPortfolioAssets()}
                onOpenTradeHistory={onOpenTradeHistory}
                open={menuOpen}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
