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

export type StructuredDetailCell = {
  label: string;
  value: string;
};

export type StructuredDetailRow = {
  left: StructuredDetailCell;
  right?: StructuredDetailCell;
};

export type StructuredHoldingItem = {
  accountType: string;
  badges?: string[];
  code?: string;
  detailRows: StructuredDetailRow[];
  evaluationAmount: number;
  name: string;
  pnl: number;
};

export type StructuredHoldingSection = {
  items: StructuredHoldingItem[];
  title?: string;
};

export type StructuredHoldingCategory = {
  sections: StructuredHoldingSection[];
  title: string;
};

export type StructuredHoldingsPage = {
  categories: StructuredHoldingCategory[];
};

export type DisplayNotesContent = {
  description: string;
  notes: string[];
};

export type DreamCollectionSummaryRow = {
  label: string;
  value: number;
};

export type DreamCollectionTotal = {
  detailRows: DreamCollectionSummaryRow[];
  evaluationAmount: number;
  pnl: number;
  title: string;
};

export type DreamCollectionDetailCell = {
  align?: "center" | "left" | "right";
  label: string;
  value: string;
};

export type DreamCollectionDetailRow = {
  left: DreamCollectionDetailCell;
  right?: DreamCollectionDetailCell;
};

export type DreamCollectionContract = {
  course: string;
  detailRows: DreamCollectionDetailRow[];
  evaluationAmount: number;
  pnl: number;
  summaryRows: DreamCollectionSummaryRow[];
  title: string;
};

export const assetTabs: Array<{ key: AssetTabKey; label: string }> = [
  { key: "dreamCollection", label: "ドリコレ" },
  { key: "investmentTrust", label: "投信" },
  { key: "equity", label: "株式" },
  { key: "bond", label: "債券" },
  { key: "margin", label: "信用" },
  { key: "cash", label: "現金" },
];

export const displayNotesByTab: Record<AssetTabKey, DisplayNotesContent> = {
  bond: {
    description: "前営業日基準の表示ルールと、評価額に含まれない銘柄の扱いを確認できます。",
    notes: [
      "「参考時価」は前営業日の参考時価を表示しています。",
      "表示金額および預り情報は前営業日基準で表示されます。",
      "保有資産については一部評価できない銘柄があり、そのような銘柄は評価額に含まれておりません。",
    ],
  },
  cash: {
    description: "前営業日基準の表示ルールと、評価額に含まれない銘柄の扱いを確認できます。",
    notes: [
      "表示金額および預り情報は前営業日基準で表示されます。",
      "反映タイミングにより一時的に表示されない入出金がある場合があります。",
      "保有資産については一部評価できない銘柄があり、そのような銘柄は評価額に含まれておりません。",
    ],
  },
  dreamCollection: {
    description: "時価評価額と評価損益の計算ルールを事前に確認できます。",
    notes: [
      "表示金額および預り情報は前営業日基準で表示されます。",
      "「時価評価額」は、初回運用開始日からの料金（口座管理料・投資顧問報酬）を控除した額です。",
      "「評価損益」=「時価評価額」-（「初回契約金額」+「追加入金累計額」-「一部解約累計額」）",
    ],
  },
  equity: {
    description: "前営業日基準の表示ルールと、評価額に含まれない銘柄の扱いを確認できます。",
    notes: [
      "「参考時価」は前営業日の参考時価を表示しています。",
      "表示金額および預り情報は前営業日基準で表示されます。",
      "保有資産については一部評価できない銘柄があり、そのような銘柄は評価額に含まれておりません。",
    ],
  },
  investmentTrust: {
    description: "前営業日基準の表示ルールと、評価額に含まれない銘柄の扱いを確認できます。",
    notes: [
      "「参考時価」は前営業日の参考時価を表示しています。",
      "表示金額および預り情報は前営業日基準で表示されます。",
      "保有資産については一部評価できない銘柄があり、そのような銘柄は評価額に含まれておりません。",
    ],
  },
  margin: {
    description: "前営業日基準の表示ルールと、評価額に含まれない銘柄の扱いを確認できます。",
    notes: [
      "「参考時価」は前営業日の参考時価を表示しています。",
      "表示金額および預り情報は前営業日基準で表示されます。",
      "保有資産については一部評価できない銘柄があり、そのような銘柄は評価額に含まれておりません。",
    ],
  },
};

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

