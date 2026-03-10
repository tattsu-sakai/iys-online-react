import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronRight,
  ExternalLink,
  FileBarChart2,
  FileText,
  History,
  Landmark,
  LogOut,
  Mail,
  ShieldCheck,
  X,
} from 'lucide-react';

import { pushRecentMenu, listRecentMenus, type NavigationScreen } from '@/features/navigation/recent-menu';
import { trackAuditEvent } from '@/features/security/audit';
import { cn } from '@/lib/utils';

type MenuItem = {
  description?: string;
  external?: boolean;
  key?: NavigationScreen;
  label: string;
  onSelect?: () => void;
};

type MenuSection = {
  icon: typeof Landmark;
  items: MenuItem[];
  label: string;
};

type AppNavigationMenuProps = {
  activeScreen: NavigationScreen;
  customerName?: string;
  onClose: () => void;
  onLogout?: () => void;
  onOpenApplications?: () => void;
  onOpenCustomerInfo?: () => void;
  onOpenPortfolioAssets?: () => void;
  onOpenTradeHistory?: () => void;
  onOpenTop?: () => void;
  open: boolean;
};

const menuSections: MenuSection[] = [
  {
    icon: Landmark,
    label: 'TOP',
    items: [{ key: 'top', label: 'TOPページ' }],
  },
  {
    icon: History,
    label: '資産状況 / 取引履歴',
    items: [
      { key: 'portfolioAssets', label: '預り資産', description: '保有明細とサマリーを確認' },
      { key: 'tradeHistory', label: '取引履歴', description: '約定、利金・入出金を確認' },
      { label: '譲渡益税履歴' },
      { label: '配当等の履歴' },
      { label: 'トータルリターン' },
      { external: true, label: '各種報告書照会' },
    ],
  },
  {
    icon: FileText,
    label: '各種お手続き',
    items: [
      { key: 'customerInfo', label: 'お届出事項変更・追加申請', description: '住所や口座情報の変更' },
      { key: 'applications', label: '各種申込み', description: 'オンライン申込み一覧へ移動' },
      { label: '提出書類に関する確認' },
    ],
  },
  {
    icon: FileBarChart2,
    label: '商品情報',
    items: [{ label: '投信基準価格一覧' }, { label: 'ファンドラップ' }, { external: true, label: '銘柄・投資関連レポート' }],
  },
  {
    icon: Mail,
    label: 'アカウント情報変更',
    items: [{ label: 'メールアドレス登録・変更' }, { label: 'パスワード変更' }],
  },
];

