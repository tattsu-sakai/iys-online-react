import { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  History,
  Info,
  Menu,
  Search,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import ImportantInfoPanel from '@/components/ui/important-info-panel';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BrandFooter,
  ContentCard,
  QuickAccessBar,
  SectionLabel,
  ServiceScreenHeader,
  ServiceScreenHeroPanel,
} from '@/features/initial-setup/components';
import AppNavigationMenu from '@/features/navigation/AppNavigationMenu';
import { createQuickAccessItems } from '@/features/navigation/quick-access';
import type { AssetTabKey } from '@/features/portfolio-assets/model';
import { trackAuditEvent } from '@/features/security/audit';
import TradeHistorySearchModal from '@/features/trade-history/TradeHistorySearchModal';
import {
  defaultTradeHistoryFilters,
  historyPeriods,
  tradeHistoryAccountOptions,
  tradeHistoryProductOptions,
  tradeHistoryRecords,
  transactionCategoryOptions,
  type HistoryPeriodKey,
  type TradeHistoryAccountKey,
  type TradeHistoryFilters,
  type TradeHistoryProductKey,
  type TradeHistoryRecord,
  type TradeHistoryTone,
  type TransactionCategoryKey,
} from '@/features/trade-history/model';
import { useSimulatedLoading } from '@/hooks/use-simulated-loading';
import { apiClient } from '@/lib/api/mock-client';
import type { TradeHistoryFilterPreset } from '@/lib/api/client';
import { cn } from '@/lib/utils';

type TradeHistoryScreenProps = {
  onBackToTop: () => void;
  onOpenApplications: () => void;
  onOpenCustomerInfo: () => void;
  onOpenPortfolioAssets: (tab?: AssetTabKey) => void;
  onLogout: () => void;
};

const pageSize = 5;
const referenceDate = new Date('2025-01-31T00:00:00');
const defaultPeriod: HistoryPeriodKey = '3m';

function formatCurrency(value: number) {
  return `${new Intl.NumberFormat('ja-JP').format(value)}円`;
}

function formatShortDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
}

function isHistoryPeriodKey(value: string | null): value is HistoryPeriodKey {
  return historyPeriods.some((period) => period.key === value);
}

function isTradeHistoryProductKey(value: string | null): value is TradeHistoryProductKey {
  return tradeHistoryProductOptions.some((option) => option.key === value);
}

function isTransactionCategoryKey(value: string | null): value is TransactionCategoryKey {
  return transactionCategoryOptions.some((option) => option.key === value);
}

function isTradeHistoryAccountKey(value: string | null): value is TradeHistoryAccountKey {
  return tradeHistoryAccountOptions.some((option) => option.key === value);
}

function getToneClasses(tone: TradeHistoryTone) {
  if (tone === 'buy') {
    return {
      accent: 'bg-[linear-gradient(180deg,#7aa2ff_0%,#507ae7_100%)]',
      badge: 'bg-[rgba(80,122,231,0.12)] text-[#507ae7]',
      value: 'text-[#507ae7]',
    };
  }

  if (tone === 'sell') {
    return {
      accent: 'bg-[linear-gradient(180deg,#d56b58_0%,#b61704_100%)]',
      badge: 'bg-[rgba(182,23,4,0.1)] text-[#b61704]',
      value: 'text-[#b61704]',
    };
  }

  if (tone === 'income') {
    return {
      accent: 'bg-[linear-gradient(180deg,#b59a5c_0%,#8b723f_100%)]',
      badge: 'bg-[rgba(162,133,86,0.14)] text-[var(--ichiyoshi-gold-soft)]',
      value: 'text-[var(--ichiyoshi-gold-soft)]',
    };
  }

  return {
    accent: 'bg-[linear-gradient(180deg,#92a0ab_0%,#6f8290_100%)]',
    badge: 'bg-[rgba(5,32,49,0.08)] text-[var(--ichiyoshi-ink-soft)]',
    value: 'text-[var(--ichiyoshi-navy)]',
  };
}

