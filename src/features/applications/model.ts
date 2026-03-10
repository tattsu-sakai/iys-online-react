export const applicationActions = [
  {
    ctaLabel: 'NISA口座申込み',
    description: 'NISA口座の新規開設・再開設申込が可能です。',
    key: 'nisa',
    title: 'NISA',
  },
  {
    ctaLabel: 'サンプル振替サービス申込み',
    description:
      'サンプル振替サービスの申込みが可能です。サンプル振替サービスとは、あらかじめ、お客様のお取引金融機関口座をご登録いただくことで、当社へお電話等による振替ご指示により、簡単・即時にお客様の当社証券総合口座にご資金を振替入金いただくことができるサービスです。',
    key: 'smart-transfer',
    title: 'サンプル振替サービス',
  },
  {
    ctaLabel: 'ヒアリングシート回答',
    description:
      '弊社のサービスであるラップのお申込みにあたり、お客様のお一人おひとりに投資意向やリスク許容度等をお尋ねする「ヒアリングシート」にご回答いただきます。',
    key: 'dream-collection',
    title: 'ラップ（ヒアリングシート）',
  },
  {
    ctaLabel: 'るいとう申込み',
    description: 'ご指定の株式や投資信託を、毎月一定の金額で自動的に買付けることができるサービスです。',
    key: 'ruitou',
    title: 'るいとう',
  },
  {
    ctaLabel: '定時振替申込み',
    description: 'サンプル振替サービスを利用して、毎月一定の金額を当社の口座へ振込できるサービスです。',
    key: 'scheduled-transfer',
    title: '定時振替',
  },
  {
    ctaLabel: '資料送付サービス申込み',
    description: '電子メールやSMSを利用して、当社よりお客様に資料を送付するサービスです。',
    key: 'i-box',
    title: '資料送付サービス',
  },
] as const;
