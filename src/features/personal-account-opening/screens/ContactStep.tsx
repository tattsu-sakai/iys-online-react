import {
  AccountOpeningShell,
  ChoiceButton,
  FieldError,
  FieldLabel,
  HintCard,
  OpeningInput,
  OpeningSection,
  PrimaryButton,
  SecondaryButton,
  SegmentInput,
} from "@/features/personal-account-opening/components";
import {
  type PersonalAccountOpeningErrors,
  type PersonalAccountOpeningFormState,
} from "@/features/personal-account-opening/model";

type ContactStepProps = {
  errors: PersonalAccountOpeningErrors;
  formState: PersonalAccountOpeningFormState;
  onBack: () => void;
  onFieldChange: <Key extends keyof PersonalAccountOpeningFormState>(
    key: Key,
    value: PersonalAccountOpeningFormState[Key]
  ) => void;
  onNext: () => void;
};

export default function ContactStep({
  errors,
  formState,
  onBack,
  onFieldChange,
  onNext,
}: ContactStepProps) {
  const mobilePhoneKeys: Array<'mobilePhone1' | 'mobilePhone2' | 'mobilePhone3'> = [
    'mobilePhone1',
    'mobilePhone2',
    'mobilePhone3',
  ];
  const homePhoneKeys: Array<'homePhone1' | 'homePhone2' | 'homePhone3'> = [
    'homePhone1',
    'homePhone2',
    'homePhone3',
  ];

  return (
    <AccountOpeningShell
      description="電話番号とメールアドレスを登録します。連絡先情報は、会員登録確認用 URL の送信にも使用されます。"
      step="contact"
      title="電話番号・メールアドレス入力"
      aside={
        <HintCard title="Notice">
          <p>
            メールアドレスをお持ちでない場合の分岐は後続対応予定です。現時点では URL 送信用のメールアドレス登録が必要です。
          </p>
        </HintCard>
      }
    >
      <div className="space-y-5">
        <OpeningSection title="電話番号">
          <p className="text-[15px] leading-8 text-[#b61704]">
            携帯電話番号、自宅電話番号をどちらか、または両方を入力してください。
          </p>

          <SegmentInput
            error={errors.mobilePhone}
            label="携帯電話番号"
            placeholders={["例：090", "9876", "5432"]}
            values={[
              formState.mobilePhone1,
              formState.mobilePhone2,
              formState.mobilePhone3,
            ]}
            onChange={(index, value) => {
              const key = mobilePhoneKeys[index] ?? 'mobilePhone1';
              const maxLength = index === 0 ? 4 : 4;
              onFieldChange(key, value.slice(0, maxLength));
            }}
          />

          <SegmentInput
            error={errors.homePhone}
            label="自宅電話番号"
            placeholders={["例：0120", "123", "456"]}
            values={[formState.homePhone1, formState.homePhone2, formState.homePhone3]}
            onChange={(index, value) => {
              const key = homePhoneKeys[index] ?? 'homePhone1';
              onFieldChange(key, value);
            }}
          />
        </OpeningSection>

        <OpeningSection title="メールアドレス">
          <div className="grid gap-3 sm:grid-cols-2">
            <ChoiceButton
              active={formState.emailOption === "hasEmail"}
              onClick={() => onFieldChange("emailOption", "hasEmail")}
            >
              メールアドレスを持っている
            </ChoiceButton>
            <ChoiceButton
              active={formState.emailOption === "noEmail"}
              onClick={() => onFieldChange("emailOption", "noEmail")}
            >
              メールアドレスを持っていない
            </ChoiceButton>
          </div>

          {formState.emailOption === "hasEmail" ? (
            <div className="grid gap-4">
              <label className="space-y-2">
                <FieldLabel>メールアドレス</FieldLabel>
                <OpeningInput
                  error={errors.email}
                  type="email"
                  placeholder="abc123@mail.ne.jp"
                  value={formState.email}
                  onChange={(event) => onFieldChange("email", event.target.value)}
                />
                <FieldError>{errors.email}</FieldError>
              </label>

              <label className="space-y-2">
                <FieldLabel>メールアドレス確認</FieldLabel>
                <OpeningInput
                  error={errors.confirmEmail}
                  type="email"
                  placeholder="abc123@mail.ne.jp"
                  value={formState.confirmEmail}
                  onChange={(event) => onFieldChange("confirmEmail", event.target.value)}
                />
                <FieldError>{errors.confirmEmail}</FieldError>
              </label>
            </div>
          ) : (
            <div className="rounded-[16px] border border-[rgba(182,23,4,0.18)] bg-[#fff5f4] px-4 py-4 text-[14px] leading-7 text-[#8b2c21]">
              この分岐は後続実装予定です。現状は「メールアドレスを持っている」を選択して進めてください。
            </div>
          )}
        </OpeningSection>

        <div className="grid gap-3 sm:grid-cols-2">
          <SecondaryButton type="button" onClick={onBack}>
            1つ前へ戻る
          </SecondaryButton>
          <PrimaryButton type="button" onClick={onNext}>
            次へ
          </PrimaryButton>
        </div>
      </div>
    </AccountOpeningShell>
  );
}
