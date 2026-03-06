import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

import {
  ContentCard,
  HintCard,
  PrimaryButton,
  ScreenFrame,
  SecondaryButton,
  SectionLabel,
  TextField,
} from "@/features/initial-setup/components";

type LoginScreenProps = {
  onLogin: () => void;
  onShowIntro: () => void;
};

export default function LoginScreen({ onLogin, onShowIntro }: LoginScreenProps) {
  const [branchNumber, setBranchNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isReady =
    branchNumber.trim().length > 0 &&
    accountNumber.trim().length > 0 &&
    password.length > 0;

  return (
    <ScreenFrame title="ログイン" stage="login">
      <div className="flex-1 px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8">
        <div className="space-y-5 xl:grid xl:grid-cols-[minmax(0,1.12fr)_minmax(260px,0.88fr)] xl:items-start xl:gap-5 xl:space-y-0">
          <ContentCard className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <SectionLabel>口座アクセス</SectionLabel>
                <p className="mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
                  部店番号・口座番号・パスワードを入力して、TOP画面へログインします。
                </p>
              </div>
              <span className="hidden rounded-full bg-[rgba(162,133,86,0.12)] px-3 py-1 text-[12px] font-semibold tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)] sm:inline-flex">
                Secure
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-[12px] bg-[#f4efe6] p-1.5">
              <div className="rounded-[10px] px-4 py-3 text-center text-[15px] font-medium tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
                ログインID
              </div>
              <div className="rounded-[10px] bg-[linear-gradient(135deg,#ba9a62_0%,#a28556_100%)] px-4 py-3 text-center text-[15px] font-bold tracking-[0.04em] text-white shadow-[0_10px_24px_rgba(162,133,86,0.24)]">
                口座情報
              </div>
            </div>

            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                if (isReady) {
                  onLogin();
                }
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="部店番号"
                  inputMode="numeric"
                  maxLength={3}
                  placeholder="123"
                  value={branchNumber}
                  onChange={(value) =>
                    setBranchNumber(value.replace(/\D/g, "").slice(0, 3))
                  }
                />
                <TextField
                  label="口座番号"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={accountNumber}
                  onChange={(value) =>
                    setAccountNumber(value.replace(/\D/g, "").slice(0, 6))
                  }
                />
              </div>

              <TextField
                label="パスワード"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="*************"
                value={password}
                onChange={setPassword}
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

              <div className="space-y-3">
                <PrimaryButton type="submit" disabled={!isReady} data-node-id="35610:66691">
                  ログイン
                </PrimaryButton>
                <SecondaryButton type="button" onClick={onShowIntro}>
                  初めて利用する方はこちら
                </SecondaryButton>
              </div>
            </form>
          </ContentCard>

          <div className="space-y-5">
            <HintCard title="Security Note">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--ichiyoshi-navy)] text-white shadow-[0_10px_24px_rgba(5,32,49,0.18)]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-[var(--ichiyoshi-navy)]">
                    共用端末ではブラウザ保存を避けてください。
                  </p>
                  <p className="mt-1">
                    ログイン後にパスワード変更とメール認証を行うことで、利用開始まで安全に進めます。
                  </p>
                </div>
              </div>
            </HintCard>

            <HintCard title="Support">
              <button
                type="button"
                className="border-b border-[#0000ff] pb-0.5 text-[15px] font-bold tracking-[0.04em] text-[#0000ff]"
              >
                パスワードをお忘れの方はこちらへ
              </button>
              <p className="mt-3">
                初回利用やメールアドレス登録が未完了の場合は、左の導線から初期設定へ進んでください。
              </p>
            </HintCard>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}
