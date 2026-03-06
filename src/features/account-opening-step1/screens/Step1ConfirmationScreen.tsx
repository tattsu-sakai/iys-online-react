import {
  BodyText,
  ConfirmationRow,
  ContentCard,
  Step1Shell,
  StepActionRow,
} from "@/features/account-opening-step1/components";
import {
  confirmationIntro,
  step1Documents,
} from "@/features/account-opening-step1/model";

type Step1ConfirmationScreenProps = {
  onBack: () => void;
  onProceedToStep2: () => void;
  screenIndex: number;
};

export default function Step1ConfirmationScreen({
  onBack,
  onProceedToStep2,
  screenIndex,
}: Step1ConfirmationScreenProps) {
  return (
    <Step1Shell
      description="確認した交付書面を一覧で見直し、問題なければ次の STEP に進む状態にします。"
      eyebrow="Personal Account Opening"
      nodeId="32374:76868"
      screenIndex={screenIndex}
      showOverallProgress
      title="交付書面の確認内容"
    >
      <div className="space-y-5">
        <ContentCard className="space-y-5" data-node-id="32374:76868">
          <BodyText>{confirmationIntro}</BodyText>

          <div className="grid gap-4">
            {step1Documents.map((document) => (
              <ConfirmationRow
                key={document.key}
                label={document.title}
                value={document.confirmText}
              />
            ))}
          </div>
        </ContentCard>

        <ContentCard className="space-y-3 bg-[rgba(5,32,49,0.03)]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--ichiyoshi-gold-soft)]">
            Next Step
          </p>
          <BodyText className="text-[14px]">
            続けて STEP2 の住所等入力へ進みます。まずは住所入力画面から入力を開始してください。
          </BodyText>
        </ContentCard>

        <StepActionRow
          onPrimary={onProceedToStep2}
          onSecondary={onBack}
          primaryLabel="Step2に進む"
          secondaryLabel="1つ前へ戻る"
        />
      </div>
    </Step1Shell>
  );
}
