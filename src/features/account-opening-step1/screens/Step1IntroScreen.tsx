import {
  BodyText,
  BulletList,
  ContentCard,
  ScrollTextCard,
  Step1Section,
  Step1Shell,
  StepActionRow,
} from "@/features/account-opening-step1/components";
import {
  applicationStatement,
  introDocumentNames,
  introDocumentTitle,
  overallOpeningSteps,
  taxLawParagraphs,
  taxLawTitle,
} from "@/features/account-opening-step1/model";

type Step1IntroScreenProps = {
  onBackToTop: () => void;
  onNext: () => void;
  screenIndex: number;
};

export default function Step1IntroScreen({
  onBackToTop,
  onNext,
  screenIndex,
}: Step1IntroScreenProps) {
  return (
    <Step1Shell
      description="申込対象となる書面の範囲と税法条文、STEP1 全体の流れを確認してから交付書面確認へ進みます。"
      eyebrow="Personal Account Opening"
      nodeId="32374:75530"
      screenIndex={screenIndex}
      title="口座開設"
    >
      <div className="space-y-5">
        <Step1Section nodeId="32374:75530" title={introDocumentTitle}>
          <BulletList items={introDocumentNames} />

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <div className="space-y-3">
              <p className="text-[16px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
                {taxLawTitle}
              </p>
              <ScrollTextCard items={taxLawParagraphs} />
            </div>

            <ContentCard className="space-y-3 bg-[rgba(5,32,49,0.03)] p-5">
              <p className="text-[16px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
                {applicationStatement[0]}
              </p>
              <BodyText className="text-[14px]">
                {applicationStatement[1]}
              </BodyText>
            </ContentCard>
          </div>
        </Step1Section>

        <Step1Section title="口座開設手続きの流れ">
          <BodyText>
            口座開設は以下のステップに沿って手続きを行っていただきます。
          </BodyText>
          <div className="grid gap-3">
            {overallOpeningSteps.map((step) => (
              <div
                key={step.label}
                className="flex items-start gap-4 rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-white px-4 py-4"
              >
                <span className="inline-flex min-w-16 items-center justify-center rounded-full bg-[rgba(111,91,59,0.12)] px-3 py-2 text-[13px] font-bold tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)]">
                  {step.label}
                </span>
                <p className="text-[15px] leading-7 tracking-[0.02em] text-[var(--ichiyoshi-navy)]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </Step1Section>

        <StepActionRow
          onPrimary={onNext}
          onSecondary={onBackToTop}
          primaryLabel="Step1へ進む"
          secondaryLabel="TOPへ戻る"
        />
      </div>
    </Step1Shell>
  );
}
