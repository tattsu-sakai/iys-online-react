export type AssetTabKey =
  | "dreamCollection"
  | "investmentTrust"
  | "equity"
  | "bond"
  | "margin"
  | "cash";

export type HoldingItem = {
  acquisitionAmount: number;
  acquisitionCostLabel?: string;
  accountType: string;
  code: string;
  evaluationAmount: number;
  evaluationRateLabel?: string;
  name: string;
  pnl: number;
  quantityLabel: string;
  referencePriceLabel?: string;
};

export type HoldingsSection = {
  items: HoldingItem[];
  title: string;
};

export type DomesticHoldingsPage = {
  sections: HoldingsSection[];
};

export const assetTabs: Array<{ key: AssetTabKey; label: string }> = [
  { key: "dreamCollection", label: "ドリコレ" },
  { key: "investmentTrust", label: "投信" },
  { key: "equity", label: "株式" },
  { key: "bond", label: "債券" },
  { key: "margin", label: "信用" },
  { key: "cash", label: "現金" },
];

export const displayNotes = [
  "「参考時価」は前営業日の参考時価を表示しています。",
  "表示金額および預り情報は前営業日基準で表示されます。",
  "保有資産については一部評価できない銘柄があり、そのような銘柄は評価額に含まれておりません。",
] as const;

