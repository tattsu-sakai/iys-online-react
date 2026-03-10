import { type ComponentType, useState } from 'react';
import { ChevronRight, FileText, History, Landmark, MapPin, Menu, Settings2, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  BrandFooter,
  ContentCard,
  QuickAccessBar,
  SectionLabel,
  ServiceScreenHeader,
  ServiceScreenHeroPanel,
} from '@/features/initial-setup/components';
import AppNavigationMenu from '@/features/navigation/AppNavigationMenu';
import { customerInfoActions } from '@/features/customer-info/model';
import type { AssetTabKey } from '@/features/portfolio-assets/model';
import { cn } from '@/lib/utils';

type CustomerInfoScreenProps = {
  onOpenApplications: () => void;
  onBackToTop: () => void;
  onLogout: () => void;
  onOpenPortfolioAssets: (tab?: AssetTabKey) => void;
  onOpenTradeHistory: () => void;
};

const actionIcons: Record<(typeof customerInfoActions)[number]['key'], ComponentType<{ className?: string }>> = {
  address: MapPin,
  bank: Landmark,
  name: User,
  other: Settings2,
  'specified-account': FileText,
};

const quickActions = [
  { label: '預り資産', icon: Landmark },
  { label: '取引履歴', icon: History },
  { label: 'お客様情報', icon: User },
  { label: '各種申込み', icon: FileText },
] as const;

export default function CustomerInfoScreen({
  onOpenApplications,
  onBackToTop,
  onLogout,
  onOpenPortfolioAssets,
  onOpenTradeHistory,
}: CustomerInfoScreenProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const quickAccessItems = quickActions.map((action) => ({
    ...action,
    active: action.label === 'お客様情報',
    onClick:
      action.label === '預り資産'
        ? () => onOpenPortfolioAssets()
        : action.label === '取引履歴'
          ? onOpenTradeHistory
          : undefined,
  }));
  const enhancedQuickAccessItems = quickAccessItems.map((action) => ({
    ...action,
    onClick:
      action.label === '各種申込み'
        ? onOpenApplications
        : action.label === '預り資産'
          ? () => onOpenPortfolioAssets()
          : action.onClick,
  }));

  return (
    <main className='min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(162,133,86,0.18),transparent_24%),radial-gradient(circle_at_90%_10%,rgba(5,32,49,0.16),transparent_20%),linear-gradient(180deg,#f7f3eb_0%,#eef2f4_34%,#e6ebee_100%)]'>
      <div className='mx-auto flex min-h-screen max-w-[1380px] flex-col'>
        <section className='relative flex flex-1 items-stretch justify-center px-0 py-0 sm:px-4 lg:px-6 xl:px-10'>
          <div className='relative w-full max-w-[1180px]'>
            <div className='pointer-events-none absolute inset-x-10 top-5 h-32 rounded-full bg-[rgba(162,133,86,0.18)] blur-3xl' />

            <div className='relative' data-node-id='34128:69477'>
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
                  badge='お客様情報'
                  description='氏名、住所、振込先、特定口座などの届出事項変更を、この画面からまとめて確認できます。'
                  pretitle='TOP / お届出事項変更・追加申請'
                  title='お届出事項変更・追加申請'
                />
              </ServiceScreenHeader>

              <QuickAccessBar actions={enhancedQuickAccessItems} containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <div className='px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8'>
                <div className='grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
                  <div className='space-y-4'>
                    <ContentCard className='space-y-5'>
                      <div className='flex flex-wrap items-start justify-between gap-4'>
                        <div>
                          <SectionLabel>申請メニュー</SectionLabel>
                          <p className='mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
                            変更したい項目を選んで、必要な申請へ進みます。説明文を添えているので、最初にどれを選ぶべきか判断しやすくしています。
                          </p>
                        </div>
                        <span className='inline-flex shrink-0 self-start items-center justify-center rounded-full bg-[rgba(162,133,86,0.12)] px-3 py-1 text-[12px] font-semibold leading-none tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)] whitespace-nowrap'>
                          申請 5件
                        </span>
                      </div>

                      <div className='grid gap-4 md:grid-cols-2'>
                        {customerInfoActions.map((action, index) => {
                          const Icon = actionIcons[action.key];

                          return (
                            <article
                              key={action.key}
                              className={cn(
                                'flex h-full flex-col rounded-[14px] border border-[rgba(5,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,249,0.94))] p-5 shadow-[0_14px_32px_rgba(5,32,49,0.06)] transition-transform duration-200 hover:-translate-y-0.5',
                                index === customerInfoActions.length - 1 && 'md:col-span-2',
                              )}
                            >
                              <div className='flex items-start justify-between gap-4'>
                                <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-gold-soft)]'>
                                  <Icon className='h-5 w-5' />
                                </span>
                                <span className='inline-flex shrink-0 self-start items-center justify-center rounded-full border border-[rgba(5,32,49,0.08)] bg-white/88 px-3 py-1 text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-[var(--ichiyoshi-ink-soft)] whitespace-nowrap'>
                                  オンライン
                                </span>
                              </div>

                              <h2 className='mt-5 text-[20px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>{action.title}</h2>
                              <p className='mt-3 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>{action.description}</p>

                              <div className='mt-auto flex items-center justify-between pt-5'>
                                <span className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>
                                  申請内容を確認
                                </span>
                                <span className='flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(5,32,49,0.05)] text-[var(--ichiyoshi-navy)]'>
                                  <ChevronRight className='h-4 w-4' />
                                </span>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </ContentCard>

                    <Button
                      type='button'
                      onClick={onBackToTop}
                      className='h-12 w-full rounded-[12px] border border-[rgba(33,33,33,0.08)] bg-white text-[15px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-gold-soft)] shadow-[0_10px_26px_rgba(13,10,44,0.08)] hover:bg-[rgba(111,91,59,0.04)]'
                    >
                      TOPページに戻る
                    </Button>
                  </div>

                  <div className='space-y-4 xl:sticky xl:top-6'>
                    <ContentCard className='space-y-4'>
                      <div>
                        <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>概要</p>
                        <h2 className='mt-2 text-[20px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>変更できる項目</h2>
                      </div>

                      <div className='space-y-3'>
                        {customerInfoActions.map((action, index) => (
                          <div
                            key={action.key}
                            className='flex items-start gap-3 rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-4'
                          >
                            <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-bold text-[var(--ichiyoshi-gold-soft)]'>
                              {index + 1}
                            </span>
                            <div>
                              <p className='text-[15px] font-semibold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>{action.title}</p>
                              <p className='mt-1 text-[13px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>{action.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ContentCard>

                    <ContentCard className='space-y-4'>
                      <div>
                        <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>Guide</p>
                        <h2 className='mt-2 text-[18px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>ご案内</h2>
                      </div>
                      <div className='space-y-3 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
                        <p>各メニューから該当する変更申請へ進みます。</p>
                        <p>PC では一覧性を高め、SP では 1 項目ずつ選びやすい余白に調整しています。</p>
                        <p>TOP へ戻る場合は、下部ボタンまたは右上ボタンを利用できます。</p>
                      </div>
                    </ContentCard>
                  </div>
                </div>
              </div>

              <BrandFooter containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <AppNavigationMenu
                activeScreen='customerInfo'
                onClose={() => setMenuOpen(false)}
                onLogout={onLogout}
                onOpenApplications={onOpenApplications}
                onOpenCustomerInfo={() => setMenuOpen(false)}
                onOpenPortfolioAssets={() => onOpenPortfolioAssets()}
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
