export type HistoryPeriodKey = '3m' | '6m' | '1y' | '3y';
export type TradeHistoryProductKey =
  | 'allExceptMrf'
  | 'equity'
  | 'investmentTrust'
  | 'bond'
  | 'dreamCollection'
  | 'cash';
export type TransactionCategoryKey = 'all' | 'execution' | 'income' | 'cash';
export type TradeHistoryAccountKey =
  | 'all'
  | 'specified'
  | 'general'
  | 'nisa'
  | 'tsumitateNisa'
  | 'nisaGrowth'
  | 'nisaReserve';
export type TradeHistoryTone = 'buy' | 'sell' | 'income' | 'cash';

export type TradeHistoryFilters = {
  account: TradeHistoryAccountKey;
  product: TradeHistoryProductKey;
  transaction: TransactionCategoryKey;
};

export type TradeHistoryRecord = {
  account: TradeHistoryAccountKey;
  accountLabel: string;
  contractDate: string;
  feeLabel: string;
  id: string;
  product: Exclude<TradeHistoryProductKey, 'allExceptMrf'>;
  productLabel: string;
  quantityLabel: string;
  securityName: string;
  settlementAmount: number;
  settlementDate: string;
  tone: TradeHistoryTone;
  transaction: Exclude<TransactionCategoryKey, 'all'>;
  transactionLabel: string;
  unitPriceLabel: string;
};

export const historyPeriods: Array<{ key: HistoryPeriodKey; label: string; months: number }> = [
  { key: '3m', label: '3ヶ月', months: 3 },
  { key: '6m', label: '6ヶ月', months: 6 },
  { key: '1y', label: '1年', months: 12 },
  { key: '3y', label: '3年', months: 36 },
];

export const tradeHistoryProductOptions: Array<{ key: TradeHistoryProductKey; label: string }> = [
  { key: 'allExceptMrf', label: 'すべて（MRF除く）' },
  { key: 'equity', label: '国内株式' },
  { key: 'investmentTrust', label: '投資信託' },
  { key: 'bond', label: '債券' },
  { key: 'dreamCollection', label: 'ドリーム・コレクション' },
  { key: 'cash', label: '現金・入出金' },
];

export const transactionCategoryOptions: Array<{ key: TransactionCategoryKey; label: string }> = [
  { key: 'all', label: 'すべて' },
  { key: 'execution', label: '約定' },
  { key: 'income', label: '利金・分配金・配当金等' },
  { key: 'cash', label: '入出金' },
];

export const tradeHistoryAccountOptions: Array<{ key: TradeHistoryAccountKey; label: string }> = [
  { key: 'all', label: 'すべて' },
  { key: 'specified', label: '特定預り' },
  { key: 'general', label: '一般預り' },
  { key: 'nisa', label: 'NISA預り' },
  { key: 'tsumitateNisa', label: 'つみたてNISA預り' },
  { key: 'nisaGrowth', label: 'NISA預り（成長投資枠）' },
  { key: 'nisaReserve', label: 'NISA預り（つみたて投資枠）' },
];

export const defaultTradeHistoryFilters: TradeHistoryFilters = {
  account: 'all',
  product: 'allExceptMrf',
  transaction: 'all',
};

