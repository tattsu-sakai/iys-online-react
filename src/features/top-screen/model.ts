import type { ChartConfig } from '@/components/ui/chart';
import type { AssetTabKey } from '@/features/portfolio-assets/model';

export type PortfolioKey = AssetTabKey;

export type PortfolioItem = {
  key: PortfolioKey;
  label: string;
  pnl: number;
  value: number;
};

export type PortfolioChartDatum = PortfolioItem & {
  chartValue: number;
  color: string;
  fill: string;
  sharePercent: number;
};

export const portfolioChartConfig = {
  dreamCollection: { label: 'ドリコレ', color: '#a28556' },
  investmentTrust: { label: '投信', color: '#6f5b3b' },
  equity: { label: '株式', color: '#3e6074' },
  bond: { label: '債券', color: '#8096a5' },
  margin: { label: '信用建玉', color: '#c7b89f' },
  cash: { label: 'MRF/現金', color: '#d7e1e6' },
} satisfies ChartConfig;

export const portfolioItems: PortfolioItem[] = [
  { key: 'dreamCollection', label: 'ドリコレ', value: 97_118_604, pnl: 12_785_835 },
  { key: 'investmentTrust', label: '投信', value: 10_000_000, pnl: 120_000 },
  { key: 'equity', label: '株式', value: 16_686_654, pnl: 9_352_324 },
  { key: 'bond', label: '債券', value: 9_000_000, pnl: 100_000 },
  { key: 'margin', label: '信用建玉', value: 0, pnl: -100_000 },
  { key: 'cash', label: 'MRF/現金', value: 9_900_000, pnl: 0 },
];

export const topNotes = ['保有資産合計は前営業日約定基準で表示されます。', '一部評価できない銘柄は評価額に含まれていません。'];

export const topNewsItems = [
  {
    category: '重要',
    date: '2026/03/15',
    summary: '午前2:00-6:00はログインと一部照会サービスを停止します。事前に必要なご確認をお願いします。',
    title: 'システムメンテナンス実施のお知らせ',
  },
  {
    category: 'サービス',
    date: '2026/03/08',
    summary: '商品分類ごとの一覧性を高め、保有明細をより見やすくしました。',
    title: '預り資産画面の表示を改善しました',
  },
  {
    category: 'マーケット',
    date: '2026/03/05',
    summary: '今週のマーケットコメントと投信レポートを公開しています。',
    title: '最新レポートを公開しました',
  },
] as const;

export const personalAccountOpeningHighlights = [
  '交付書面の電子交付確認',
  '反社会的勢力非該当の同意',
  '重要事項の再説明設定',
  '家族構成とゆうちょ口座登録',
  '最後に確認画面で一括見直し',
];

const currencyFormatter = new Intl.NumberFormat('ja-JP');

export const totalAssets = portfolioItems.reduce((sum, item) => sum + item.value, 0);
export const totalPnl = portfolioItems.reduce((sum, item) => sum + item.pnl, 0);

export const portfolioChartData: PortfolioChartDatum[] = portfolioItems.map((item) => ({
  ...item,
  chartValue: item.value > 0 ? item.value : totalAssets * 0.006,
  color: portfolioChartConfig[item.key].color ?? '#d7e1e6',
  fill: `var(--color-${item.key})`,
  sharePercent: totalAssets > 0 ? (item.value / totalAssets) * 100 : 0,
}));

export function formatCurrency(value: number) {
  return `${currencyFormatter.format(value)}円`;
}

export function formatSignedCurrency(value: number) {
  const prefix = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${prefix}${currencyFormatter.format(Math.abs(value))}円`;
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}
