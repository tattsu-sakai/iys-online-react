import {
  AccountOpeningShell,
  ChoiceButton,
  FieldError,
  FieldLabel,
  HintCard,
  OpeningInput,
  OpeningSection,
  OpeningSelect,
  PrimaryButton,
  SecondaryButton,
} from "@/features/personal-account-opening/components";
import {
  birthDayOptions,
  birthMonthOptions,
  birthYearOptions,
  type PersonalAccountOpeningErrors,
  type PersonalAccountOpeningFormState,
} from "@/features/personal-account-opening/model";

type IdentityStepProps = {
  errors: PersonalAccountOpeningErrors;
  formState: PersonalAccountOpeningFormState;
  onBack: () => void;
  onFieldChange: <Key extends keyof PersonalAccountOpeningFormState>(
    key: Key,
    value: PersonalAccountOpeningFormState[Key]
  ) => void;
  onNext: () => void;
};

export default function IdentityStep({
  errors,
  formState,
  onBack,
  onFieldChange,
  onNext,
}: IdentityStepProps) {
  return (
    <AccountOpeningShell
      description="氏名、生年月日、性別を入力して、ご本人確認の基本情報を登録します。"
      step="identity"
      title="氏名・生年月日・性別入力"
      aside={
        <HintCard title="Input Guide">
          <p>旧字体等は常用漢字へ置き換えて入力してください。カナは全角カタカナでの入力を想定しています。</p>
        </HintCard>
      }
    >
      <div className="space-y-5">
        <OpeningSection title="氏名（漢字）">
          <p className="text-[15px] leading-8 text-[var(--ichiyoshi-ink-soft)]">
            旧字体等については常用漢字に替えてご入力ください。
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <FieldLabel>姓</FieldLabel>
              <OpeningInput
                error={errors.lastNameKanji}
                placeholder="例：一吉"
                value={formState.lastNameKanji}
                onChange={(event) => onFieldChange("lastNameKanji", event.target.value)}
              />
              <FieldError>{errors.lastNameKanji}</FieldError>
            </label>
            <label className="space-y-2">
              <FieldLabel>名</FieldLabel>
              <OpeningInput
                error={errors.firstNameKanji}
                placeholder="例：太郎"
                value={formState.firstNameKanji}
                onChange={(event) => onFieldChange("firstNameKanji", event.target.value)}
              />
              <FieldError>{errors.firstNameKanji}</FieldError>
            </label>
          </div>
        </OpeningSection>

        <OpeningSection title="氏名（カナ）">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <FieldLabel>セイ</FieldLabel>
              <OpeningInput
                error={errors.lastNameKana}
                placeholder="例：イチヨシ"
                value={formState.lastNameKana}
                onChange={(event) => onFieldChange("lastNameKana", event.target.value)}
              />
              <FieldError>{errors.lastNameKana}</FieldError>
            </label>
            <label className="space-y-2">
              <FieldLabel>メイ</FieldLabel>
              <OpeningInput
                error={errors.firstNameKana}
                placeholder="例：タロウ"
                value={formState.firstNameKana}
                onChange={(event) => onFieldChange("firstNameKana", event.target.value)}
              />
              <FieldError>{errors.firstNameKana}</FieldError>
            </label>
          </div>
        </OpeningSection>

        <OpeningSection title="生年月日">
          <div className="space-y-4">
            <label className="space-y-2">
              <FieldLabel>年</FieldLabel>
              <OpeningSelect
                error={errors.birthDate}
                value={formState.birthYear}
                onChange={(event) => onFieldChange("birthYear", event.target.value)}
              >
                <option value="">年を選択</option>
                {birthYearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                ))}
              </OpeningSelect>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <FieldLabel>月</FieldLabel>
                <OpeningSelect
                  error={errors.birthDate}
                  value={formState.birthMonth}
                  onChange={(event) => onFieldChange("birthMonth", event.target.value)}
                >
                  <option value="">月を選択</option>
                  {birthMonthOptions.map((month) => (
                    <option key={month} value={month}>
                      {month}月
                    </option>
                  ))}
                </OpeningSelect>
              </label>

              <label className="space-y-2">
                <FieldLabel>日</FieldLabel>
                <OpeningSelect
                  error={errors.birthDate}
                  value={formState.birthDay}
                  onChange={(event) => onFieldChange("birthDay", event.target.value)}
                >
                  <option value="">日を選択</option>
                  {birthDayOptions.map((day) => (
                    <option key={day} value={day}>
                      {day}日
                    </option>
                  ))}
                </OpeningSelect>
              </label>
            </div>
            <FieldError>{errors.birthDate}</FieldError>
          </div>
        </OpeningSection>

        <OpeningSection title="性別">
          <div className="grid gap-3 sm:grid-cols-2">
            <ChoiceButton
              active={formState.gender === "male"}
              onClick={() => onFieldChange("gender", "male")}
            >
              男性
            </ChoiceButton>
            <ChoiceButton
              active={formState.gender === "female"}
              onClick={() => onFieldChange("gender", "female")}
            >
              女性
            </ChoiceButton>
          </div>
          <FieldError>{errors.gender}</FieldError>
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
