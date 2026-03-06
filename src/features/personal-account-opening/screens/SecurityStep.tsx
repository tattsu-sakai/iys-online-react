import { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";

import {
  AccountOpeningShell,
  FieldError,
  FieldLabel,
  HintCard,
  OpeningInput,
  OpeningSection,
  PrimaryButton,
  SecondaryButton,
} from "@/features/personal-account-opening/components";
import {
  type PersonalAccountOpeningErrors,
  type PersonalAccountOpeningFormState,
} from "@/features/personal-account-opening/model";

const passwordRules = [
  "8文字以上16文字以内",
  "数字/英大文字/英小文字/記号から2種類以上使用",
];

type SecurityStepProps = {
  errors: PersonalAccountOpeningErrors;
  formState: PersonalAccountOpeningFormState;
  onBack: () => void;
  onFieldChange: <Key extends keyof PersonalAccountOpeningFormState>(
    key: Key,
    value: PersonalAccountOpeningFormState[Key]
  ) => void;
  onNext: () => void;
};

export default function SecurityStep({
  errors,
  formState,
  onBack,
  onFieldChange,
  onNext,
}: SecurityStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AccountOpeningShell
      description="URL 送信前に、会員登録に必要なパスワードを設定します。確認メールでもこの連絡先を参照します。"
      step="security"
      title="パスワード設定"
      aside={
        <HintCard title="Send To">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(162,133,86,0.14)] text-[var(--ichiyoshi-gold-soft)] shadow-[0_10px_24px_rgba(162,133,86,0.14)]">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-[var(--ichiyoshi-navy)]">送信先メールアドレス</p>
              <p className="mt-1 break-all">{formState.email || "未入力"}</p>
            </div>
          </div>
        </HintCard>
      }
    >
      <div className="space-y-5">
        <OpeningSection title="パスワード">
          <div className="rounded-[16px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-4">
            <p className="text-[14px] font-semibold tracking-[0.08em] text-[var(--ichiyoshi-navy)]">
              パスワード条件
            </p>
            <ul className="mt-3 space-y-2 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
              {passwordRules.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--ichiyoshi-gold-soft)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <label className="space-y-2">
            <FieldLabel>パスワード</FieldLabel>
            <div className="relative">
              <OpeningInput
                error={errors.password}
                type={showPassword ? "text" : "password"}
                placeholder="パスワードを入力"
                value={formState.password}
                onChange={(event) => onFieldChange("password", event.target.value)}
                className="pr-12"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 flex items-center text-[var(--ichiyoshi-ink-soft)]"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示する"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <FieldError>{errors.password}</FieldError>
          </label>

          <label className="space-y-2">
            <FieldLabel>パスワード確認</FieldLabel>
            <div className="relative">
              <OpeningInput
                error={errors.confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="パスワードを入力"
                value={formState.confirmPassword}
                onChange={(event) => onFieldChange("confirmPassword", event.target.value)}
                className="pr-12"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-4 flex items-center text-[var(--ichiyoshi-ink-soft)]"
                onClick={() => setShowConfirmPassword((current) => !current)}
                aria-label={
                  showConfirmPassword ? "確認用パスワードを隠す" : "確認用パスワードを表示する"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError>{errors.confirmPassword}</FieldError>
          </label>
        </OpeningSection>

        <div className="grid gap-3 sm:grid-cols-2">
          <SecondaryButton type="button" onClick={onBack}>
            1つ前へ戻る
          </SecondaryButton>
          <PrimaryButton type="button" onClick={onNext}>
            送信する
          </PrimaryButton>
        </div>
      </div>
    </AccountOpeningShell>
  );
}
