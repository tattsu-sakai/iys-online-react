import {
  AccountOpeningShell,
  ContentCard,
  HintCard,
  PrimaryButton,
  SecondaryButton,
} from "@/features/personal-account-opening/components";

type EmailSentStepProps = {
  email: string;
  resendMessage: string;
  onResend: () => void;
  onReturnToLogin: () => void;
};

export default function EmailSentStep({
  email,
  resendMessage,
  onResend,
  onReturnToLogin,
}: EmailSentStepProps) {
  return (
    <AccountOpeningShell
      description="入力いただいたメールアドレスに、会員登録用の URL を送信しました。"
      step="sent"
      title="メール送信完了"
      aside={
        <HintCard title="Next">
          <p>メール内の URL から会員登録の本登録へ進みます。本登録完了画面は後続対応予定です。</p>
        </HintCard>
      }
    >
      <div className="space-y-5">
        <ContentCard className="space-y-5">
          <p className="text-[16px] leading-8 text-[var(--ichiyoshi-navy)]">
            入力いただいたメールアドレスに、会員登録用の URL をお送りいたしました。
          </p>
          <p className="text-[17px] font-bold leading-8 tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
            <strong className="font-bold">info@ichiyoshi.co.jp</strong>
            から届いたメールをご確認ください。
          </p>

          <div className="rounded-[16px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
              Recipient
            </p>
            <p className="mt-3 break-all text-[18px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
              {email}
            </p>
          </div>
        </ContentCard>

        <div className="grid gap-3 sm:grid-cols-2">
          <SecondaryButton type="button" onClick={onResend}>
            もう一度送信する
          </SecondaryButton>
          <PrimaryButton type="button" onClick={onReturnToLogin}>
            ログインへ戻る
          </PrimaryButton>
        </div>

        {resendMessage ? (
          <p className="text-[14px] leading-6 text-[var(--ichiyoshi-ink-soft)]">{resendMessage}</p>
        ) : null}
      </div>
    </AccountOpeningShell>
  );
}
