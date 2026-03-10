export type PersonalAccountOpeningStep =
  | "welcome"
  | "identity"
  | "contact"
  | "security"
  | "sent";

export type PersonalAccountOpeningFormState = {
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  confirmEmail: string;
  confirmPassword: string;
  email: string;
  emailOption: "hasEmail" | "noEmail";
  firstNameKana: string;
  firstNameKanji: string;
  gender: "male" | "female" | "";
  homePhone1: string;
  homePhone2: string;
  homePhone3: string;
  lastNameKana: string;
  lastNameKanji: string;
  mobilePhone1: string;
  mobilePhone2: string;
  mobilePhone3: string;
  password: string;
};

export type PersonalAccountOpeningField =
  | keyof PersonalAccountOpeningFormState
  | "birthDate"
  | "homePhone"
  | "mobilePhone";

export type PersonalAccountOpeningErrors = Partial<
  Record<PersonalAccountOpeningField, string>
>;

export const defaultPersonalAccountOpeningFormState: PersonalAccountOpeningFormState =
  {
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    confirmEmail: "",
    confirmPassword: "",
    email: "",
    emailOption: "hasEmail",
    firstNameKana: "",
    firstNameKanji: "",
    gender: "",
    homePhone1: "",
    homePhone2: "",
    homePhone3: "",
    lastNameKana: "",
    lastNameKanji: "",
    mobilePhone1: "",
    mobilePhone2: "",
    mobilePhone3: "",
    password: "",
  };

export const openingSteps: Array<{
  description: string;
  key: PersonalAccountOpeningStep;
  label: string;
}> = [
  {
    key: "welcome",
    label: "ご案内",
    description: "会員登録の前提と利用イメージを確認します。",
  },
  {
    key: "identity",
    label: "基本情報",
    description: "氏名・生年月日・性別を入力します。",
  },
  {
    key: "contact",
    label: "連絡先",
    description: "電話番号とメールアドレスを登録します。",
  },
  {
    key: "security",
    label: "認証設定",
    description: "利用開始に必要なパスワードを設定します。",
  },
  {
    key: "sent",
    label: "送信完了",
    description: "会員登録用 URL の送信完了を確認します。",
  },
];

const currentYear = new Date().getFullYear();

export const birthYearOptions = Array.from(
  { length: currentYear - 1940 - 17 },
  (_, index) => String(currentYear - 18 - index)
);

export const birthMonthOptions = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0")
);

export const birthDayOptions = Array.from({ length: 31 }, (_, index) =>
  String(index + 1).padStart(2, "0")
);

export const isEmailValid = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isKanaValid = (value: string) =>
  /^[ァ-ヶー\s\u3000]+$/.test(value.trim());

const countPasswordCategories = (value: string) => {
  const categories = [
    /[A-Z]/.test(value),
    /[a-z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ];

  return categories.filter(Boolean).length;
};

export const isPasswordValid = (value: string) =>
  value.length >= 8 && value.length <= 16 && countPasswordCategories(value) >= 2;

export const isPhoneComplete = (...segments: string[]) =>
  segments.every((segment) => segment.trim().length > 0);
