export const customerInfoActions = [
  {
    description: "氏名の変更や、旧字・常用漢字の変更が可能です。",
    key: "name",
    title: "氏名変更",
  },
  {
    description: "住所の変更が可能です。",
    key: "address",
    title: "住所変更",
  },
  {
    description:
      "弊社からお振込させていただく際の金融機関の変更が可能です。",
    key: "bank",
    title: "振込先等変更",
  },
  {
    description:
      "特定口座の開設・廃止、源泉徴収区分の変更等が可能です。",
    key: "specified-account",
    title: "特定口座変更",
  },
  {
    description:
      "電話番号や勤務先情報、ご投資方針等の変更が可能です。",
    key: "other",
    title: "その他お客様情報の変更",
  },
] as const;