function getInitialFilters(searchParams: URLSearchParams): TradeHistoryFilters {
  const accountParam = searchParams.get('account');
  const productParam = searchParams.get('product');
  const transactionParam = searchParams.get('transaction');

  return {
    account: isTradeHistoryAccountKey(accountParam)
      ? accountParam
      : defaultTradeHistoryFilters.account,
    product: isTradeHistoryProductKey(productParam)
      ? productParam
      : defaultTradeHistoryFilters.product,
    transaction: isTransactionCategoryKey(transactionParam)
      ? transactionParam
      : defaultTradeHistoryFilters.transaction,
  };
}

function HistoryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-white px-4 py-4'>
      <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>{label}</p>
      <p className='mt-2 text-[20px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>{value}</p>
    </div>
  );
}

function HistoryCardSkeleton() {
  return (
    <article className='relative overflow-hidden rounded-[14px] border border-[rgba(33,33,33,0.08)] bg-white shadow-[0_8px_22px_rgba(13,10,44,0.06)]'>
      <div className='grid gap-4 px-4 py-4 sm:px-5'>
        <div className='relative flex items-start justify-between gap-3 pr-10 sm:pr-12'>
          <div className='min-w-0 flex-1 space-y-3'>
            <div className='flex flex-wrap gap-2'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-4 w-28' />
            </div>
            <div className='flex flex-wrap gap-2'>
              <Skeleton className='h-6 w-14 rounded-full' />
              <Skeleton className='h-5 w-48 max-w-full' />
            </div>
          </div>
          <Skeleton className='absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full' />
        </div>
        <div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className='h-16 rounded-[10px]' />
          ))}
        </div>
      </div>
    </article>
  );
}

