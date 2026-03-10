import { Button } from '@/components/ui/button';

type SessionTimeoutDialogProps = {
  countdownMs: number;
  onExtendSession: () => void;
  open: boolean;
};

function toClockText(countdownMs: number) {
  const totalSeconds = Math.max(0, Math.floor(countdownMs / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function SessionTimeoutDialog({
  countdownMs,
  onExtendSession,
  open,
}: SessionTimeoutDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-[200] bg-[rgba(10,16,22,0.58)] px-4 py-6 backdrop-blur-[2px]'>
      <div className='mx-auto mt-16 max-w-[440px] rounded-[16px] border border-[rgba(5,32,49,0.12)] bg-white p-6 shadow-[0_22px_50px_rgba(0,0,0,0.2)]'>
        <p className='text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--ichiyoshi-gold-soft)]'>
          セッション保護
        </p>
        <h2 className='mt-2 text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
          まもなく自動ログアウトします
        </h2>
        <p className='mt-3 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
          無操作状態が続いているため、安全のためセッションを終了します。継続する場合は下のボタンを押してください。
        </p>
        <div className='mt-5 rounded-[10px] border border-[rgba(194,59,42,0.2)] bg-[rgba(194,59,42,0.08)] px-4 py-3 text-[18px] font-bold tracking-[0.08em] text-[var(--ichiyoshi-error)]'>
          残り {toClockText(countdownMs)}
        </div>
        <Button
          type='button'
          onClick={onExtendSession}
          className='mt-5 h-11 w-full rounded-[10px] bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] text-[14px] font-semibold tracking-[0.04em] text-white'
        >
          セッションを延長する
        </Button>
      </div>
    </div>
  );
}

