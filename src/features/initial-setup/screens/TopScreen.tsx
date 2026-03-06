import { type ComponentType } from 'react';
import { Bell, ChevronRight, FileText, History, Landmark, LogOut, Menu, User } from 'lucide-react';
import { Cell, Pie, PieChart } from 'recharts';

import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';
import { BrandMark, ContentCard, QuickAccessBar, SectionLabel, companyInfoLines } from '@/features/initial-setup/components';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type TopScreenProps = {
  onLogout: () => void;
  onOpenPortfolioAssets: () => void;
  onStartPersonalAccountOpening: () => void;
  onStartMemberRegistration: () => void;
};

type PortfolioKey = 'dreamCollection' | 'investmentTrust' | 'equity' | 'bond' | 'margin' | 'cash';

type PortfolioItem = {
  key: PortfolioKey;
  label: string;
  pnl: number;
  value: number;
};

type PortfolioChartDatum = PortfolioItem & {
  chartValue: number;
  color: string;
  fill: string;
  sharePercent: number;
};

const portfolioChartConfig = {
  dreamCollection: { label: 'ドリコレ', color: '#a28556' },
  investmentTrust: { label: '投信', color: '#6f5b3b' },
  equity: { label: '株式', color: '#3e6074' },
  bond: { label: '債券', color: '#8096a5' },
  margin: { label: '信用建玉', color: '#c7b89f' },
  cash: { label: 'MRF/現金', color: '#d7e1e6' },
} satisfies ChartConfig;

const portfolioItems: PortfolioItem[] = [
  { key: 'dreamCollection', label: 'ドリコレ', value: 97_118_604, pnl: 12_785_835 },
  { key: 'investmentTrust', label: '投信', value: 10_000_000, pnl: 120_000 },
  { key: 'equity', label: '株式', value: 16_686_654, pnl: 9_352_324 },
  { key: 'bond', label: '債券', value: 9_000_000, pnl: 100_000 },
  { key: 'margin', label: '信用建玉', value: 0, pnl: -100_000 },
  { key: 'cash', label: 'MRF/現金', value: 9_900_000, pnl: 0 },
];

const quickActions: Array<{
  icon: ComponentType<{ className?: string }>;
  label: string;
}> = [
  { label: '預り資産', icon: Landmark },
  { label: '取引履歴', icon: History },
  { label: 'お客様情報', icon: User },
  { label: '各種申込み', icon: FileText },
];

const topNotes = ['保有資産合計は前営業日約定基準で表示されます。', '一部評価できない銘柄は評価額に含まれていません。'];

const accountOpeningHighlights = ['氏名・生年月日・性別の入力', '電話番号とメールアドレス登録', 'パスワード登録'];

const personalAccountOpeningHighlights = [
  '交付書面の電子交付確認',
  '反社会的勢力非該当の同意',
  '重要事項の再説明設定',
  '家族構成とゆうちょ口座登録',
  '最後に確認画面で一括見直し',
];

const currencyFormatter = new Intl.NumberFormat('ja-JP');
const totalAssets = portfolioItems.reduce((sum, item) => sum + item.value, 0);
const totalPnl = portfolioItems.reduce((sum, item) => sum + item.pnl, 0);
const cashItem = portfolioItems.find((item) => item.label === 'MRF/現金') ?? portfolioItems[0];
const largestHolding = portfolioItems.reduce((current, item) => (item.value > current.value ? item : current));
const positiveSegments = portfolioItems.filter((item) => item.pnl > 0).length;
const portfolioChartData: PortfolioChartDatum[] = portfolioItems.map((item) => ({
  ...item,
  chartValue: item.value > 0 ? item.value : totalAssets * 0.006,
  color: portfolioChartConfig[item.key].color ?? '#d7e1e6',
  fill: `var(--color-${item.key})`,
  sharePercent: totalAssets > 0 ? (item.value / totalAssets) * 100 : 0,
}));

function formatCurrency(value: number) {
  return `${currencyFormatter.format(value)}円`;
}