function TradeHistoryCard({
  expanded,
  item,
  onToggle,
}: {
  expanded: boolean;
  item: TradeHistoryRecord;
  onToggle: () => void;
}) {
  const toneClasses = getToneClasses(item.tone);

  return (
    <article
      aria-expanded={expanded}
      className='relative cursor-pointer overflow-hidden rounded-[14px] border border-[rgba(33,33,33,0.08)] bg-white shadow-[0_8px_22px_rgba(13,10,44,0.06)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(111,91,59,0.32)]'
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
      <div className={cn('absolute inset-y-0 left-0 w-1.5', toneClasses.accent)} />
      <div className='space-y-4 px-4 py-4 sm:px-5'>
        <div className='relative flex flex-col gap-4 pr-10 sm:pr-12 lg:flex-row lg:items-start lg:justify-between'>
          <div className='min-w-0 flex-1'>
            <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-ink-soft)]'>
              <span>約定日 {formatShortDate(item.contractDate)}</span>
              <span>受渡日 {formatShortDate(item.settlementDate)}</span>
            </div>
            <div className='mt-3 flex min-w-0 items-start gap-2'>
              <span className={cn('inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.06em]', toneClasses.badge)}>
                {item.transactionLabel}
              </span>
              <h2 className='min-w-0 text-[16px] font-bold leading-[1.45] tracking-[0.03em] text-[var(--ichiyoshi-navy)] sm:text-[17px]'>
                {item.securityName}
              </h2>
            </div>
          </div>

          <div className='text-left lg:text-right'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>受渡金額</p>
            <p className={cn('mt-1 text-[20px] font-bold tracking-[0.03em]', toneClasses.value)}>{formatCurrency(item.settlementAmount)}</p>
          </div>
          <span className='pointer-events-none absolute right-0 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] text-[var(--ichiyoshi-navy)]'>
            <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
          </span>
        </div>

        {expanded ? (
          <div className='grid gap-2 border-t border-[rgba(5,32,49,0.06)] pt-3 sm:grid-cols-2 xl:grid-cols-4'>
            <HistoryMetric label='単価' value={item.unitPriceLabel} />
            <HistoryMetric label='預り区分' value={item.accountLabel} />
            <HistoryMetric label='数量' value={item.quantityLabel} />
            <HistoryMetric label='手数料（税込）' value={item.feeLabel} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function TradeHistoryScreen({
  onBackToTop,
  onOpenApplications,
  onOpenCustomerInfo,
  onOpenPortfolioAssets,
  onLogout,
}: TradeHistoryScreenProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notesOpen, setNotesOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<TradeHistoryFilters>(getInitialFilters(searchParams));
  const [savedPresets, setSavedPresets] = useState<TradeHistoryFilterPreset[]>([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState('');

  const periodParam = searchParams.get('period');
  const period = isHistoryPeriodKey(periodParam) ? periodParam : defaultPeriod;
  const filters = getInitialFilters(searchParams);
  const requestedPage = Number(searchParams.get('page') ?? '1');

  const filteredTransactions = useMemo(() => {
    const periodMonths = historyPeriods.find((item) => item.key === period)?.months ?? 3;
    const thresholdDate = new Date(referenceDate);
    thresholdDate.setMonth(referenceDate.getMonth() - periodMonths);

    return tradeHistoryRecords
      .filter((item) => new Date(`${item.contractDate}T00:00:00`) >= thresholdDate)
      .filter((item) => (filters.product === 'allExceptMrf' ? true : item.product === filters.product))
      .filter((item) => (filters.transaction === 'all' ? true : item.transaction === filters.transaction))
      .filter((item) => (filters.account === 'all' ? true : item.account === filters.account))
      .sort((left, right) => (left.contractDate < right.contractDate ? 1 : -1));
  }, [filters.account, filters.product, filters.transaction, period]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), totalPages) : 1;
  const visibleTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const isTransactionsLoading = useSimulatedLoading(
    `${period}-${filters.product}-${filters.transaction}-${filters.account}-${currentPage}`,
  );

  const totalSettlementAmount = useMemo(
    () => filteredTransactions.reduce((sum, item) => sum + item.settlementAmount, 0),
    [filteredTransactions],
  );

  const productLabel = tradeHistoryProductOptions.find((option) => option.key === filters.product)?.label ?? 'すべて（MRF除く）';
  const transactionLabel = transactionCategoryOptions.find((option) => option.key === filters.transaction)?.label ?? 'すべて';
  const accountLabel = tradeHistoryAccountOptions.find((option) => option.key === filters.account)?.label ?? 'すべて';
  const periodLabel = historyPeriods.find((item) => item.key === period)?.label ?? '3ヶ月';

  useEffect(() => {
    setExpandedIds({});
  }, [currentPage, filters.account, filters.product, filters.transaction, period]);

  useEffect(() => {
    void apiClient.tradeHistory
      .listFilterPresets()
      .then((presets) => setSavedPresets(presets))
      .catch(() => setSavedPresets([]));
    void apiClient.tradeHistory
      .getLastUpdatedAt()
      .then((value) => setLastUpdatedAt(new Date(value).toLocaleString('ja-JP')))
      .catch(() => setLastUpdatedAt(''));
  }, []);

  useEffect(() => {
    if (requestedPage === currentPage) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(currentPage));
    setSearchParams(nextParams, { replace: true });
  }, [currentPage, requestedPage, searchParams, setSearchParams]);

  const quickAccessItems = createQuickAccessItems({
    activeKey: 'tradeHistory',
    handlers: {
      applications: onOpenApplications,
      customerInfo: onOpenCustomerInfo,
      portfolioAssets: () => onOpenPortfolioAssets(),
    },
  });

  const activeFilterChips = [
    filters.product !== 'allExceptMrf' ? `商品区分: ${productLabel}` : null,
    filters.transaction !== 'all' ? `取引区分: ${transactionLabel}` : null,
    filters.account !== 'all' ? `預り区分: ${accountLabel}` : null,
  ].filter(Boolean) as string[];

  const handleSetPeriod = (nextPeriod: HistoryPeriodKey) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('period', nextPeriod);
    nextParams.set('page', '1');
    setSearchParams(nextParams, { replace: true });
  };

  const handleOpenSearchModal = () => {
    setDraftFilters(filters);
    setSearchModalOpen(true);
  };

  const handleApplySearch = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', '1');
    nextParams.set('product', draftFilters.product);
    nextParams.set('transaction', draftFilters.transaction);
    nextParams.set('account', draftFilters.account);
    setSearchParams(nextParams, { replace: true });
    setSearchModalOpen(false);
  };

  const handleSaveCurrentPreset = async () => {
    const presetLabel = `${periodLabel} / ${productLabel}`;
    const saved = await apiClient.tradeHistory.saveFilterPreset({
      account: filters.account,
      label: presetLabel,
      period,
      product: filters.product,
      transaction: filters.transaction,
    });
    setSavedPresets((current) => [saved, ...current.filter((item) => item.id !== saved.id)].slice(0, 6));
    await trackAuditEvent({
      actorType: 'authenticated_user',
      eventType: 'trade_history_filter_preset_saved',
      maskedPayload: {
        account: saved.account,
        period: saved.period,
        product: saved.product,
        transaction: saved.transaction,
      },
      screen: 'tradeHistory',
    });
  };

  const handleApplyPreset = (preset: TradeHistoryFilterPreset) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', '1');
    nextParams.set('period', preset.period);
    nextParams.set('product', preset.product);
    nextParams.set('transaction', preset.transaction);
    nextParams.set('account', preset.account);
    setSearchParams(nextParams, { replace: true });
  };

  const handlePageChange = (nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(nextPage));
    setSearchParams(nextParams, { replace: true });
  };

  const handleToggleCard = (id: string) => {
    setExpandedIds((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

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
                  badge='資産状況 / 取引履歴'
                  description='約定、利金・分配金、入出金をまとめて確認できます。詳細検索から必要な履歴だけに絞り込めます。'
                  icon={<History className='h-5 w-5' />}
                  pretitle='TOP / 取引履歴'
                  title='取引履歴'
                />
              </ServiceScreenHeader>

              <QuickAccessBar actions={quickAccessItems} containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <div className='px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8'>
                <div className='grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
                  <div className='space-y-4'>
                    <ContentCard className='space-y-4'>
                      <button
                        type='button'
                        onClick={() => setNotesOpen((current) => !current)}
                        className='flex w-full items-start gap-3 text-left'
                      >
                        <span className='mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-gold-soft)]'>
                          <Info className='h-4 w-4' />
                        </span>
                        <div className='flex-1'>
                          <p className='text-[16px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>表示内容に関する注意事項</p>
                          <p className='mt-1 text-[14px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>
                            過去 36 ヶ月と当月前営業日までの取引を表示します。
                          </p>
                        </div>
                        <span className='flex h-8 w-8 items-center justify-center text-[var(--ichiyoshi-navy)]'>
                          <ChevronDown className={cn('h-4 w-4 transition-transform', notesOpen && 'rotate-180')} />
                        </span>
                      </button>

                      {notesOpen ? (
                        <div className='rounded-[12px] bg-[rgba(5,32,49,0.03)] px-4 py-4 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
                          ・過去36ヶ月と当月の前営業日までのお取引の情報を表示します。
                        </div>
                      ) : null}
                    </ContentCard>

                    <ContentCard className='space-y-5'>
                      <div className='flex flex-wrap items-start justify-between gap-4'>
                        <div>
                          <SectionLabel>絞り込み</SectionLabel>
                          <p className='mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
                            期間をすぐ切り替えられます。より細かく条件を指定したい場合は詳細検索を使います。
                          </p>
                        </div>
                        <div className='grid w-full gap-2 sm:w-auto sm:grid-cols-2'>
                          <Button
                            type='button'
                            variant='outline'
                            onClick={handleOpenSearchModal}
                            className='h-12 rounded-[12px] border-[rgba(33,33,33,0.08)] bg-white px-5 text-[15px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-gold-soft)] shadow-[0_10px_26px_rgba(13,10,44,0.08)] hover:bg-[rgba(111,91,59,0.04)]'
                          >
                            <Search className='h-4 w-4' />
                            詳細検索
                          </Button>
                          <Button
                            type='button'
                            variant='outline'
                            onClick={() => {
                              void handleSaveCurrentPreset();
                            }}
                            className='h-12 rounded-[12px] border-[rgba(33,33,33,0.08)] bg-white px-5 text-[15px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)] shadow-[0_10px_26px_rgba(13,10,44,0.08)] hover:bg-[rgba(5,32,49,0.04)]'
                          >
                            条件を保存
                          </Button>
                        </div>
                      </div>

                      <div className='grid gap-2 sm:grid-cols-4'>
                        {historyPeriods.map((item) => (
                          <button
                            key={item.key}
                            type='button'
                            onClick={() => handleSetPeriod(item.key)}
                            className={cn(
                              'flex h-12 items-center justify-center rounded-[12px] border px-4 text-[15px] font-bold tracking-[0.04em] transition-all',
                              period === item.key
                                ? 'border-[rgba(111,91,59,0.18)] bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] text-white shadow-[0_16px_36px_rgba(111,91,59,0.2)]'
                                : 'border-[rgba(33,33,33,0.08)] bg-white text-[var(--ichiyoshi-navy)] hover:bg-[rgba(111,91,59,0.04)]',
                            )}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>

                      {activeFilterChips.length > 0 ? (
                        <div className='flex flex-wrap gap-2 border-t border-[rgba(5,32,49,0.06)] pt-4'>
                          {activeFilterChips.map((chip) => (
                            <span
                              key={chip}
                              className='inline-flex items-center rounded-full border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-3 py-1.5 text-[12px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {savedPresets.length > 0 ? (
                        <div className='space-y-2 border-t border-[rgba(5,32,49,0.06)] pt-4'>
                          <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>
                            保存した条件
                          </p>
                          <div className='flex flex-wrap gap-2'>
                            {savedPresets.map((preset) => (
                              <button
                                key={preset.id}
                                type='button'
                                onClick={() => handleApplyPreset(preset)}
                                className='rounded-full border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-3 py-1.5 text-[12px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)] transition-colors hover:bg-white'
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </ContentCard>

                    <ContentCard aria-busy={isTransactionsLoading} className='space-y-5'>
                      <div className='flex flex-wrap items-start justify-between gap-4'>
                        <div>
                          <SectionLabel>取引一覧</SectionLabel>
                          <p className='mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
                            各履歴カードを押すと、単価、預り区分、数量、手数料まで確認できます。
                          </p>
                        </div>
                        {!isTransactionsLoading ? (
                          <span className='inline-flex shrink-0 self-start items-center justify-center rounded-full bg-[rgba(162,133,86,0.12)] px-3 py-1 text-[12px] font-semibold leading-none tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)] whitespace-nowrap'>
                            {filteredTransactions.length} 件
                          </span>
                        ) : null}
                      </div>

                      <div className='space-y-3'>
                        {isTransactionsLoading ? (
                          Array.from({ length: 3 }).map((_, index) => <HistoryCardSkeleton key={index} />)
                        ) : visibleTransactions.length > 0 ? (
                          visibleTransactions.map((item) => (
                            <TradeHistoryCard
                              key={item.id}
                              expanded={!!expandedIds[item.id]}
                              item={item}
                              onToggle={() => handleToggleCard(item.id)}
                            />
                          ))
                        ) : (
                          <div className='rounded-[14px] border border-dashed border-[rgba(5,32,49,0.14)] bg-white/88 px-5 py-10 text-center'>
                            <p className='text-[18px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>条件に合う取引履歴はありません</p>
                            <p className='mt-3 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
                              期間や詳細検索の条件を広げて再度お試しください。
                            </p>
                          </div>
                        )}
                      </div>
                    </ContentCard>

                    <ContentCard className='space-y-4'>
                      <div className='flex items-center justify-between gap-3'>
                        <p className='text-[12px] font-semibold tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)]'>ページ</p>
                        <p className='text-[13px] text-[var(--ichiyoshi-ink-soft)]'>
                          {currentPage} / {totalPages}
                        </p>
                      </div>
                      <div className='grid grid-cols-[48px_repeat(5,minmax(0,1fr))_48px] gap-2'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                          disabled={currentPage === 1}
                          className='h-12 rounded-[10px] border-[rgba(33,33,33,0.08)] bg-white text-[var(--ichiyoshi-gold-soft)] disabled:bg-white/70'
                        >
                          <ChevronLeft className='h-4 w-4' />
                        </Button>
                        {Array.from({ length: 5 }).map((_, index) => {
                          const pageNumber = index + 1;
                          const disabled = pageNumber > totalPages;

                          return (
                            <Button
                              key={pageNumber}
                              type='button'
                              variant='outline'
                              onClick={() => handlePageChange(pageNumber)}
                              disabled={disabled}
                              className={cn(
                                'h-12 rounded-[10px] border-[rgba(33,33,33,0.08)] text-[15px] font-bold shadow-[0_6px_18px_rgba(13,10,44,0.06)]',
                                currentPage === pageNumber
                                  ? 'bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] text-white hover:opacity-95'
                                  : 'bg-white text-[var(--ichiyoshi-gold-soft)] hover:bg-[rgba(111,91,59,0.04)]',
                                disabled && 'pointer-events-none opacity-40',
                              )}
                            >
                              {pageNumber}
                            </Button>
                          );
                        })}
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className='h-12 rounded-[10px] border-[rgba(33,33,33,0.08)] bg-white text-[var(--ichiyoshi-gold-soft)] disabled:bg-white/70'
                        >
                          <ChevronRight className='h-4 w-4' />
                        </Button>
                      </div>
                    </ContentCard>

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
                    <div className='xl:sticky xl:top-6 xl:space-y-4'>
                      <ContentCard className='space-y-4'>
                        <div className='flex items-center gap-3'>
                          <span className='flex h-11 w-11 items-center justify-center rounded-[12px] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-gold-soft)]'>
                            <Clock3 className='h-5 w-5' />
                          </span>
                          <div>
                            <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>
                              表示中の条件
                            </p>
                            <h2 className='mt-1 text-[20px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>検索サマリー</h2>
                          </div>
                        </div>

                        <div className='grid gap-3'>
                          <HistoryMetric label='取引期間' value={periodLabel} />
                          <HistoryMetric label='商品区分' value={productLabel} />
                          <HistoryMetric label='取引区分' value={transactionLabel} />
                          <HistoryMetric label='預り区分' value={accountLabel} />
                        </div>
                      </ContentCard>

                      <ContentCard aria-busy={isTransactionsLoading} className='space-y-4'>
                        <div>
                          <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>
                            検索結果
                          </p>
                          <h2 className='mt-2 text-[20px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>表示件数と受渡金額</h2>
                        </div>

                        {isTransactionsLoading ? (
                          <div className='grid gap-3'>
                            <Skeleton className='h-24 rounded-[12px]' />
                            <Skeleton className='h-24 rounded-[12px]' />
                          </div>
                        ) : (
                          <div className='grid gap-3'>
                            <HistoryMetric label='表示件数' value={`${filteredTransactions.length}件`} />
                            <HistoryMetric label='受渡金額合計' value={formatCurrency(totalSettlementAmount)} />
                          </div>
                        )}
                      </ContentCard>

                      <ImportantInfoPanel
                        notes={[
                          '詳細検索では、商品区分・取引区分・預り区分をまとめて指定できます。',
                          'カードを押すと、単価や手数料までその場で確認できます。',
                          '一覧の内容は前営業日までのデータを基準に表示しています。',
                        ]}
                        referenceDate='前営業日基準'
                        reflectionTiming='当日夜間バッチ反映'
                        title='表示内容に関する重要事項'
                        updatedAt={lastUpdatedAt || undefined}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <BrandFooter containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <AppNavigationMenu
                activeScreen='tradeHistory'
                onClose={() => setMenuOpen(false)}
                onLogout={onLogout}
                onOpenApplications={onOpenApplications}
                onOpenCustomerInfo={onOpenCustomerInfo}
                onOpenPortfolioAssets={() => onOpenPortfolioAssets()}
                onOpenTop={onBackToTop}
                open={menuOpen}
              />

              <TradeHistorySearchModal
                filters={draftFilters}
                onChangeAccount={(value) => setDraftFilters((current) => ({ ...current, account: value }))}
                onChangeProduct={(value) => setDraftFilters((current) => ({ ...current, product: value }))}
                onChangeTransaction={(value) => setDraftFilters((current) => ({ ...current, transaction: value }))}
                onClose={() => setSearchModalOpen(false)}
                onSearch={handleApplySearch}
                open={searchModalOpen}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