export const domesticEquityPages: DomesticHoldingsPage[] = [
  {
    sections: [
      {
        title: "特定預り",
        items: [
          {
            accountType: "特定",
            acquisitionAmount: 3_699_400,
            acquisitionCostLabel: "36,994円",
            code: "8624",
            evaluationAmount: 3_699_400,
            name: "いちよし証券(株)",
            pnl: 0,
            quantityLabel: "100株",
            referencePriceLabel: "36,994円",
          },
          {
            accountType: "特定",
            acquisitionAmount: 836_800,
            acquisitionCostLabel: "8,368円",
            code: "5108",
            evaluationAmount: 1_107_400,
            name: "ブリヂストン",
            pnl: 270_600,
            quantityLabel: "100株",
            referencePriceLabel: "11,074円",
          },
          {
            accountType: "特定",
            acquisitionAmount: 16_800,
            acquisitionCostLabel: "168円",
            code: "9432",
            evaluationAmount: 14_700,
            name: "日本電信電話",
            pnl: -2_100,
            quantityLabel: "100株",
            referencePriceLabel: "147円",
          },
        ],
      },
      {
        title: "一般預り",
        items: [
          {
            accountType: "一般",
            acquisitionAmount: 251_000,
            code: "30043",
            evaluationAmount: 270_909,
            name: "三井住友・グローバル・リート・オープン",
            pnl: 19_909,
            quantityLabel: "口数 188,763",
          },
          {
            accountType: "一般",
            acquisitionAmount: 1_421_400,
            acquisitionCostLabel: "1,184円",
            code: "8306",
            evaluationAmount: 1_602_000,
            name: "三菱UFJフィナンシャル・グループ",
            pnl: 180_600,
            quantityLabel: "1,200株",
            referencePriceLabel: "1,335円",
          },
        ],
      },
      {
        title: "NISA預り",
        items: [
          {
            accountType: "NISA",
            acquisitionAmount: 570_900,
            acquisitionCostLabel: "5,709円",
            code: "9554",
            evaluationAmount: 545_500,
            name: "M&A総研ホールディングス",
            pnl: -25_400,
            quantityLabel: "100株",
            referencePriceLabel: "5,455円",
          },
          {
            accountType: "NISA(成長投資枠)",
            acquisitionAmount: 451_000,
            acquisitionCostLabel: "2,255円",
            code: "7280",
            evaluationAmount: 447_500,
            name: "ミツバ",
            pnl: -3_500,
            quantityLabel: "200株",
            referencePriceLabel: "2,237円",
          },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "特定預り",
        items: [
          {
            accountType: "特定",
            acquisitionAmount: 924_500,
            acquisitionCostLabel: "3,698円",
            code: "6501",
            evaluationAmount: 968_000,
            name: "日立製作所",
            pnl: 43_500,
            quantityLabel: "250株",
            referencePriceLabel: "3,872円",
          },
          {
            accountType: "特定",
            acquisitionAmount: 2_115_000,
            acquisitionCostLabel: "2,350円",
            code: "6098",
            evaluationAmount: 2_238_000,
            name: "リクルートホールディングス",
            pnl: 123_000,
            quantityLabel: "600株",
            referencePriceLabel: "3,730円",
          },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "一般預り",
        items: [
          {
            accountType: "一般",
            acquisitionAmount: 640_000,
            acquisitionCostLabel: "1,280円",
            code: "7270",
            evaluationAmount: 611_000,
            name: "SUBARU",
            pnl: -29_000,
            quantityLabel: "500株",
            referencePriceLabel: "1,222円",
          },
          {
            accountType: "一般",
            acquisitionAmount: 1_482_000,
            acquisitionCostLabel: "1,482円",
            code: "8316",
            evaluationAmount: 1_566_000,
            name: "三井住友フィナンシャルグループ",
            pnl: 84_000,
            quantityLabel: "1,000株",
            referencePriceLabel: "1,566円",
          },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "NISA預り",
        items: [
          {
            accountType: "NISA",
            acquisitionAmount: 1_033_200,
            acquisitionCostLabel: "3,444円",
            code: "7011",
            evaluationAmount: 1_098_000,
            name: "三菱重工業",
            pnl: 64_800,
            quantityLabel: "300株",
            referencePriceLabel: "3,660円",
          },
          {
            accountType: "NISA(成長投資枠)",
            acquisitionAmount: 714_000,
            acquisitionCostLabel: "2,380円",
            code: "7203",
            evaluationAmount: 702_000,
            name: "トヨタ自動車",
            pnl: -12_000,
            quantityLabel: "300株",
            referencePriceLabel: "2,340円",
          },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: "特定預り",
        items: [
          {
            accountType: "特定",
            acquisitionAmount: 2_520_000,
            acquisitionCostLabel: "7,000円",
            code: "8035",
            evaluationAmount: 2_746_800,
            name: "東京エレクトロン",
            pnl: 226_800,
            quantityLabel: "360株",
            referencePriceLabel: "7,630円",
          },
          {
            accountType: "特定",
            acquisitionAmount: 1_188_000,
            acquisitionCostLabel: "2,970円",
            code: "9984",
            evaluationAmount: 1_124_000,
            name: "ソフトバンクグループ",
            pnl: -64_000,
            quantityLabel: "400株",
            referencePriceLabel: "2,810円",
          },
        ],
      },
    ],
  },
];

export const foreignEquitySections: HoldingsSection[] = [
  {
    title: "特定預り",
    items: [
      {
        accountType: "特定",
        acquisitionAmount: 345_600,
        acquisitionCostLabel: "6円",
        code: "Z4097",
        evaluationAmount: 9_092_764,
        evaluationRateLabel: "19.61円 / 香港ドル",
        name: "KINGDEE INTERNATIONAL SOFTWARE",
        pnl: 8_747_164,
        quantityLabel: "57,600株",
        referencePriceLabel: "8.05香港ドル",
      },
    ],
  },
];

export const assetTabSummary: Record<
  AssetTabKey,
  {
    holdingsLabel: string;
    note: string;
    totalAmount: number;
    totalPnl: number;
  }
> = {
  bond: {
    holdingsLabel: "債券 2銘柄",
    note: "償還日と利回りを確認しやすいよう、満期順に表示します。",
    totalAmount: 9_000_000,
    totalPnl: 100_000,
  },
  cash: {
    holdingsLabel: "MRF / 現金",
    note: "待機資金と入出金の反映状況をすぐに確認できます。",
    totalAmount: 9_900_000,
    totalPnl: 0,
  },
  dreamCollection: {
    holdingsLabel: "ドリコレ 4銘柄",
    note: "ドリコレの保有明細は評価額順に要点だけ表示しています。",
    totalAmount: 97_118_604,
    totalPnl: 12_785_835,
  },
  equity: {
    holdingsLabel: "株式 11銘柄",
    note: "国内株式と外国株式を預り区分ごとに分けて確認できます。",
    totalAmount: 16_686_654,
    totalPnl: 9_352_324,
  },
  investmentTrust: {
    holdingsLabel: "投信 3銘柄",
    note: "基準価額・損益・口数を一覧で確認できる構成にしています。",
    totalAmount: 10_000_000,
    totalPnl: 120_000,
  },
  margin: {
    holdingsLabel: "信用建玉 0件",
    note: "建玉がある場合は返済期日と評価損益をこの画面で確認します。",
    totalAmount: 0,
    totalPnl: -100_000,
  },
};
