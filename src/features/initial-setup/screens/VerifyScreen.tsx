import { MailCheck, RotateCcw } from "lucide-react";

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

const helpItems = [
  "迷惑メールフォルダをご確認ください。",
  "info@ichiyoshi.co.jp からのメールを受信できるように設定してください。",
  "コードの有効期限は15分です。期限切れの場合は再送信してください。",
];

type VerifyScreenProps = {
  emailDisplay: string;
  errors: FormErrors;
  formState: FormState;
  onBack: () => void;
  onFieldChange: <Key extends keyof FormState>(
    key: Key,
    value: FormState[Key]
  ) => void;
  onResend: () => void;
  onSubmit: () => void;
  verifyMessage: string;
};

export default function VerifyScreen({
  emailDisplay,
  errors,
  formState,
  onBack,
  onFieldChange,
  onResend,
  onSubmit,
  verifyMessage,
}: VerifyScreenProps) {
  return (
    <ScreenFrame title="認証コード入力" stage="verify">
      <div className="flex-1 px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8">
        <form
          className="space-y-5 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)] xl:items-start xl:gap-5 xl:space-y-0"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <ContentCard className="space-y-6">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[var(--ichiyoshi-navy)] text-white shadow-[0_10px_24px_rgba(5,32,49,0.16)]">
                <MailCheck className="h-5 w-5" />
              </span>
              <div>
                <SectionLabel>認証コード</SectionLabel>
                <p className="mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
                  入力されたメールアドレス宛に認証コードを送信しました。コードを入力して設定を確定してください。
                </p>
              </div>
            </div>

            <div className="rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] p-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--ichiyoshi-gold-soft)]">
                Delivery
              </p>
              <p className="mt-2 break-all text-[18px] font-semibold leading-8 tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
                {emailDisplay}
              </p>
            </div>

            <TextField
              label="認証コード"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              maxLength={6}
              error={errors.code}
              value={formState.code}
              onChange={(value) =>
                onFieldChange("code", value.replace(/\D/g, "").slice(0, 6))
              }
            />
          </ContentCard>

          <ContentCard className="space-y-5">
            <SectionLabel>メールが届かない場合</SectionLabel>
            <ul className="space-y-3 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
              {helpItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--ichiyoshi-gold-soft)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <HintCard title="Resend" className="shadow-none">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-[15px] font-bold tracking-[0.04em] text-[#0000ff]"
                onClick={onResend}
              >
                <RotateCcw className="h-4 w-4" />
                コードを再送信する
              </button>
              {verifyMessage ? (
                <p className="mt-3 text-[13px] leading-[1.7] text-[#3a5d7a]">
                  {verifyMessage}
                </p>
              ) : null}
            </HintCard>
          </ContentCard>

          <div className="grid gap-3 sm:grid-cols-2 xl:col-span-2 xl:pt-1">
            <SecondaryButton type="button" onClick={onBack} data-node-id="35825:15440">
              一つ前へ戻る
            </SecondaryButton>
            <PrimaryButton type="submit" data-node-id="35606:62308">
              認証して次へ
            </PrimaryButton>
          </div>
        </form>
      </div>
    </ScreenFrame>
  );
}
