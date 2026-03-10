import { BadgeCheck, Sparkles } from "lucide-react";

import {
  ContentCard,
  HintCard,
  ScreenFrame,
  SecondaryButton,
  SectionLabel,
} from "@/features/initial-setup/components";

type DoneScreenProps = {
  onBackToTop: () => void;
};

const readyItems = ["預り資産の確認", "各種報告書照会", "トータルリターン閲覧"];

export default function DoneScreen({ onBackToTop }: DoneScreenProps) {
  return (
    <ScreenFrame title="初期設定が完了しました" stage="done">
      <div className="flex flex-1 items-center px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8">
        <div className="w-full space-y-5 xl:grid xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] xl:items-start xl:gap-5 xl:space-y-0">
          <ContentCard className="space-y-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#ba9a62_0%,#a28556_100%)] text-white shadow-[0_20px_44px_rgba(162,133,86,0.28)]">
              <BadgeCheck className="h-10 w-10" />
            </div>

            <div>
              <SectionLabel>Ready to Use</SectionLabel>
              <h2 className="mt-5 text-[28px] font-bold leading-[1.35] tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
                ご利用準備が整いました
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
                初期設定へのご協力ありがとうございます。これで サンプルオンライン のすべての機能をご利用いただけます。
              </p>
            </div>

            <div className="grid gap-3 text-left sm:grid-cols-3">
              {readyItems.map((item) => (
                <div
                  key={item}
                  className="rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-4 text-[14px] font-semibold leading-7 text-[var(--ichiyoshi-navy)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </ContentCard>

          <div className="space-y-5">
            <HintCard title="Next">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[rgba(162,133,86,0.14)] text-[var(--ichiyoshi-gold-soft)]">
                  <Sparkles className="h-5 w-5" />
                </span>
                <p>
                  TOP画面へ戻ると、同じモダンレイアウトのまま次回以降のログイン導線から利用を開始できます。
                </p>
              </div>
            </HintCard>

            <SecondaryButton type="button" onClick={onBackToTop} data-node-id="35610:73218">
              TOP画面へ
            </SecondaryButton>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}
