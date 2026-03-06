import {
  AgreementCard,
  BodyText,
  BulletList,
  ContentCard,
  Step1Section,
  Step1Shell,
  StepActionRow,
} from "@/features/account-opening-step1/components";
import { electronicDeliveryDocuments } from "@/features/account-opening-step1/model";

type Step1ElectronicDeliveryScreenProps = {
  agreed: boolean;
  onBack: () => void;
  onNext: () => void;
  onToggleAgreement: () => void;
  screenIndex: number;
};

export default function Step1ElectronicDeliveryScreen({
  agreed,
  onBack,
  onNext,
  onToggleAgreement,
  screenIndex,
}: Step1ElectronicDeliveryScreenProps) {
  return (
    <Step1Shell
      description="口座開設にあたり電子交付する書面を確認し、同意が取れたら次の書面確認へ進みます。"
      eyebrow="Personal Account Opening"
      nodeId="32374:74522"
      screenIndex={screenIndex}
      title="交付書面の確認"
    >
      <div className="space-y-5">
        <Step1Section nodeId="32374:74522" title="交付書面の確認">
          <BodyText>
            口座開設にあたり、以下の書面を電子交付させていただきます。
          </BodyText>
          <BulletList items={electronicDeliveryDocuments} />
          <BodyText>
            書面を電子交付させていただくことにご同意いただける場合は、チェックをつけて次へお進みください。
          </BodyText>
          <AgreementCard
            checked={agreed}
            label="書面の電子的交付に同意します"
            onToggle={onToggleAgreement}
          />
        </Step1Section>

        <ContentCard className="space-y-3 bg-[rgba(5,32,49,0.03)]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--ichiyoshi-gold-soft)]">
            Completion Rule
          </p>
          <BodyText className="text-[14px]">
            電子交付への同意をチェックすると「次へ」ボタンが有効になります。
          </BodyText>
        </ContentCard>

        <StepActionRow
          onPrimary={onNext}
          onSecondary={onBack}
          primaryDisabled={!agreed}
          primaryLabel="次へ"
          secondaryLabel="1つ前へ戻る"
        />
      </div>
    </Step1Shell>
  );
}
