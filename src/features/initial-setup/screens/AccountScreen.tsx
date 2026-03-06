import { useState } from "react";
import { Eye, EyeOff, Mail, Shield } from "lucide-react";

import {
  ContentCard,
  HintCard,
  PrimaryButton,
  ScreenFrame,
  SecondaryButton,
  SectionLabel,
  TextField,
} from "@/features/initial-setup/components";
import type { FormErrors, FormState } from "@/features/initial-setup/model";

const passwordRuleItems = [
  "8文字以上16文字以内",
  "数字/英大文字/英小文字/記号から2種類以上使用",
];

type AccountScreenProps = {
  errors: FormErrors;
  formState: FormState;
  onBack: () => void;
  onFieldChange: <Key extends keyof FormState>(
    key: Key,
    value: FormState[Key]
  ) => void;
  onSubmit: () => void;
};

export default function AccountScreen({
  errors,
  formState,
  onBack,
  onFieldChange,
  onSubmit,
}: AccountScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <ScreenFrame title="アカウント情報入力" stage="account">
      <div className="flex-1 px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8">
        <form
          className="space-y-5 xl:grid xl:grid-cols-2 xl:items-start xl:gap-5 xl:space-y-0"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <ContentCard className="space-y-6">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[var(--ichiyoshi-navy)] text-white shadow-[0_10px_24px_rgba(5,32,49,0.16)]">
                <Shield className="h-5 w-5" />
              </span>
              <div>
                <SectionLabel>パスワード設定</SectionLabel>
                <p className="mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
                  仮パスワードから新しいパスワードへ変更してください。次回以降のログインに使用します。
                </p>
              </div>
            </div>

            <div className="rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] p-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--ichiyoshi-gold-soft)]">
                Password Rules
              </p>
              <ul className="mt-3 space-y-2 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
                {passwordRuleItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--ichiyoshi-gold-soft)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <TextField
                label="新しいパスワード"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                error={errors.password}
                value={formState.password}
                onChange={(value) => onFieldChange("password", value)}
                trailing={
                  <button
                    type="button"
                    className="inline-flex items-center"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示する"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />
              <TextField
                label="新しいパスワード（確認用）"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                error={errors.confirmPassword}
                value={formState.confirmPassword}
                onChange={(value) => onFieldChange("confirmPassword", value)}
                trailing={
                  <button
                    type="button"
                    className="inline-flex items-center"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    aria-label={
                      showConfirmPassword
                        ? "確認用パスワードを隠す"
                        : "確認用パスワードを表示する"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />
            </div>
          </ContentCard>

          <ContentCard className="space-y-6">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[rgba(162,133,86,0.14)] text-[var(--ichiyoshi-gold-soft)] shadow-[0_10px_24px_rgba(162,133,86,0.14)]">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <SectionLabel>メールアドレス</SectionLabel>
                <p className="mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
                  システムからのお知らせや、パスワードをお忘れの際の本人確認に使用するメールアドレスを入力してください。
                </p>
              </div>
            </div>

            <HintCard title="Important" className="shadow-none">
              <p>
                個人のメールアドレスではなく、必ず
                <strong className="px-1 text-[var(--ichiyoshi-navy)]">
                  会社支給のメールアドレス
                </strong>
                をご入力ください。次の画面でこのアドレス宛に認証コードを送信します。
              </p>
            </HintCard>

            <div className="space-y-4">
              <TextField
                label="メールアドレス"
                type="email"
                autoCapitalize="off"
                autoComplete="email"
                inputMode="email"
                placeholder="user-input@example.com"
                error={errors.email}
                value={formState.email}
                onChange={(value) => onFieldChange("email", value)}
              />
              <TextField
                label="メールアドレス（確認用）"
                type="email"
                autoCapitalize="off"
                autoComplete="email"
                inputMode="email"
                placeholder="user-input@example.com"
                error={errors.confirmEmail}
                value={formState.confirmEmail}
                onChange={(value) => onFieldChange("confirmEmail", value)}
              />
            </div>
          </ContentCard>

          <div className="grid gap-3 sm:grid-cols-2 xl:col-span-2 xl:pt-1">
            <SecondaryButton type="button" onClick={onBack} data-node-id="35606:62267">
              1つ前へ戻る
            </SecondaryButton>
            <PrimaryButton type="submit" data-node-id="35606:62266">
              認証コードを送信する
            </PrimaryButton>
          </div>
        </form>
      </div>
    </ScreenFrame>
  );
}
