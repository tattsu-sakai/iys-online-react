import { Check } from "lucide-react";

import {
  ContentCard,
  HintCard,
  PrimaryButton,
  ScreenFrame,
  SecondaryButton,
  SectionLabel,
} from "@/features/initial-setup/components";

const serviceItems = [
  "預り資産",
  "トータルリターン",
  "譲渡益履歴",
  "配当等の履歴",
  "各種報告書照会",
];

const introSteps = [
  "パスワード/メールアドレス入力",
  "認証コード入力",
  "利用開始",
];

type IntroScreenProps = {
  onBack: () => void;
  onStart: () => void;
};

export default function IntroScreen({ onBack, onStart }: IntroScreenProps) {
  return (
    <ScreenFrame title="法人のお客様向けご案内" stage="intro">
      <div className="flex-1 px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8">
        <div className="space-y-5 xl:grid xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start xl:gap-5 xl:space-y-0">
          <div className="space-y-5">
            <ContentCard className="space-y-6">
              <div className="space-y-4">
                <SectionLabel>法人のお客様向け</SectionLabel>
                <div className="space-y-3 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
                  <p>
                    法人のお客様向けのご案内ページです。初期設定時のログインは個人のお客様と同じログイン画面をご利用いただき、その後の利用開始手順や確認事項をこちらでご案内します。
                  </p>
                  <p>
                    ご利用開始に向けた初期設定は数分で完了し、そのまま日々の確認業務に移行できます。
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {serviceItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.02)] px-4 py-4 text-[15px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </ContentCard>

            <HintCard title="Ready">
              <div className="flex items-start gap-3">
                <span className="mt-1 text-[var(--ichiyoshi-gold-soft)]">
                  <Check className="h-5 w-5" />
                </span>
                <p>
                  法人のお客様も、共通ログイン画面で初期設定を進めることで、預り資産やトータルリターン、各種報告書照会などにすぐアクセスできます。
                </p>
              </div>
            </HintCard>
          </div>

          <div className="space-y-5">
            <ContentCard className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <SectionLabel>ご利用開始までの流れ</SectionLabel>
                  <p className="mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
                    法人のお客様にも安全にご利用いただくため、以下の 3 ステップで初期設定を行います。
                  </p>
                </div>
                <span className="inline-flex shrink-0 self-start items-center justify-center rounded-full bg-[rgba(162,133,86,0.12)] px-3 py-1 text-[12px] font-semibold leading-none tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)] whitespace-nowrap">
                  約1〜3分
                </span>
              </div>

              <div className="space-y-4">
                {introSteps.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 border-b border-[rgba(5,32,49,0.08)] pb-4 last:border-b-0 last:pb-0"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(162,133,86,0.14)] text-sm font-bold text-[var(--ichiyoshi-gold-soft)]">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
                        Step{index + 1}
                      </p>
                      <p className="mt-1 text-[15px] font-semibold leading-7 tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
                        {item}
                      </p>
                      <p className="text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
                        {index === 0 && "ログイン情報を更新し、認証に必要な連絡先を登録します。"}
                        {index === 1 && "メールで届くコードを入力し、設定内容を安全に確定します。"}
                        {index === 2 && "すべてのオンライン機能をそのまま利用開始できます。"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ContentCard>

            <div className="grid gap-3 sm:grid-cols-2">
              <SecondaryButton type="button" onClick={onBack}>
                ログインへ戻る
              </SecondaryButton>
              <PrimaryButton type="button" onClick={onStart} data-node-id="35606:62175">
                初期設定を開始する
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}