export const tradeHistoryRecords: TradeHistoryRecord[] = [
  {
    account: 'nisaReserve',
    accountLabel: 'NISA預り（つみたて投資枠）',
    contractDate: '2025-01-24',
    feeLabel: '0円',
    id: 'tx-001',
    product: 'investmentTrust',
    productLabel: '投資信託',
    quantityLabel: '10,000口',
    securityName: 'eMAXIS Slim 全世界株式',
    settlementAmount: 258_000,
    settlementDate: '2025-01-28',
    tone: 'buy',
    transaction: 'execution',
    transactionLabel: '買付',
    unitPriceLabel: '25,800円',
  },
  {
    account: 'specified',
    accountLabel: '特定預り',
    contractDate: '2025-01-18',
    feeLabel: '1,210円',
    id: 'tx-002',
    product: 'equity',
    productLabel: '国内株式',
    quantityLabel: '100株',
    securityName: 'トヨタ自動車',
    settlementAmount: 314_500,
    settlementDate: '2025-01-22',
    tone: 'sell',
    transaction: 'execution',
    transactionLabel: '売却',
    unitPriceLabel: '3,145円',
  },
  {
    account: 'specified',
    accountLabel: '特定預り',
    contractDate: '2025-01-15',
    feeLabel: '0円',
    id: 'tx-003',
    product: 'bond',
    productLabel: '債券',
    quantityLabel: '100口',
    securityName: '第163回 個人向け利付国債（変動・10年）',
    settlementAmount: 10_000,
    settlementDate: '2025-01-15',
    tone: 'income',
    transaction: 'income',
    transactionLabel: '利金',
    unitPriceLabel: '100円',
  },
  {
    account: 'specified',
    accountLabel: '証券総合口座',
    contractDate: '2025-01-11',
    feeLabel: '0円',
    id: 'tx-004',
    product: 'cash',
    productLabel: '現金・入出金',
    quantityLabel: '--',
    securityName: '登録口座からのご入金',
    settlementAmount: 500_000,
    settlementDate: '2025-01-11',
    tone: 'cash',
    transaction: 'cash',
    transactionLabel: '入金',
    unitPriceLabel: '--',
  },
  {
    account: 'specified',
    accountLabel: '特定預り',
    contractDate: '2024-12-27',
    feeLabel: '3,300円',
    id: 'tx-005',
    product: 'dreamCollection',
    productLabel: 'ドリーム・コレクション',
    quantityLabel: '20,000口',
    securityName: 'いちよしファンドラップ ドリーム・コレクション',
    settlementAmount: 1_000_000,
    settlementDate: '2025-01-07',
    tone: 'buy',
    transaction: 'execution',
    transactionLabel: '買付',
    unitPriceLabel: '50,000円',
  },
  {
    account: 'nisa',
    accountLabel: 'NISA預り',
    contractDate: '2024-12-18',
    feeLabel: '0円',
    id: 'tx-006',
    product: 'investmentTrust',
    productLabel: '投資信託',
    quantityLabel: '12,000口',
    securityName: 'いちよし日本好配当ファンド',
    settlementAmount: 32_400,
    settlementDate: '2024-12-20',
    tone: 'income',
    transaction: 'income',
    transactionLabel: '分配金',
    unitPriceLabel: '32円',
  },
  {
    account: 'general',
    accountLabel: '一般預り',
    contractDate: '2024-11-26',
    feeLabel: '15,428円',
    id: 'tx-007',
    product: 'equity',
    productLabel: '国内株式',
    quantityLabel: '300株',
    securityName: 'ソフトバンクグループ',
    settlementAmount: 265_957,
    settlementDate: '2024-11-29',
    tone: 'sell',
    transaction: 'execution',
    transactionLabel: '信用売決済',
    unitPriceLabel: '8,799円',
  },
  {
    account: 'specified',
    accountLabel: '証券総合口座',
    contractDate: '2024-11-04',
    feeLabel: '0円',
    id: 'tx-008',
    product: 'cash',
    productLabel: '現金・入出金',
    quantityLabel: '--',
    securityName: '登録口座へのご出金',
    settlementAmount: 300_000,
    settlementDate: '2024-11-04',
    tone: 'cash',
    transaction: 'cash',
    transactionLabel: '出金',
    unitPriceLabel: '--',
  },
  {
    account: 'tsumitateNisa',
    accountLabel: 'つみたてNISA預り',
    contractDate: '2024-10-31',
    feeLabel: '0円',
    id: 'tx-009',
    product: 'investmentTrust',
    productLabel: '投資信託',
    quantityLabel: '5,300口',
    securityName: 'ひふみプラス',
    settlementAmount: 50_000,
    settlementDate: '2024-11-06',
    tone: 'buy',
    transaction: 'execution',
    transactionLabel: '買付',
    unitPriceLabel: '9,433円',
  },
  {
    account: 'nisaGrowth',
    accountLabel: 'NISA預り（成長投資枠）',
    contractDate: '2024-09-12',
    feeLabel: '520円',
    id: 'tx-010',
    product: 'equity',
    productLabel: '国内株式',
    quantityLabel: '200株',
    securityName: '三菱UFJフィナンシャル・グループ',
    settlementAmount: 248_000,
    settlementDate: '2024-09-17',
    tone: 'buy',
    transaction: 'execution',
    transactionLabel: '買付',
    unitPriceLabel: '1,240円',
  },
  {
    account: 'specified',
    accountLabel: '特定預り',
    contractDate: '2024-07-22',
    feeLabel: '0円',
    id: 'tx-011',
    product: 'bond',
    productLabel: '債券',
    quantityLabel: '200口',
    securityName: '第161回 個人向け利付国債（固定・5年）',
    settlementAmount: 20_000,
    settlementDate: '2024-07-22',
    tone: 'income',
    transaction: 'income',
    transactionLabel: '償還',
    unitPriceLabel: '100円',
  },
  {
    account: 'specified',
    accountLabel: '特定預り',
    contractDate: '2024-03-21',
    feeLabel: '2,860円',
    id: 'tx-012',
    product: 'equity',
    productLabel: '国内株式',
    quantityLabel: '150株',
    securityName: 'オリエンタルランド',
    settlementAmount: 289_500,
    settlementDate: '2024-03-27',
    tone: 'sell',
    transaction: 'execution',
    transactionLabel: '売却',
    unitPriceLabel: '1,930円',
  },
];