export default function AppNavigationMenu({
  activeScreen,
  customerName = 'サンプル太郎 様',
  onClose,
  onLogout,
  onOpenApplications,
  onOpenCustomerInfo,
  onOpenPortfolioAssets,
  onOpenTradeHistory,
  onOpenTop,
  open,
}: AppNavigationMenuProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const handlerMap: Partial<Record<NavigationScreen, () => void>> = {
    applications: onOpenApplications,
    customerInfo: onOpenCustomerInfo,
    portfolioAssets: onOpenPortfolioAssets,
    tradeHistory: onOpenTradeHistory,
    top: onOpenTop,
  };

  const renderedSections = menuSections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      onSelect: item.key ? handlerMap[item.key] : item.onSelect,
    })),
  }));
  const recentItems = listRecentMenus()
    .map((screenKey) => {
      const labelByKey: Record<NavigationScreen, string> = {
        applications: '各種申込み',
        customerInfo: 'お届出事項変更・追加申請',
        portfolioAssets: '預り資産',
        top: 'TOPページ',
        tradeHistory: '取引履歴',
      };
      return {
        key: screenKey,
        label: labelByKey[screenKey],
        onSelect: handlerMap[screenKey],
      };
    })
    .filter((item) => !!item.onSelect && item.key !== activeScreen);

  return createPortal(
    <div className='fixed inset-0 z-[120]'>
      <button
        type='button'
        aria-label='ナビゲーションメニューを閉じる'
        className='absolute inset-0 bg-[rgba(10,16,22,0.46)] backdrop-blur-[3px]'
        onClick={onClose}
      />

      <div className='absolute inset-0 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4'>
        <div className='mx-auto flex w-full max-w-[1180px] justify-end'>
          <div className='w-full max-w-[25rem] animate-in slide-in-from-right-3 fade-in-0 duration-200'>
            <div className='mb-3 rounded-[16px] border border-white/12 bg-[rgba(19,27,35,0.78)] px-4 py-3 text-white shadow-[0_18px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='text-[11px] font-semibold tracking-[0.12em] text-white/68'>ご利用メニュー</p>
                  <p className='mt-1 text-[16px] font-semibold tracking-[0.04em] text-white'>{customerName}</p>
                </div>
                <span className='inline-flex items-center rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-white/82'>
                  サンプルオンライン
                </span>
              </div>
            </div>

            <section
              role='dialog'
              aria-modal='true'
              aria-labelledby={titleId}
              className='overflow-hidden rounded-[18px] border border-[rgba(5,32,49,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,248,0.96))] shadow-[0_28px_70px_rgba(5,32,49,0.22)]'
            >
              <div className='flex items-start justify-between gap-4 border-b border-[rgba(5,32,49,0.08)] px-5 pb-4 pt-5'>
                <div>
                  <p className='text-[11px] font-semibold tracking-[0.12em] text-[var(--ichiyoshi-gold-soft)]'>メニュー</p>
                  <h2 id={titleId} className='mt-2 text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                    ナビゲーション
                  </h2>
                  <p className='mt-2 text-[13px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>
                    行きたい画面を選んでください。押せない項目は現在準備中です。
                  </p>
                </div>
                <button
                  ref={closeButtonRef}
                  type='button'
                  aria-label='ナビゲーションメニューを閉じる'
                  onClick={onClose}
                  className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(5,32,49,0.08)] bg-white text-[var(--ichiyoshi-navy)] shadow-[0_10px_24px_rgba(5,32,49,0.08)] transition-colors hover:bg-[rgba(5,32,49,0.04)]'
                >
                  <X className='h-4 w-4' />
                </button>
              </div>

              <div className='max-h-[min(78vh,44rem)] overflow-y-auto px-4 pb-4 pt-4 sm:px-5'>
                <div className='space-y-5'>
                  {recentItems.length > 0 ? (
                    <section className='space-y-3'>
                      <div className='flex items-center gap-2 px-1'>
                        <span className='flex h-8 w-8 items-center justify-center rounded-[10px] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-gold-soft)]'>
                          <History className='h-4 w-4' />
                        </span>
                        <h3 className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>
                          最近使ったメニュー
                        </h3>
                      </div>
                      <div className='space-y-2'>
                        {recentItems.map((item) => (
                          <button
                            key={`recent-${item.key}`}
                            type='button'
                            onClick={() => {
                              item.onSelect?.();
                              void trackAuditEvent({
                                actorType: 'authenticated_user',
                                eventType: 'navigation_selected',
                                screen: item.key,
                                maskedPayload: { source: 'recent-menu' },
                              });
                              onClose();
                            }}
                            className='flex w-full items-center justify-between gap-3 rounded-[14px] border border-[rgba(5,32,49,0.08)] bg-white px-4 py-3 text-left text-[var(--ichiyoshi-navy)] shadow-[0_10px_24px_rgba(5,32,49,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(247,243,235,0.84)]'
                          >
                            <p className='text-[15px] font-semibold tracking-[0.03em]'>{item.label}</p>
                            <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(5,32,49,0.05)] text-[var(--ichiyoshi-navy)]'>
                              <ChevronRight className='h-4 w-4' />
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {renderedSections.map((section) => {
                    const SectionIcon = section.icon;

                    return (
                      <section key={section.label} className='space-y-3'>
                        <div className='flex items-center gap-2 px-1'>
                          <span className='flex h-8 w-8 items-center justify-center rounded-[10px] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-gold-soft)]'>
                            <SectionIcon className='h-4 w-4' />
                          </span>
                          <h3 className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>
                            {section.label}
                          </h3>
                        </div>

                        <div className='space-y-2'>
                          {section.items.map((item) => {
                            const isActive = item.key === activeScreen;
                            const isDisabled = !item.onSelect && !isActive;
                            const Wrapper = isDisabled ? 'div' : 'button';

                            return (
                              <Wrapper
                                key={item.label}
                                {...(isDisabled
                                  ? {}
                                  : {
                                      onClick: () => {
                                        if (isActive) {
                                          onClose();
                                          return;
                                        }

                                        if (item.key) {
                                          pushRecentMenu(item.key);
                                          void trackAuditEvent({
                                            actorType: 'authenticated_user',
                                            eventType: 'navigation_selected',
                                            screen: item.key,
                                            maskedPayload: { source: 'navigation-menu' },
                                          });
                                        }
                                        item.onSelect?.();
                                        onClose();
                                      },
                                      type: 'button',
                                    })}
                                className={cn(
                                  'flex w-full items-center justify-between gap-3 rounded-[14px] border px-4 py-3 text-left transition-all duration-200',
                                  isActive
                                    ? 'border-[rgba(111,91,59,0.18)] bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] text-white shadow-[0_14px_30px_rgba(111,91,59,0.22)]'
                                    : isDisabled
                                      ? 'border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.03)] text-[var(--ichiyoshi-ink-soft)]'
                                      : 'border-[rgba(5,32,49,0.08)] bg-white text-[var(--ichiyoshi-navy)] shadow-[0_10px_24px_rgba(5,32,49,0.06)] hover:-translate-y-0.5 hover:bg-[rgba(247,243,235,0.84)]',
                                )}
                              >
                                <div className='min-w-0'>
                                  <div className='flex flex-wrap items-center gap-2'>
                                    <p className={cn('text-[15px] font-semibold tracking-[0.03em]', isDisabled && 'text-[var(--ichiyoshi-navy)]')}>
                                      {item.label}
                                    </p>
                                    {isActive ? (
                                      <span className='rounded-full border border-white/14 bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-white/82'>
                                        現在地
                                      </span>
                                    ) : null}
                                    {isDisabled ? (
                                      <span className='rounded-full border border-[rgba(5,32,49,0.08)] bg-white/72 px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-[var(--ichiyoshi-muted)]'>
                                        準備中
                                      </span>
                                    ) : null}
                                  </div>
                                  {item.description ? (
                                    <p className={cn('mt-1 text-[12px] leading-5', isActive ? 'text-white/78' : 'text-[var(--ichiyoshi-ink-soft)]')}>
                                      {item.description}
                                    </p>
                                  ) : null}
                                </div>

                                <span
                                  className={cn(
                                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                                    isActive
                                      ? 'bg-white/12 text-white'
                                      : isDisabled
                                        ? 'bg-[rgba(5,32,49,0.05)] text-[var(--ichiyoshi-muted)]'
                                        : 'bg-[rgba(5,32,49,0.05)] text-[var(--ichiyoshi-navy)]',
                                  )}
                                >
                                  {item.external ? <ExternalLink className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
                                </span>
                              </Wrapper>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>

              <div className='border-t border-[rgba(5,32,49,0.08)] bg-[rgba(247,243,235,0.62)] px-4 py-4 sm:px-5'>
                <button
                  type='button'
                  onClick={() => {
                    onLogout?.();
                    onClose();
                  }}
                  className='flex w-full items-center justify-between gap-3 rounded-[14px] border border-[rgba(182,23,4,0.12)] bg-white px-4 py-3 text-left text-[#7c2016] shadow-[0_10px_24px_rgba(5,32,49,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(255,248,247,0.98)]'
                >
                  <div className='flex items-center gap-3'>
                    <span className='flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(182,23,4,0.08)] text-[#b61704]'>
                      <LogOut className='h-4 w-4' />
                    </span>
                    <div>
                      <p className='text-[15px] font-semibold tracking-[0.04em]'>ログアウト</p>
                      <p className='text-[12px] leading-5 text-[#9a4e46]'>安全にセッションを終了してログイン画面へ戻ります。</p>
                    </div>
                  </div>
                  <ChevronRight className='h-4 w-4' />
                </button>

                <div className='mt-3 flex items-start gap-2 rounded-[12px] border border-[rgba(5,32,49,0.06)] bg-white/78 px-3 py-3 text-[12px] leading-5 text-[var(--ichiyoshi-ink-soft)]'>
                  <ShieldCheck className='mt-0.5 h-4 w-4 shrink-0 text-[var(--ichiyoshi-gold-soft)]' />
                  <p>キーボードでは `Esc` でも閉じられます。背景をクリックしてもメニューを閉じられます。</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
