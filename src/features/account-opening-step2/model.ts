export type ResidencyCountry = "japan" | "other";

export type Step2AddressState = {
  addressDetail: string;
  buildingKana: string;
  buildingName: string;
  hasDifferentResidentPrefecture: boolean;
  postalCode: string;
  residentPrefecture: string;
  residencyCountry: ResidencyCountry;
  selectedTown: string;
};

export const defaultStep2AddressState: Step2AddressState = {
  addressDetail: "",
  buildingKana: "",
  buildingName: "",
  hasDifferentResidentPrefecture: false,
  postalCode: "",
  residentPrefecture: "",
  residencyCountry: "japan",
  selectedTown: "",
};

export const addressGuidance = [
  "ご提出いただく本人確認書類の記載通りに住所をご入力ください。",
  "※字・大字や地割の記載・入力有無につきましては、省略して登録させていただく場合がございます。",
] as const;

export const residentPrefectureNotice =
  "届出住所と本年1月1日現在の住民票記載の都道府県が異なる場合には、チェックのうえ、都道府県を選択してください。";

export const residencyNotice = [
  "私は「租税条約等の実施に伴う所得税法、法人税法及び地方税法の特例等に関する法律」第10条の5第1項前段の規定に基づき同条第8項第1号に規定する報告金融機関等である貴社に対して特定取引を行う者の届出書を提出します。",
  "※居住地国に変更があった場合は、変更日から3か月以内に異動届出書により申告が必要です。",
] as const;

export const townOptions = [
  "宇田川町1",
  "宇田川町2",
  "宇田川町3",
  "宇田川町4",
  "宇田川町5",
  "宇田川町6",
  "宇田川町7",
  "宇田川町8",
  "宇田川町9",
  "宇田川町10",
  "宇田川町11",
  "宇田川町12",
  "宇田川町13",
  "宇田川町14",
] as const;

export const prefectureOptions = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
] as const;

export function formatPostalCodeInput(value: string) {
  return value.replace(/\D/g, "").slice(0, 7);
}

export function canSearchTown(postalCode: string) {
  return formatPostalCodeInput(postalCode).length === 7;
}