export const dreamCollectionTotal: DreamCollectionTotal = {
  detailRows: [
    { label: "初回契約金額", value: 5_000_000 },
    { label: "追加入金累計額", value: 3_000_000 },
    { label: "一部解約累計額", value: 0 },
  ],
  evaluationAmount: 97_118_604,
  pnl: 12_785_835,
  title: "ドリコレ契約合計",
};

export const dreamCollectionContracts: DreamCollectionContract[] = [
  {
    course: "Aコース",
    detailRows: [
      {
        left: { label: "初回運用開始日", value: "2023/05/01" },
        right: { label: "期間", value: "20年" },
      },
      {
        left: { label: "目標金額", value: "2,000,000円" },
        right: { align: "center", label: "運用モデル", value: "運用モデル4 標準" },
      },
      {
        left: { align: "center", label: "ドリコレミニ", value: "○（2万円/月）" },
        right: { align: "center", label: "ドリコレNISA", value: "○" },
      },
      {
        left: { align: "center", label: "決算月", value: "6月" },
        right: { align: "center", label: "報酬制", value: "固定報酬制" },
      },
      {
        left: { label: "HWM", value: "2,000,000円" },
        right: { align: "center", label: "ドリコレパス", value: "○" },
      },
    ],
    evaluationAmount: 57_802_952,
    pnl: 6_902_952,
    summaryRows: [
      { label: "初回契約金額", value: 5_000_000 },
      { label: "追加入金累計額", value: 1_500_000 },
      { label: "一部解約累計額", value: 0 },
    ],
    title: "老後生活の充実",
  },
  {
    course: "Bコース",
    detailRows: [
      {
        left: { label: "初回運用開始日", value: "2024/01/01" },
        right: { label: "期間", value: "30年" },
      },
      {
        left: { label: "目標金額", value: "1,000,000円" },
        right: { align: "center", label: "運用モデル", value: "運用モデル5 積極的" },
      },
      {
        left: { align: "center", label: "ドリコレミニ", value: "○（3万円/月）" },
        right: { align: "center", label: "ドリコレNISA", value: "○" },
      },
      {
        left: { align: "center", label: "決算月", value: "3月" },
        right: { align: "center", label: "報酬制", value: "固定報酬制" },
      },
      {
        left: { label: "HWM", value: "1,000,000円" },
        right: { align: "center", label: "ドリコレパス", value: "○" },
      },
    ],
    evaluationAmount: 28_538_889,
    pnl: 4_700_000,
    summaryRows: [
      { label: "初回契約金額", value: 12_000_000 },
      { label: "追加入金累計額", value: 0 },
      { label: "一部解約累計額", value: 0 },
    ],
    title: "旅行",
  },
  {
    course: "Cコース",
    detailRows: [
      {
        left: { label: "初回運用開始日", value: "2025/04/01" },
        right: { label: "期間", value: "18年" },
      },
      {
        left: { label: "目標金額", value: "3,000,000円" },
        right: { align: "center", label: "運用モデル", value: "運用モデル3 安定" },
      },
      {
        left: { align: "center", label: "ドリコレミニ", value: "○（1万円/月）" },
        right: { align: "center", label: "ドリコレNISA", value: "○" },
      },
      {
        left: { align: "center", label: "決算月", value: "9月" },
        right: { align: "center", label: "報酬制", value: "固定報酬制" },
      },
      {
        left: { label: "HWM", value: "3,000,000円" },
        right: { align: "center", label: "ドリコレパス", value: "○" },
      },
    ],
    evaluationAmount: 10_776_763,
    pnl: 1_182_883,
    summaryRows: [
      { label: "初回契約金額", value: 3_000_000 },
      { label: "追加入金累計額", value: 1_500_000 },
      { label: "一部解約累計額", value: 0 },
    ],
    title: "子/孫の教育資金",
  },
];

export const detailedAssetTabs = ["investmentTrust", "bond", "margin"] as const;
export type DetailedAssetTabKey = (typeof detailedAssetTabs)[number];

