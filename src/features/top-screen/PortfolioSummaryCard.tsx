import { ChevronRight } from 'lucide-react';
import { Cell, Pie, PieChart } from 'recharts';

import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentCard, SectionLabel } from '@/features/initial-setup/components';
import type { AssetTabKey } from '@/features/portfolio-assets/model';
import {
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
  portfolioChartConfig,
  portfolioChartData,
  topNotes,
  totalAssets,
  totalPnl,
  type PortfolioChartDatum,
} from '@/features/top-screen/model';
import { cn } from '@/lib/utils';

type PortfolioSummaryCardProps = {
  isLoading: boolean;
  onOpenPortfolioAssets: (tab?: AssetTabKey) => void;
};

export default function PortfolioSummaryCard({ isLoading, onOpenPortfolioAssets }: PortfolioSummaryCardProps) {
  return (
    <ContentCard aria-busy={isLoading} className='space-y-6' data-node-id='32374:139377'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <SectionLabel>預り資産サマリー</SectionLabel>
          <p className='mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
            保有資産の全体像と商品分類別の内訳を、1つのカードの中で続けて確認できます。
          </p>
        </div>
        {isLoading ? (
          <Skeleton className='h-8 w-28 shrink-0 rounded-full' />
        ) : (
          <span className='inline-flex shrink-0 self-start items-center justify-center rounded-full bg-[rgba(162,133,86,0.12)] px-3 py-1 text-[12px] font-semibold leading-none tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)] whitespace-nowrap'>
            2025/01/01 基準
          </span>
        )}
      </div>

      <div className='w-full'>
        <div className='rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(239,243,245,0.94))] p-5 shadow-[0_18px_44px_rgba(5,32,49,0.06)] sm:p-6'>
          {isLoading ? (
            <div className='grid items-start gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(340px,0.88fr)]'>
              <div className='space-y-5'>
                <div className='relative mx-auto aspect-square w-full max-w-[24rem]'>
                  <Skeleton className='absolute inset-0 rounded-full bg-[rgba(5,32,49,0.08)]' />
                  <div className='absolute inset-[22%] rounded-full bg-[rgba(255,255,255,0.96)]' />
                  <div className='absolute inset-0 flex items-center justify-center px-[18%]'>
                    <div className='w-full max-w-[11rem] space-y-2 text-center'>
                      <Skeleton className='mx-auto h-3 w-24' />
                      <Skeleton className='mx-auto h-8 w-36' />
                      <Skeleton className='mx-auto h-3 w-10' />
                      <Skeleton className='mx-auto mt-3 h-px w-14' />
                      <Skeleton className='mx-auto h-3 w-20' />
                      <Skeleton className='mx-auto h-6 w-28' />
                    </div>
                  </div>
                </div>

                <div className='grid gap-2 border-t border-[rgba(5,32,49,0.08)] pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2'>
                  {Array.from({ length: portfolioChartData.length }).map((_, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between gap-3 rounded-[10px] border border-[rgba(5,32,49,0.06)] bg-white/78 px-3 py-2.5'
                    >
                      <div className='flex min-w-0 items-center gap-2.5'>
                        <Skeleton className='h-2.5 w-2.5 shrink-0 rounded-full' />
                        <Skeleton className='h-4 w-20' />
                      </div>
                      <Skeleton className='h-4 w-10 shrink-0' />
                    </div>
                  ))}
                </div>
              </div>

              <div className='space-y-4 rounded-[12px] border border-[rgba(5,32,49,0.06)] bg-white/82 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-5'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-4 w-44' />
                </div>
                <div className='space-y-3'>
                  {Array.from({ length: portfolioChartData.length }).map((_, index) => (
                    <div
                      key={index}
                      className='grid gap-3 rounded-[12px] border border-[rgba(5,32,49,0.06)] bg-[rgba(255,255,255,0.88)] px-4 py-4 shadow-[0_10px_24px_rgba(5,32,49,0.05)] sm:grid-cols-[minmax(0,1fr)_auto]'
                    >
                      <div className='space-y-2'>
                        <div className='flex items-center gap-3'>
                          <Skeleton className='h-2.5 w-2.5 rounded-full' />
                          <Skeleton className='h-5 w-24' />
                        </div>
                        <Skeleton className='h-4 w-16' />
                      </div>
                      <div className='space-y-2 sm:text-right'>
                        <Skeleton className='h-5 w-28 sm:ml-auto' />
                        <Skeleton className='h-4 w-20 sm:ml-auto' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className='grid items-start gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(340px,0.88fr)]'>
              <div className='space-y-5'>
                <div className='relative mx-auto aspect-square w-full max-w-[24rem]'>
                  <ChartContainer className='h-full w-full' config={portfolioChartConfig}>
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={({ active, payload }) => {
                          const item = payload?.[0]?.payload as PortfolioChartDatum | undefined;

                          if (!active || !item) {
                            return null;
                          }

                          return (
                            <div className='grid min-w-[11rem] gap-1 rounded-lg border border-[rgba(5,32,49,0.08)] bg-white/96 p-3 text-xs shadow-md'>
                              <p className='font-semibold text-[var(--ichiyoshi-navy)]'>{item.label}</p>
                              <p className='text-[var(--ichiyoshi-ink-soft)]'>{formatCurrency(item.value)}</p>
                              <p
                                className={cn(
                                  'font-semibold',
                                  item.pnl > 0 ? 'text-[#507ae7]' : item.pnl < 0 ? 'text-[#b61704]' : 'text-[var(--ichiyoshi-ink-soft)]',
                                )}
                              >
                                {item.pnl === 0 ? '0円' : formatSignedCurrency(item.pnl)}
                              </p>
                              <p className='text-[var(--ichiyoshi-muted)]'>構成比 {formatPercent(item.sharePercent)}</p>
                            </div>
                          );
                        }}
                      />
                      <Pie
                        data={portfolioChartData}
                        dataKey='chartValue'
                        innerRadius='64%'
                        outerRadius='86%'
                        paddingAngle={3}
                        stroke='rgba(247,243,235,0.96)'
                        strokeWidth={4}
                      >
                        {portfolioChartData.map((item) => (
                          <Cell key={item.key} fill={item.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>

                  <div className='pointer-events-none absolute inset-0 flex items-center justify-center px-[16%] text-center'>
                    <div className='mx-auto flex w-full max-w-[14rem] flex-col items-center justify-center rounded-full px-3 py-2'>
                      <p className='text-[11px] font-semibold tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)]'>預り資産合計</p>
                      <p className='mt-1 max-w-full text-[clamp(1.125rem,2.2vw,1.5rem)] font-bold leading-[1.05] tracking-[0.01em] text-[var(--ichiyoshi-navy)] tabular-nums'>
                        {new Intl.NumberFormat('ja-JP').format(totalAssets)}
                      </p>
                      <p className='mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ichiyoshi-ink-soft)]'>円</p>
                      <div className='mt-3 h-px w-16 bg-[rgba(5,32,49,0.08)]' />
                      <p className='mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ichiyoshi-ink-soft)]'>評価損益</p>
                      <p className='mt-1 max-w-full text-[clamp(1rem,1.95vw,1.25rem)] font-bold leading-[1.08] tracking-[0.01em] text-[#507ae7] tabular-nums'>
                        +{new Intl.NumberFormat('ja-JP').format(totalPnl)}
                      </p>
                      <p className='mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ichiyoshi-ink-soft)]'>円</p>
                    </div>
                  </div>
                </div>

                <div className='grid gap-2 border-t border-[rgba(5,32,49,0.08)] pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2'>
                  {portfolioChartData.map((item) => (
                    <div
                      key={item.key}
                      className='flex items-center justify-between gap-3 rounded-[10px] border border-[rgba(5,32,49,0.06)] bg-white/78 px-3 py-2.5'
                    >
                      <div className='flex min-w-0 items-center gap-2.5'>
                        <span className='h-2.5 w-2.5 shrink-0 rounded-full' style={{ backgroundColor: item.color }} />
                        <span className='truncate text-[13px] font-semibold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>
                          {item.label}
                        </span>
                      </div>
                      <span className='shrink-0 text-[12px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-ink-soft)]'>
                        {formatPercent(item.sharePercent)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className='mt-6 rounded-[12px] border border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.035)] px-4 py-4 sm:px-5'>
                  <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                    <div>
                      <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>表示上のご案内</p>
                    </div>
                  </div>

                  <div className='mt-4 grid gap-2'>
                    {topNotes.map((note) => (
                      <div
                        key={note}
                        className='flex items-start gap-3 rounded-[10px] border border-[rgba(5,32,49,0.05)] bg-white/75 px-3 py-3 text-[13px] leading-6 text-[var(--ichiyoshi-ink-soft)]'
                      >
                        <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ichiyoshi-gold-soft)]' />
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className='space-y-4 rounded-[12px] border border-[rgba(5,32,49,0.06)] bg-white/82 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-5'>
                <div>
                  <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>商品分類別内訳</p>
                  <p className='mt-2 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
                    気になる商品分類を選ぶと、そのまま預り資産画面の該当一覧へ移動できます。
                  </p>
                </div>

                <div className='space-y-3'>
                  {portfolioChartData.map((item) => (
                    <button
                      key={item.label}
                      type='button'
                      onClick={() => onOpenPortfolioAssets(item.key)}
                      className='grid w-full gap-3 rounded-[12px] border border-[rgba(5,32,49,0.06)] bg-[rgba(255,255,255,0.9)] px-4 py-4 text-left shadow-[0_10px_24px_rgba(5,32,49,0.05)] transition-transform duration-200 hover:-translate-y-0.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center'
                    >
                      <div className='space-y-2'>
                        <div className='flex min-w-0 items-center gap-3'>
                          <span className='h-2.5 w-2.5 shrink-0 rounded-full' style={{ backgroundColor: item.color }} />
                          <span className='truncate text-[15px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                            {item.label}
                          </span>
                        </div>
                        <div className='flex flex-wrap items-center gap-2 text-[12px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-ink-soft)]'>
                          <span>構成比 {formatPercent(item.sharePercent)}</span>
                          <span className='h-1 w-1 rounded-full bg-[rgba(5,32,49,0.18)]' />
                          <span>{item.value > 0 ? formatCurrency(item.value) : '--'}</span>
                        </div>
                      </div>

                      <div className='flex items-center justify-between gap-4 sm:flex-col sm:items-end'>
                        <span
                          className={cn(
                            'text-[16px] font-bold tracking-[0.03em]',
                            item.pnl > 0 ? 'text-[#507ae7]' : item.pnl < 0 ? 'text-[#b61704]' : 'text-[var(--ichiyoshi-ink-soft)]',
                          )}
                        >
                          {item.pnl === 0 ? '0円' : formatSignedCurrency(item.pnl)}
                        </span>
                        <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(5,32,49,0.05)] text-[var(--ichiyoshi-navy)]'>
                          <ChevronRight className='h-4 w-4' />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ContentCard>
  );
}