function formatSignedCurrency(value: number) {
  const prefix = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${prefix}${currencyFormatter.format(Math.abs(value))}円`;
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function SummaryStat({
  label,
  tone = 'default',
  value,
  caption,
}: {
  caption: string;
  label: string;
  tone?: 'default' | 'positive';
  value: string;
}) {
  return (
    <div className='flex h-full min-h-[132px] flex-col justify-between rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-4'>
      <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>{label}</p>
      <p
        className={cn(
          'mt-3 break-words text-[24px] font-bold leading-none tracking-[0.04em] text-[var(--ichiyoshi-navy)]',
          tone === 'positive' && 'text-[#507ae7]',
        )}
      >
        {value}
      </p>
      <p className='mt-2 text-[13px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>{caption}</p>
    </div>
  );
}

export default function TopScreen({
  onLogout,
  onOpenPortfolioAssets,
  onStartPersonalAccountOpening,
  onStartMemberRegistration,
}: TopScreenProps) {
  const getQuickActionHandler = (label: string) =>
    label === '預り資産' ? onOpenPortfolioAssets : undefined;
  const quickAccessItems = quickActions.map((action) => ({
    ...action,
    onClick: getQuickActionHandler(action.label),
  }));

  const renderPortfolioSummaryCard = () => (
    <ContentCard className='space-y-6' data-node-id='32374:139377'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <SectionLabel>預り資産サマリー</SectionLabel>
          <p className='mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
            保有資産の全体像を、カテゴリごとの構成比と評価損益で確認できます。
          </p>
        </div>
        <span className='rounded-full bg-[rgba(162,133,86,0.12)] px-3 py-1 text-[12px] font-semibold tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)]'>
          2025/01/01 基準
        </span>
      </div>

      <div className='grid gap-5 xl:grid-cols-[minmax(336px,0.94fr)_minmax(0,1.06fr)] xl:items-start'>
        <div className='space-y-4'>
          <div className='rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(239,243,245,0.94))] p-5 shadow-[0_18px_44px_rgba(5,32,49,0.06)]'>
            <div className='relative mx-auto aspect-square w-full max-w-[34rem]'>
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
                    innerRadius='58%'
                    outerRadius='88%'
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

              <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center'>
                <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>Total Assets</p>
                <p className='mt-2 max-w-[11rem] text-[22px] font-bold leading-[1.08] tracking-[0.01em] text-[var(--ichiyoshi-navy)] sm:max-w-[12rem] sm:text-[26px]'>
                  {currencyFormatter.format(totalAssets)}
                </p>
                <p className='mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ichiyoshi-ink-soft)]'>円</p>
                <p className='mt-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-ink-soft)]'>評価損益</p>
                <p className='mt-1 max-w-[10rem] text-[19px] font-bold leading-[1.1] tracking-[0.01em] text-[#507ae7] sm:max-w-[11rem] sm:text-[22px]'>
                  +{currencyFormatter.format(totalPnl)}
                </p>
                <p className='mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ichiyoshi-ink-soft)]'>円</p>
              </div>
            </div>
          </div>

          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-1'>
            <div className='rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-white/82 px-4 py-4 shadow-[0_14px_32px_rgba(5,32,49,0.05)]'>
              <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>最大構成</p>
              <p className='mt-2 text-[20px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>{largestHolding.label}</p>
              <p className='mt-2 text-[13px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>
                {formatPercent((largestHolding.value / totalAssets) * 100)} / {formatCurrency(largestHolding.value)}
              </p>
            </div>

            <div className='rounded-[12px] border border-[rgba(162,133,86,0.16)] bg-[linear-gradient(180deg,rgba(244,239,230,0.72),rgba(255,255,255,0.92))] px-4 py-4 shadow-[0_14px_32px_rgba(5,32,49,0.05)]'>
              <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>現金ポジション</p>
              <p className='mt-2 text-[20px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                {formatPercent((cashItem.value / totalAssets) * 100)}
              </p>
              <p className='mt-2 text-[13px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>{formatCurrency(cashItem.value)}</p>
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <div className='grid items-stretch gap-3 sm:[grid-template-columns:repeat(auto-fit,minmax(168px,1fr))]'>
            <SummaryStat label='最多保有' value={largestHolding.label} caption={formatCurrency(largestHolding.value)} />
            <SummaryStat label='プラス評価' value={`${positiveSegments}/${portfolioItems.length}`} caption='評価益が出ているカテゴリ' />
            <SummaryStat
              label='現金比率'
              tone='positive'
              value={formatPercent((cashItem.value / totalAssets) * 100)}
              caption={formatCurrency(cashItem.value)}
            />
          </div>
        </div>
      </div>
    </ContentCard>
  );

  const renderApplicationsCard = () => (
    <ContentCard className='space-y-5' data-node-id='32374:74192'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <SectionLabel>オンライン申込み</SectionLabel>
          <p className='mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
            Figma を参照して、個人口座開設と会員登録の導線を整理しています。まずは個人口座開設の STEP1
            を、一画面入力と確認画面の構成で実装しています。
          </p>
        </div>
        <span className='rounded-full bg-[rgba(162,133,86,0.12)] px-3 py-1 text-[12px] font-semibold tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)]'>
          ENTRY FLOW
        </span>
      </div>

      <Tabs defaultValue='account-opening' className='space-y-4'>
        <TabsList className='grid h-auto w-full grid-cols-2 rounded-[12px] bg-[rgba(5,32,49,0.05)] p-1.5'>
          <TabsTrigger
            value='member-registration'
            className='rounded-[10px] px-4 py-3 text-[13px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-ink-soft)] data-[state=active]:bg-white data-[state=active]:text-[var(--ichiyoshi-navy)] data-[state=active]:shadow-[0_12px_24px_rgba(5,32,49,0.08)]'
          >
            会員登録
          </TabsTrigger>
          <TabsTrigger
            value='account-opening'
            className='rounded-[10px] px-4 py-3 text-[13px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-ink-soft)] data-[state=active]:bg-white data-[state=active]:text-[var(--ichiyoshi-navy)] data-[state=active]:shadow-[0_12px_24px_rgba(5,32,49,0.08)]'
          >
            個人口座開設
          </TabsTrigger>
        </TabsList>

        <TabsContent value='member-registration' className='mt-0'>
          <div className='rounded-[14px] border border-[rgba(111,91,59,0.16)] bg-[linear-gradient(145deg,rgba(133,104,63,0.12),rgba(255,255,255,0.94)_42%,rgba(5,32,49,0.04)_100%)] p-5 shadow-[0_20px_48px_rgba(5,32,49,0.08)]'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div className='min-w-0'>
                <div className='inline-flex items-center gap-2 rounded-full border border-[rgba(111,91,59,0.18)] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>
                  <FileText className='h-3.5 w-3.5' />
                  Step 1-5
                </div>
                <p className='mt-4 text-[22px] font-bold leading-[1.4] tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                  会員登録の準備を開始
                </p>
              </div>
            </div>

            <div className='mt-5 flex flex-wrap gap-2'>
              {accountOpeningHighlights.map((item) => (
                <span
                  key={item}
                  className='rounded-full border border-[rgba(5,32,49,0.08)] bg-white/86 px-3 py-2 text-[13px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'
                >
                  {item}
                </span>
              ))}
            </div>

            <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <Button
                type='button'
                size='lg'
                onClick={onStartMemberRegistration}
                className='h-12 rounded-[12px] bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] px-6 text-[14px] font-semibold tracking-[0.08em] text-white shadow-[0_18px_40px_rgba(95,69,35,0.28)] hover:opacity-95'
              >
                会員登録を始める
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value='account-opening' className='mt-0'>
          <div className='rounded-[14px] border border-[rgba(111,91,59,0.16)] bg-[linear-gradient(145deg,rgba(133,104,63,0.12),rgba(255,255,255,0.94)_42%,rgba(5,32,49,0.04)_100%)] p-5 shadow-[0_20px_48px_rgba(5,32,49,0.08)]'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div className='min-w-0'>
                <div className='inline-flex items-center gap-2 rounded-full border border-[rgba(111,91,59,0.18)] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>
                  <FileText className='h-3.5 w-3.5' />
                  Step 1
                </div>
                <p className='mt-4 text-[22px] font-bold leading-[1.4] tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                  個人口座開設の入力を開始
                </p>
              </div>
            </div>

            <div className='mt-5 flex flex-wrap gap-2'>
              {personalAccountOpeningHighlights.map((item) => (
                <span
                  key={item}
                  className='rounded-full border border-[rgba(5,32,49,0.08)] bg-white/86 px-3 py-2 text-[13px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'
                >
                  {item}
                </span>
              ))}
            </div>

            <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <Button
                type='button'
                size='lg'
                onClick={onStartPersonalAccountOpening}
                className='h-12 rounded-[12px] bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] px-6 text-[14px] font-semibold tracking-[0.08em] text-white shadow-[0_18px_40px_rgba(95,69,35,0.28)] hover:opacity-95'
              >
                個人口座開設 STEP1へ
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ContentCard>
  );

  const renderProductSummaryCard = () => (
    <ContentCard className='space-y-4' data-node-id='32374:139407'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <SectionLabel>商品分類サマリー</SectionLabel>
          <p className='mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
            商品分類ごとの評価額と損益を、モバイルでもデスクトップでも読みやすい一覧にしています。
          </p>
        </div>
      </div>

      <div className='hidden xl:grid xl:grid-cols-[minmax(180px,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_24px] xl:gap-4 xl:px-2 xl:text-[13px] xl:font-semibold xl:tracking-[0.08em] xl:text-[var(--ichiyoshi-ink-soft)]'>
        <span>商品分類</span>
        <span className='text-right'>評価額</span>
        <span className='text-right'>評価損益</span>
        <span />
      </div>

      <div className='space-y-3'>
        {portfolioChartData.map((item) => (
          <button
            key={item.label}
            type='button'
            className='grid w-full gap-3 rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-white/94 px-4 py-4 text-left shadow-[0_14px_32px_rgba(5,32,49,0.06)] transition-transform duration-200 hover:-translate-y-0.5 xl:grid-cols-[minmax(180px,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_24px] xl:items-center xl:gap-4'
          >
            <div className='flex min-w-0 items-center gap-3'>
              <span className='h-2.5 w-2.5 shrink-0 rounded-full' style={{ backgroundColor: item.color }} />
              <span className='truncate text-[15px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>{item.label}</span>
            </div>

            <div className='flex items-center justify-between gap-4 xl:block xl:text-right'>
              <span className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)] xl:hidden'>
                評価額
              </span>
              <span className='text-[17px] font-bold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>
                {item.value > 0 ? formatCurrency(item.value) : '--'}
              </span>
            </div>

            <div className='flex items-center justify-between gap-4 xl:block xl:text-right'>
              <span className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)] xl:hidden'>
                評価損益
              </span>
              <span
                className={cn(
                  'text-[16px] font-bold tracking-[0.03em]',
                  item.pnl > 0 ? 'text-[#507ae7]' : item.pnl < 0 ? 'text-[#b61704]' : 'text-[var(--ichiyoshi-ink-soft)]',
                )}
              >
                {item.pnl === 0 ? '0円' : formatSignedCurrency(item.pnl)}
              </span>
            </div>

            <span className='hidden items-center justify-center text-[var(--ichiyoshi-navy)] xl:flex'>
              <ChevronRight className='h-4 w-4' />
            </span>
          </button>
        ))}
      </div>
    </ContentCard>
  );

  const renderNotesCard = () => (
    <ContentCard className='space-y-5' data-node-id='32374:139422'>
      <div>
        <SectionLabel>ご案内</SectionLabel>
        <p className='mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
          ダッシュボード内の資産表示に関する注意事項です。更新基準や評価対象を確認できます。
        </p>
      </div>

      <div className='space-y-3'>
        {topNotes.map((note) => (
          <div
            key={note}
            className='rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-4 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'
          >
            {note}
          </div>
        ))}
      </div>
    </ContentCard>
  );

  return (
    <main className='min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(162,133,86,0.18),transparent_24%),radial-gradient(circle_at_90%_10%,rgba(5,32,49,0.16),transparent_20%),linear-gradient(180deg,#f7f3eb_0%,#eef2f4_34%,#e6ebee_100%)]'>
      <div className='mx-auto flex min-h-screen max-w-[1380px] flex-col'>
        <section className='relative flex flex-1 items-stretch justify-center px-0 py-0 sm:px-4 lg:px-6 xl:px-10'>
          <div className='relative w-full max-w-[1180px]'>
            <div className='pointer-events-none absolute inset-x-10 top-5 h-32 rounded-full bg-[rgba(162,133,86,0.18)] blur-3xl' />

            <div className='relative'>
              <header className='relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-[rgba(255,255,255,0.14)]'>
                <div className='absolute inset-0 bg-[linear-gradient(135deg,#2a3f4a_0%,#486371_54%,#8f7c63_100%)]' />
                <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(12,27,36,0.12))]' />
                <div className='pointer-events-none absolute -right-8 top-4 h-32 w-32 rounded-full bg-[rgba(255,255,255,0.1)] blur-3xl' />
                <div className='pointer-events-none absolute left-10 top-10 h-24 w-24 rounded-full bg-[rgba(234,224,200,0.16)] blur-2xl' />

                <div className='relative mx-auto w-full max-w-[1180px] px-4 pb-6 pt-5 sm:px-6 sm:pb-7 xl:px-8 xl:pb-8 xl:pt-7'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='max-w-[44rem] rounded-[16px] border border-white/10 bg-[rgba(24,35,46,0.18)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-5'>
                      <span className='inline-flex rounded-full border border-white/18 bg-white/14 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)] backdrop-blur'>
                        Portfolio Dashboard
                      </span>
                      <div className='mt-4 flex items-center gap-3'>
                        <span className='flex h-12 w-12 items-center justify-center rounded-[12px] bg-white/12 text-white shadow-[0_16px_32px_rgba(0,0,0,0.16)] ring-1 ring-white/12'>
                          <User className='h-5 w-5' />
                        </span>
                        <div>
                          <p className='text-[14px] font-semibold tracking-[0.08em] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.24)]'>
                            いちよし太郎 様
                          </p>
                          <h1 className='mt-1 text-[26px] font-bold leading-[1.25] tracking-[0.04em] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.28)] sm:text-[32px]'>
                            いちよしオンライン
                          </h1>
                        </div>
                      </div>
                      <p className='mt-4 max-w-[40rem] text-[13px] leading-6 text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.22)] sm:text-[14px]'>
                        保有資産と取引状況を、商品分類ごとにひと目で確認できるダッシュボードです。
                      </p>
                    </div>

                    <div className='flex items-center gap-2'>
                      <button
                        type='button'
                        className='hidden h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white backdrop-blur xl:inline-flex'
                        aria-label='お知らせ'
                      >
                        <Bell className='h-4 w-4' />
                      </button>
                      <button
                        type='button'
                        className='hidden h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white backdrop-blur xl:inline-flex'
                        aria-label='メニュー'
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
                    </div>
                  </div>
                </div>
              </header>

              <QuickAccessBar actions={quickAccessItems} containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <div className='px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8'>
                <div className='space-y-4 xl:hidden'>
                  {renderPortfolioSummaryCard()}
                  {renderApplicationsCard()}
                  {renderProductSummaryCard()}
                  {renderNotesCard()}
                </div>

                <div className='hidden xl:grid xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] xl:items-start xl:gap-4'>
                  <div className='space-y-4'>
                    {renderPortfolioSummaryCard()}
                    {renderProductSummaryCard()}
                  </div>

                  <div className='space-y-4'>
                    {renderApplicationsCard()}
                    {renderNotesCard()}
                  </div>
                </div>
              </div>

              <footer className='relative left-1/2 w-screen -translate-x-1/2 border-t border-white/70 bg-[linear-gradient(180deg,rgba(248,248,248,0.2),rgba(255,255,255,0.92))] text-center text-[12px] leading-[1.8] text-[var(--ichiyoshi-muted)] backdrop-blur xl:text-left'>
                <div className='mx-auto w-full max-w-[1180px] px-5 py-6 xl:px-8'>
                  <BrandMark className='justify-center xl:justify-start' />
                  <div className='mt-5 space-y-1'>
                    {companyInfoLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  <p className='mt-2'>Copyright © Ichiyoshi Securities Co., Ltd. All rights reserved.</p>
                </div>
              </footer>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
