export type Step1DocumentKey =
  | "terms"
  | "businessInfo"
  | "preContract"
  | "riskFee"
  | "mrf";

export type Step1Screen =
  | "intro"
  | "electronic-delivery"
  | "documents-review"
  | "confirmation";

export type Step1State = {
  electronicDeliveryAgreed: boolean;
  reviewedDocuments: Record<Step1DocumentKey, boolean>;
};

export type Step1Document = {
  confirmText: string;
  description: string;
  helperLinkLabel?: string;
  key: Step1DocumentKey;
  nodeId: string;
  previewAlt: string;
  previewSrc: string;
  title: string;
};

export const step1ScreenOrder: Step1Screen[] = [
  "intro",
  "electronic-delivery",
  "documents-review",
  "confirmation",
];

export const defaultStep1State: Step1State = {
  electronicDeliveryAgreed: false,
  reviewedDocuments: {
    businessInfo: false,
    mrf: false,
    preContract: false,
    riskFee: false,
    terms: false,
  },
};

export const completedStep1State: Step1State = {
  electronicDeliveryAgreed: true,
  reviewedDocuments: {
    businessInfo: true,
    mrf: true,
    preContract: true,
    riskFee: true,
    terms: true,
  },
};

export const overallOpeningSteps = [
  { label: "Step1", text: "交付書面の確認" },
  { label: "Step2", text: "お客様基本情報の入力（住所等）" },
  { label: "Step3", text: "その他お客様情報の入力（投資方針等）" },
  { label: "Step4", text: "本人確認書類等の撮影" },
  { label: "Step5", text: "各種サービス等申込み" },
] as const;

export const introDocumentTitle = "証券総合サービス申込書";

export const introDocumentNames = [
  "兼 保護預り口座設定申込書　兼 野村MRF自動けいぞく投資取引申込書　兼 外国証券取引口座設定申込書　兼 野村自動スイープ申込書　兼 総合取引申込書　兼 累積投資取引申込書　兼 振替決済口座開設申込書　兼 サンプルメンバーズクラブ申込書　兼 株式配当金振込指定書　兼 内部者届出書",
  "兼 特定取引を行う者の届出書",
] as const;

export const taxLawTitle = "税法条文";

export const taxLawParagraphs = [
  "●税法上の告知",
  "所得税法第224条第1項及び第2項、同法第224条の3第1項、第3項及び第4項、同法第224条の5の規定により、告知します。",
  "租税特別措置法施行令第2条の2第12項、同令第4条第9項、同令第4条の5第9項及び同令第4条の6の2第24項の規定により、告知します。",
  "●上場株式等の配当・公社債の利子・投資信託の収益の分配・国外発行株式等の配当・国外公社債等の利子・国外投資信託等の配当の告知、株式等の譲渡の対価の受領者の告知、配当等とみなす金額の交付の告知、償還金等の交付の告知に係る申請書",
  "私は、所得税法施行令第337条第5項及び同令第339条第9項、租税特別措置法施行令第2条の2第12項、同令第4条第9項、同令第4条の5第9項及び同令第4条の6の2第24項、所得税法施行令第343条第5項、同令第345条第6項、同令第346条第6項の規定の適用を受けたいので、この旨申請します。",
  "●先物取引の差金等決済をする者の告知に係る申請書",
  "私は、所得税法施行令第350条の4の規定の適用を受けたいので、この旨申請します。",
] as const;

export const applicationStatement = [
  "サンプル証券御中",
  "私は、以降に入力する内容で、「サンプルの証券総合サービス約款・規程集」・「野村MRFの目論見書」に基づき、総合取引、証券総合サービスの利用、外国証券取引口座の設定を申込みます。",
] as const;

export const electronicDeliveryDocuments = [
  "サンプルの証券総合サービス約款 取扱規定",
  "重要情報シート（事業者編）",
  "契約締結前交付書面集",
  "リスク・手数料等説明ページのご案内",
  "野村MRF目論見書",
] as const;

const previewBasePath = "/account-opening-step1";

export const step1Documents: Step1Document[] = [
  {
    key: "terms",
    nodeId: "32374:77307",
    title: "サンプルの証券総合サービス約款 取扱規程",
    description:
      "当社との契約内容に加え、サンプルメンバーズクラブ、書面交付、勧誘方針、個人情報の取扱い、最良執行方針などが記載されています。",
    previewAlt: "サンプルの証券総合サービス約款 取扱規程のプレビュー",
    previewSrc: `${previewBasePath}/terms-preview.png`,
    confirmText:
      "「サンプルの証券総合サービス約款 取扱規程」を確認しました",
  },
  {
    key: "businessInfo",
    nodeId: "32374:75502",
    title: "重要情報シート（事業者編）",
    description:
      "当社の基本情報、取扱商品、商品ラインナップの考え方等が記載された重要情報シートです。",
    previewAlt: "重要情報シート（事業者編）のプレビュー",
    previewSrc: `${previewBasePath}/business-info-preview.png`,
    confirmText: "「重要情報シート（事業者編）」を確認しました",
  },
  {
    key: "preContract",
    nodeId: "32374:74597",
    title: "契約締結前交付書面集",
    description:
      "お取引に関するリスクや手数料等の費用など、事前に確認が必要な重要情報が記載されています。",
    previewAlt: "契約締結前交付書面集のプレビュー",
    previewSrc: `${previewBasePath}/pre-contract-preview.png`,
    confirmText: "「契約締結前書面集」を確認しました",
  },
  {
    key: "riskFee",
    nodeId: "32374:74582",
    title: "リスク・手数料等説明ページのご案内",
    description:
      "当社ホームページに掲載している「リスク・手数料等説明ページ」への案内書面です。",
    previewAlt: "リスク・手数料等説明ページのご案内のプレビュー",
    previewSrc: `${previewBasePath}/risk-fee-preview.png`,
    confirmText: "「リスク・手数料等説明ページのご案内」を確認しました",
  },
  {
    key: "mrf",
    nodeId: "32374:74611",
    title: "野村MRF目論見書",
    description:
      "野村MRF の仕組みや商品性について記載された目論見書です。追加の案内リンクもあわせて確認できます。",
    helperLinkLabel: "（野村MRFについてはこちら）",
    previewAlt: "野村MRF目論見書のプレビュー",
    previewSrc: `${previewBasePath}/mrf-preview.png`,
    confirmText: "「野村MRF目論見書」を確認しました",
  },
] as const;

export const confirmationIntro =
  "この内容でよろしければ、「Step2へ進む」ボタンを押してください。";

export const allStep1DocumentsReviewed = (
  reviewedDocuments: Record<Step1DocumentKey, boolean>
) => step1Documents.every((document) => reviewedDocuments[document.key]);