export const detailedHoldingsPagesByTab: Record<DetailedAssetTabKey, StructuredHoldingsPage[]> = {
  investmentTrust: [
    {
      categories: [
        {
          title: "国内投信",
          sections: [
            {
              title: "特定預り",
              items: [
                {
                  accountType: "NISA(つみたて投資枠)",
                  detailRows: [
                    { left: { label: "数量", value: "224,768口" }, right: { label: "取得コスト", value: "19,354円" } },
                    { left: { label: "参考時価", value: "30,111円" }, right: { label: "取得金額", value: "435,014円" } },
                    { left: { label: "償還日", value: "----/--/--" }, right: { label: "決算日", value: "2024/01/01" } },
                  ],
                  evaluationAmount: 676_798,
                  name: "つみたて先進国株式",
                  pnl: 241_784,
                },
                {
                  accountType: "特定",
                  detailRows: [
                    { left: { label: "数量", value: "168,420口" }, right: { label: "取得コスト", value: "15,180円" } },
                    { left: { label: "参考時価", value: "16,422円" }, right: { label: "取得金額", value: "2,556,200円" } },
                    { left: { label: "償還日", value: "----/--/--" }, right: { label: "決算日", value: "2024/12/20" } },
                  ],
                  evaluationAmount: 2_765_000,
                  name: "インデックスバランス(8資産均等型)",
                  pnl: 208_800,
                },
              ],
            },
          ],
        },
        {
          title: "外国投信",
          sections: [
            {
              title: "特定預り",
              items: [
                {
                  accountType: "特定",
                  code: "X0937",
                  detailRows: [
                    { left: { label: "数量", value: "15,424,012口" }, right: { label: "取得コスト", value: "123.78円" } },
                    { left: { label: "参考時価", value: "1米ドル" }, right: { label: "取得金額", value: "19,091,841円" } },
                    { left: { label: "評価レート", value: "152.43円/\n米ドル" }, right: { label: "決算日", value: "無分配" } },
                  ],
                  evaluationAmount: 23_510_820,
                  name: "ノムラ・グローバル・セレクト・トラストアメリカMMF",
                  pnl: 4_418_979,
                },
                {
                  accountType: "特定",
                  code: "X1082",
                  detailRows: [
                    { left: { label: "数量", value: "3,105,402口" }, right: { label: "取得コスト", value: "9,884円" } },
                    { left: { label: "参考時価", value: "1.25米ドル" }, right: { label: "取得金額", value: "3,164,500円" } },
                    { left: { label: "評価レート", value: "151.92円/\n米ドル" }, right: { label: "決算日", value: "毎月分配" } },
                  ],
                  evaluationAmount: 3_472_100,
                  name: "グローバル債券インカムファンド",
                  pnl: 307_600,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      categories: [
        {
          title: "国内投信",
          sections: [
            {
              title: "一般預り",
              items: [
                {
                  accountType: "一般",
                  detailRows: [
                    { left: { label: "数量", value: "327,100口" }, right: { label: "取得コスト", value: "11,250円" } },
                    { left: { label: "参考時価", value: "13,102円" }, right: { label: "取得金額", value: "3,679,875円" } },
                    { left: { label: "償還日", value: "----/--/--" }, right: { label: "決算日", value: "2025/03/25" } },
                  ],
                  evaluationAmount: 4_286_800,
                  name: "国内大型グロース戦略ファンド",
                  pnl: 606_925,
                },
                {
                  accountType: "NISA(成長投資枠)",
                  detailRows: [
                    { left: { label: "数量", value: "178,502口" }, right: { label: "取得コスト", value: "10,998円" } },
                    { left: { label: "参考時価", value: "11,331円" }, right: { label: "取得金額", value: "1,963,300円" } },
                    { left: { label: "償還日", value: "----/--/--" }, right: { label: "決算日", value: "2024/08/10" } },
                  ],
                  evaluationAmount: 2_022_600,
                  name: "いちよし日本成長セレクト",
                  pnl: 59_300,
                },
              ],
            },
          ],
        },
        {
          title: "外国投信",
          sections: [
            {
              title: "特定預り",
              items: [
                {
                  accountType: "特定",
                  code: "X4011",
                  detailRows: [
                    { left: { label: "数量", value: "2,008,012口" }, right: { label: "取得コスト", value: "13,455円" } },
                    { left: { label: "参考時価", value: "92.21ユーロ" }, right: { label: "取得金額", value: "2,702,330円" } },
                    { left: { label: "評価レート", value: "162.08円/\nユーロ" }, right: { label: "決算日", value: "年2回" } },
                  ],
                  evaluationAmount: 2_995_020,
                  name: "欧州ハイクオリティ株式ファンド",
                  pnl: 292_690,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      categories: [
        {
          title: "国内投信",
          sections: [
            {
              title: "特定預り",
              items: [
                {
                  accountType: "特定",
                  detailRows: [
                    { left: { label: "数量", value: "95,400口" }, right: { label: "取得コスト", value: "12,122円" } },
                    { left: { label: "参考時価", value: "12,844円" }, right: { label: "取得金額", value: "1,156,438円" } },
                    { left: { label: "償還日", value: "----/--/--" }, right: { label: "決算日", value: "2024/11/30" } },
                  ],
                  evaluationAmount: 1_225_308,
                  name: "国内リートインデックスファンド",
                  pnl: 68_870,
                },
              ],
            },
          ],
        },
        {
          title: "外国投信",
          sections: [
            {
              title: "特定預り",
              items: [
                {
                  accountType: "特定",
                  code: "X9182",
                  detailRows: [
                    { left: { label: "数量", value: "1,448,800口" }, right: { label: "取得コスト", value: "1.08米ドル" } },
                    { left: { label: "参考時価", value: "1.21米ドル" }, right: { label: "取得金額", value: "2,510,014円" } },
                    { left: { label: "評価レート", value: "153.22円/\n米ドル" }, right: { label: "決算日", value: "毎月分配" } },
                  ],
                  evaluationAmount: 2_780_510,
                  name: "グローバル短期債券ヘッジファンド",
                  pnl: 270_496,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  bond: [
    {
      categories: [
        {
          title: "国内債券",
          sections: [
            {
              title: "特定預り",
              items: [
                {
                  accountType: "特定",
                  detailRows: [
                    { left: { label: "数量", value: "10,000,000" }, right: { label: "取得コスト", value: "100円" } },
                    { left: { label: "参考時価", value: "100円" }, right: { label: "取得金額", value: "10,000,000円" } },
                    { left: { label: "償還日", value: "2024/01/01" }, right: { label: "利払日", value: "01/01・07/01" } },
                    { left: { label: "利率", value: "利率変動" } },
                  ],
                  evaluationAmount: 10_000_000,
                  name: "第163回個人向け利付国債（変動・10年）",
                  pnl: 0,
                },
                {
                  accountType: "特定",
                  detailRows: [
                    { left: { label: "数量", value: "4,500,000" }, right: { label: "取得コスト", value: "99.80円" } },
                    { left: { label: "参考時価", value: "101.15円" }, right: { label: "取得金額", value: "4,491,000円" } },
                    { left: { label: "償還日", value: "2027/03/20" }, right: { label: "利払日", value: "03/20・09/20" } },
                    { left: { label: "利率", value: "0.52%" } },
                  ],
                  evaluationAmount: 4_551_750,
                  name: "第42回地方債（5年）",
                  pnl: 60_750,
                },
              ],
            },
          ],
        },
        {
          title: "外国債券",
          sections: [
            {
              title: "特定預り",
              items: [
                {
                  accountType: "特定",
                  code: "LK313",
                  detailRows: [
                    { left: { label: "数量", value: "10,000,000" }, right: { label: "取得コスト", value: "100円" } },
                    { left: { label: "参考時価", value: "100米ドル" }, right: { label: "取得金額", value: "10,000,000円" } },
                    { left: { label: "償還日", value: "2026/11/30" }, right: { label: "利払日", value: "01/01・07/01" } },
                    { left: { label: "評価レート", value: "152.43円/\n米ドル" }, right: { label: "利率", value: "1.25%" } },
                  ],
                  evaluationAmount: 711_848,
                  name: "トレジャリーノート",
                  pnl: 94_594,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      categories: [
        {
          title: "国内債券",
          sections: [
            {
              title: "特定預り",
              items: [
                {
                  accountType: "特定",
                  detailRows: [
                    { left: { label: "数量", value: "6,200,000" }, right: { label: "取得コスト", value: "100.10円" } },
                    { left: { label: "参考時価", value: "100.42円" }, right: { label: "取得金額", value: "6,206,200円" } },
                    { left: { label: "償還日", value: "2028/06/30" }, right: { label: "利払日", value: "06/30・12/30" } },
                    { left: { label: "利率", value: "0.41%" } },
                  ],
                  evaluationAmount: 6_225_900,
                  name: "個人向け利付国債（固定・5年）",
                  pnl: 19_700,
                },
              ],
            },
          ],
        },
        {
          title: "外国債券",
          sections: [
            {
              title: "特定預り",
              items: [
                {
                  accountType: "特定",
                  code: "US912",
                  detailRows: [
                    { left: { label: "数量", value: "4,000,000" }, right: { label: "取得コスト", value: "99.52円" } },
                    { left: { label: "参考時価", value: "101.12米ドル" }, right: { label: "取得金額", value: "3,980,800円" } },
                    { left: { label: "償還日", value: "2027/09/15" }, right: { label: "利払日", value: "03/15・09/15" } },
                    { left: { label: "評価レート", value: "151.80円/\n米ドル" }, right: { label: "利率", value: "1.10%" } },
                  ],
                  evaluationAmount: 4_120_120,
                  name: "米国国債（2年）",
                  pnl: 139_320,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      categories: [
        {
          title: "国内債券",
          sections: [
            {
              title: "一般預り",
              items: [
                {
                  accountType: "一般",
                  detailRows: [
                    { left: { label: "数量", value: "3,000,000" }, right: { label: "取得コスト", value: "99.20円" } },
                    { left: { label: "参考時価", value: "98.90円" }, right: { label: "取得金額", value: "2,976,000円" } },
                    { left: { label: "償還日", value: "2026/03/25" }, right: { label: "利払日", value: "03/25・09/25" } },
                    { left: { label: "利率", value: "0.25%" } },
                  ],
                  evaluationAmount: 2_967_000,
                  name: "国内社債A（3年）",
                  pnl: -9_000,
                },
              ],
            },
          ],
        },
        {
          title: "外国債券",
          sections: [
            {
              title: "一般預り",
              items: [
                {
                  accountType: "一般",
                  code: "EU750",
                  detailRows: [
                    { left: { label: "数量", value: "2,500,000" }, right: { label: "取得コスト", value: "101.25円" } },
                    { left: { label: "参考時価", value: "99.81ユーロ" }, right: { label: "取得金額", value: "2,531,250円" } },
                    { left: { label: "償還日", value: "2029/12/20" }, right: { label: "利払日", value: "06/20・12/20" } },
                    { left: { label: "評価レート", value: "161.22円/\nユーロ" }, right: { label: "利率", value: "1.55%" } },
                  ],
                  evaluationAmount: 2_470_600,
                  name: "ユーロ建て社債（5年）",
                  pnl: -60_650,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  margin: [
    {
      categories: [
        {
          title: "信用建玉",
          sections: [
            {
              title: "特定預り",
              items: [
                {
                  accountType: "特定",
                  code: "9101",
                  detailRows: [
                    { left: { label: "建区分", value: "買建" }, right: { label: "建市場", value: "東証" } },
                    { left: { label: "新規建日", value: "24/10/15" }, right: { label: "決済期日", value: "25/04/15" } },
                    { left: { label: "数量", value: "4000" }, right: { label: "取得コスト", value: "--" } },
                    { left: { label: "参考時価", value: "5,122円" }, right: { label: "取得金額", value: "20,022,300円" } },
                  ],
                  evaluationAmount: 20_488_000,
                  name: "日本郵船",
                  pnl: 465_700,
                },
                {
                  accountType: "特定",
                  code: "9984",
                  detailRows: [
                    { left: { label: "建区分", value: "売建" }, right: { label: "建市場", value: "東証" } },
                    { left: { label: "新規建日", value: "24/11/01" }, right: { label: "決済期日", value: "25/05/01" } },
                    { left: { label: "数量", value: "1200" }, right: { label: "取得コスト", value: "--" } },
                    { left: { label: "参考時価", value: "8,236円" }, right: { label: "取得金額", value: "9,792,000円" } },
                  ],
                  evaluationAmount: 9_883_200,
                  name: "ソフトバンクグループ",
                  pnl: -91_200,
                },
              ],
            },
          ],
        },
        {
          title: "株式/投信（代用預り）",
          sections: [
            {
              items: [
                {
                  accountType: "特定",
                  badges: ["代用預り"],
                  code: "8624",
                  detailRows: [
                    { left: { label: "数量", value: "5,300株" }, right: { label: "取得コスト", value: "698円" } },
                    { left: { label: "参考時価", value: "698円" }, right: { label: "取得金額", value: "3,699,400円" } },
                  ],
                  evaluationAmount: 3_699_400,
                  name: "いちよし証券(株)",
                  pnl: 0,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      categories: [
        {
          title: "信用建玉",
          sections: [
            {
              title: "一般預り",
              items: [
                {
                  accountType: "一般",
                  code: "6501",
                  detailRows: [
                    { left: { label: "建区分", value: "買建" }, right: { label: "建市場", value: "東証" } },
                    { left: { label: "新規建日", value: "24/12/20" }, right: { label: "決済期日", value: "25/06/20" } },
                    { left: { label: "数量", value: "1500" }, right: { label: "取得コスト", value: "--" } },
                    { left: { label: "参考時価", value: "3,921円" }, right: { label: "取得金額", value: "5,702,400円" } },
                  ],
                  evaluationAmount: 5_881_500,
                  name: "日立製作所",
                  pnl: 179_100,
                },
              ],
            },
          ],
        },
        {
          title: "株式/投信（代用預り）",
          sections: [
            {
              items: [
                {
                  accountType: "一般",
                  badges: ["代用預り"],
                  code: "7203",
                  detailRows: [
                    { left: { label: "数量", value: "2,000株" }, right: { label: "取得コスト", value: "2,205円" } },
                    { left: { label: "参考時価", value: "2,356円" }, right: { label: "取得金額", value: "4,410,000円" } },
                  ],
                  evaluationAmount: 4_712_000,
                  name: "トヨタ自動車",
                  pnl: 302_000,
                },
                {
                  accountType: "特定",
                  badges: ["代用預り"],
                  code: "30043",
                  detailRows: [
                    { left: { label: "数量", value: "188,763口" }, right: { label: "取得コスト", value: "13,300円" } },
                    { left: { label: "参考時価", value: "14,228円" }, right: { label: "取得金額", value: "2,510,000円" } },
                  ],
                  evaluationAmount: 2_686_400,
                  name: "三井住友・グローバル・リート・オープン",
                  pnl: 176_400,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      categories: [
        {
          title: "信用建玉",
          sections: [
            {
              title: "特定預り",
              items: [
                {
                  accountType: "特定",
                  code: "6758",
                  detailRows: [
                    { left: { label: "建区分", value: "売建" }, right: { label: "建市場", value: "東証" } },
                    { left: { label: "新規建日", value: "25/01/10" }, right: { label: "決済期日", value: "25/07/10" } },
                    { left: { label: "数量", value: "600" }, right: { label: "取得コスト", value: "--" } },
                    { left: { label: "参考時価", value: "12,580円" }, right: { label: "取得金額", value: "7,620,000円" } },
                  ],
                  evaluationAmount: 7_548_000,
                  name: "ソニーグループ",
                  pnl: 72_000,
                },
              ],
            },
          ],
        },
        {
          title: "株式/投信（代用預り）",
          sections: [
            {
              items: [
                {
                  accountType: "特定",
                  badges: ["代用預り"],
                  code: "9432",
                  detailRows: [
                    { left: { label: "数量", value: "8,000株" }, right: { label: "取得コスト", value: "157円" } },
                    { left: { label: "参考時価", value: "168円" }, right: { label: "取得金額", value: "1,256,000円" } },
                  ],
                  evaluationAmount: 1_344_000,
                  name: "日本電信電話",
                  pnl: 88_000,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
