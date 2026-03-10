import {
  AccountOpeningShell,
  ContentCard,
  HintCard,
  OpeningSection,
  PrimaryButton,
  SecondaryButton,
} from "@/features/personal-account-opening/components";

const introParagraphs = [
  "当社は社員一同、「今までの日本にない証券会社をつくろう」を合言葉に、お客様本位の資産運用を実現すべく歩んできました。",
  "会員登録の導線では、必要事項の入力と連絡先登録を行い、確認用メールの送信までをオンラインで進められます。",
];

const serviceItems = [
  "メンバーズクラブ・電子交付サービス",
  "NISA口座（開設）",
  "スマート振替サービス",
  "ドリームコレクション",
  "各種るいとう",
  "定時振替",
  "i-box",
  "お客様情報の変更",
];

type WelcomeStepProps = {
  onBack: () => void;
  onNext: () => void;
};

export default function WelcomeStep({ onBack, onNext }: WelcomeStepProps) {
  return (
    <AccountOpeningShell
      description="会員登録に必要な入力項目と、オンライン申込みの流れを最初に確認します。"
      step="welcome"
      title="ごあいさつ"
      aside={
        <HintCard title="Overview">
          <p>
            口座名義人ご本人であることを確認するため、氏名や連絡先の入力、本人確認に必要な情報登録を順番に行います。
          </p>
        </HintCard>
      }
    >
      <div className="space-y-5">
        <ContentCard className="space-y-5">
          {introParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-[15px] leading-8 tracking-[0.02em] text-[var(--ichiyoshi-ink-soft)]"
            >
              {paragraph}
            </p>
          ))}
        </ContentCard>

        <OpeningSection title="サンプルオンラインとは">
          <p className="text-[15px] leading-8 text-[var(--ichiyoshi-ink-soft)]">
            各種申込みや口座関連のお手続きを、オンラインでまとめて進められるサービスです。
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {serviceItems.map((item) => (
              <div
                key={item}
                className="rounded-[16px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-4 text-[14px] font-semibold leading-7 text-[var(--ichiyoshi-navy)]"
              >
                {item}
              </div>
            ))}
          </div>
        </OpeningSection>

        <OpeningSection title="会員登録にあたり">
          <p className="text-[15px] leading-8 text-[var(--ichiyoshi-ink-soft)]">
            ご本人様であることを確認するため、氏名等の入力や、ご登録情報の確認が必要となります。
          </p>
        </OpeningSection>

        <div className="grid gap-3 sm:grid-cols-2">
          <SecondaryButton type="button" onClick={onBack}>
            ログインへ戻る
          </SecondaryButton>
          <PrimaryButton type="button" onClick={onNext} data-node-id="32374:74370">
            次へ
          </PrimaryButton>
        </div>
      </div>
    </AccountOpeningShell>
  );
}
