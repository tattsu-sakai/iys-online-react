import { type ComponentPropsWithoutRef, type ComponentType, type ReactNode, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SetupStep } from '@/features/initial-setup/model';
import { cn } from '@/lib/utils';

export const companyInfoLines = [
  '商号等：いちよし証券株式会社 金融商品取引業者',
  '関東財務局長（金商）第24号',
  '加入協会：日本証券業協会 一般社団法人日本投資顧問業協会',
];

const flowSteps: Array<{ key: SetupStep; label: string }> = [
  { key: 'login', label: 'ログイン' },
  { key: 'intro', label: '案内確認' },
  { key: 'account', label: '情報設定' },
  { key: 'verify', label: '認証確認' },
  { key: 'done', label: '利用開始' },
];

const stageMeta: Record<
  SetupStep,
  {
    eyebrow: string;
    summary: string;
  }
> = {
  login: {
    eyebrow: '安全なログイン',
    summary: '口座情報で安全にログインしてTOP画面へ進めます。初回利用時は初期設定導線から登録を開始してください。',
  },
  intro: {
    eyebrow: '初期設定のご案内',
    summary: '利用できる機能と、完了までの流れを確認してから初期設定を開始できます。',
  },
  account: {
    eyebrow: '安全設定',
    summary: 'ログインに使う新しいパスワードと、認証用メールアドレスを登録します。',
  },
  verify: {
    eyebrow: 'メール認証',
    summary: '登録したメールアドレスに届いた認証コードで、設定内容を確定します。',
  },
  done: {
    eyebrow: 'ご利用開始',
    summary: '初期設定は完了です。これで いちよしオンライン の各機能をご利用いただけます。',
  },
};

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        className='flex items-center gap-[3px] rounded-full bg-white/80 px-3 py-2 shadow-[0_8px_20px_rgba(5,32,49,0.08)]'
        aria-hidden='true'
      >
        <span className='h-6 w-[4px] rounded-full bg-[#d7c27d]' />
        <span className='h-6 w-[4px] rounded-full bg-[#a88c49]' />
        <span className='h-6 w-[4px] rounded-full bg-[#8e1d19]' />
        <span className='h-6 w-[4px] rounded-full bg-[#efe3ba]' />
      </span>
      <span className='text-[20px] font-medium tracking-[0.08em] text-[#8f7b60]'>いちよし証券</span>
    </div>
  );
}

export function PhoneStatusBar() {
  return (
    <div className='flex h-11 items-center justify-between bg-white/90 px-6 text-[15px] font-semibold text-black backdrop-blur xl:hidden'>
      <span className='tracking-[-0.03em]'>9:41</span>
      <div className='flex items-center gap-2'>
        <div className='flex items-end gap-px' aria-hidden='true'>
          <span className='h-1.5 w-[3px] rounded-full bg-black' />
          <span className='h-2.5 w-[3px] rounded-full bg-black' />
          <span className='h-3.5 w-[3px] rounded-full bg-black' />
          <span className='h-[15px] w-[3px] rounded-full bg-black' />
        </div>
        <div className='relative h-[11px] w-[19px]' aria-hidden='true'>
          <div className='h-full w-[17px] rounded-[3px] border border-black' />
          <div className='absolute right-[4px] top-[2px] h-[5px] w-[8px] rounded-[1px] bg-black' />
          <div className='absolute right-0 top-[3px] h-[4px] w-[2px] rounded-r-sm bg-black' />
        </div>
      </div>
    </div>
  );
}

export function ServiceScreenHeader({
  actions,
  children,
  className,
  containerClassName,
}: {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <header
      className={cn(
        'relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-[rgba(255,255,255,0.14)]',
        className,
      )}
    >
      <div className='absolute inset-0 bg-[linear-gradient(135deg,#2a3f4a_0%,#486371_54%,#8f7c63_100%)]' />
      <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(12,27,36,0.12))]' />
      <div className='pointer-events-none absolute -right-8 top-4 h-32 w-32 rounded-full bg-[rgba(255,255,255,0.1)] blur-3xl' />
      <div className='pointer-events-none absolute left-10 top-10 h-24 w-24 rounded-full bg-[rgba(234,224,200,0.16)] blur-2xl' />

      <div className={cn('relative mx-auto w-full max-w-[1180px] px-4 pb-6 pt-5 sm:px-6 sm:pb-7 xl:px-8 xl:pb-8 xl:pt-7', containerClassName)}>
        <div className='flex items-start justify-between gap-4'>
          {children}
          {actions ? <div className='flex items-center gap-2'>{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}

export function ServiceScreenHeroPanel({
  badge,
  description,
  icon,
  pretitle,
  title,
}: {
  badge: string;
  description: ReactNode;
  icon?: ReactNode;
  pretitle?: ReactNode;
  title: ReactNode;
}) {
  return (
    <div className='max-w-[44rem] rounded-[16px] border border-white/10 bg-[rgba(24,35,46,0.18)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-5'>
      <span className='inline-flex rounded-full border border-white/18 bg-white/14 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)] backdrop-blur'>
        {badge}
      </span>

      {icon ? (
        <div className='mt-4 flex items-center gap-3'>
          <span className='flex h-12 w-12 items-center justify-center rounded-[12px] bg-white/12 text-white shadow-[0_16px_32px_rgba(0,0,0,0.16)] ring-1 ring-white/12'>
            {icon}
          </span>
          <div>
            {pretitle ? <div className='text-[14px] font-semibold tracking-[0.08em] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.24)]'>{pretitle}</div> : null}
            <h1 className='mt-1 text-[26px] font-bold leading-[1.25] tracking-[0.04em] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.28)] sm:text-[32px]'>
              {title}
            </h1>
          </div>
        </div>
      ) : (
        <>
          {pretitle ? (
            <div className='mt-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-white/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.24)]'>
              {pretitle}
            </div>
          ) : null}
          <h1 className={cn('text-[26px] font-bold leading-[1.25] tracking-[0.04em] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.28)] sm:text-[32px]', pretitle ? 'mt-3' : 'mt-4')}>
            {title}
          </h1>
        </>
      )}

      <div className='mt-4 max-w-[40rem] text-[13px] leading-6 text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.22)] sm:text-[14px]'>
        {description}
      </div>
    </div>
  );
}

function DesktopFrameBar({ stage }: { stage: SetupStep }) {
  const currentIndex = flowSteps.findIndex((item) => item.key === stage);
  const showStepUi = stage !== 'login';

  return (
    <div className='relative left-1/2 hidden w-screen -translate-x-1/2 border-b border-[rgba(5,32,49,0.08)] bg-white/78 backdrop-blur xl:block'>
      <div className='mx-auto flex w-full max-w-[980px] items-center justify-between px-8 py-5'>
        <BrandMark />
        {showStepUi ? (
          <div className='flex items-center gap-3'>
            <span className='rounded-full bg-[rgba(162,133,86,0.12)] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>
              手順 {currentIndex + 1}/{flowSteps.length}
            </span>
            <span className='text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
              {flowSteps[currentIndex]?.label}
            </span>
          </div>
        ) : (
          <span className='text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--ichiyoshi-gold-soft)]'>
            {stageMeta[stage].eyebrow}
          </span>
        )}
      </div>
    </div>
  );
}

function AppHeader({ title, stage }: { title: string; stage: SetupStep }) {
  const meta = stageMeta[stage];
  const currentIndex = flowSteps.findIndex((item) => item.key === stage);
  const showStepUi = stage !== 'login';

  return (
    <header className='relative left-1/2 w-screen -translate-x-1/2 overflow-hidden'>
      <div className='absolute inset-0 bg-[linear-gradient(135deg,#2a3f4a_0%,#486371_54%,#8f7c63_100%)]' />
      <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(12,27,36,0.12))]' />
      <div className='pointer-events-none absolute -right-10 top-4 h-32 w-32 rounded-full bg-[rgba(255,255,255,0.1)] blur-2xl' />
      <div className='pointer-events-none absolute left-10 top-14 h-24 w-24 rounded-full bg-[rgba(234,224,200,0.16)] blur-2xl' />

      <div className='relative mx-auto w-full max-w-[520px] px-5 pb-6 pt-5 sm:px-6 sm:pb-7 xl:max-w-[980px]'>
        <div className='flex items-center justify-between gap-4'>
          <span className='inline-flex rounded-full border border-white/18 bg-white/14 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)] backdrop-blur'>
            {meta.eyebrow}
          </span>
          {showStepUi ? (
            <span className='text-[10px] font-medium uppercase tracking-[0.2em] text-white/78 [text-shadow:0_1px_10px_rgba(0,0,0,0.24)]'>
              手順 {currentIndex + 1}/{flowSteps.length}
            </span>
          ) : null}
        </div>
        <h1 className='mt-5 text-[28px] font-bold leading-[1.35] tracking-[0.04em] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.28)] sm:text-[30px]'>
          {title}
        </h1>
        <p className='mt-3 inline-flex max-w-[34rem] rounded-[12px] border border-white/10 bg-[rgba(24,35,46,0.18)] px-4 py-3 text-[13px] leading-6 text-white shadow-[0_12px_30px_rgba(0,0,0,0.16)] backdrop-blur sm:text-[14px]'>
          {meta.summary}
        </p>
        {showStepUi ? (
          <div className='mt-5 flex gap-2'>
            {flowSteps.map((item, index) => (
              <span
                key={item.key}
                className={cn(
                  'h-1.5 flex-1 rounded-full bg-white/15',
                  index <= currentIndex && 'bg-[linear-gradient(90deg,rgba(255,255,255,0.88),rgba(218,191,139,0.98))]',
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export function BrandFooter({ containerClassName }: { containerClassName?: string }) {
  return (
    <footer
      className='relative left-1/2 w-screen -translate-x-1/2 border-t border-white/70 bg-[linear-gradient(180deg,rgba(248,248,248,0.15),rgba(255,255,255,0.92))] text-center text-[12px] leading-[1.8] text-[var(--ichiyoshi-muted)] backdrop-blur xl:text-left'
      data-node-id='footer'
    >
      <div className={cn('mx-auto w-full max-w-[520px] px-5 py-6 xl:max-w-[980px] xl:px-8', containerClassName)}>
        <BrandMark className='justify-center xl:justify-start' />
        <div className='mt-5 space-y-1'>
          {companyInfoLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className='mt-2'>Copyright © Ichiyoshi Securities Co., Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}

export function ScreenFrame({ children, stage, title }: { children: ReactNode; stage: SetupStep; title: string }) {
  return (
    <div className='relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(162,133,86,0.18),transparent_24%),radial-gradient(circle_at_90%_10%,rgba(5,32,49,0.16),transparent_20%),linear-gradient(180deg,#f7f3eb_0%,#eef2f4_34%,#e6ebee_100%)]'>
      <div className='pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-[15%] rounded-full bg-[rgba(198,168,104,0.18)] blur-3xl' />
      <div className='pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 rounded-full bg-[rgba(5,32,49,0.12)] blur-3xl' />

      <div className='mx-auto flex min-h-screen max-w-[1240px] flex-col'>
        <section className='relative flex flex-1 items-stretch justify-center px-0 py-0 sm:px-4 lg:px-6 xl:px-10'>
          <div className='relative w-full max-w-[520px] xl:max-w-[980px]'>
            <div className='pointer-events-none absolute inset-x-10 top-5 h-32 rounded-full bg-[rgba(162,133,86,0.18)] blur-3xl' />

            <div className='relative'>
              <DesktopFrameBar stage={stage} />
              <AppHeader title={title} stage={stage} />
              <div className='flex min-h-[calc(100vh-44px)] flex-col sm:min-h-[820px] xl:min-h-[860px]'>
                {children}
                <BrandFooter />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function ContentCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        'animate-fade-in-up rounded-[16px] border border-[rgba(5,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,250,0.94))] p-5 shadow-[0_18px_50px_rgba(5,32,49,0.08)] sm:p-6 xl:p-7',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function QuickAccessBar({
  actions,
  className,
  containerClassName,
}: {
  actions: Array<{
    active?: boolean;
    icon: ComponentType<{ className?: string }>;
    label: string;
    onClick?: () => void;
  }>;
  className?: string;
  containerClassName?: string;
}) {
  useEffect(() => {
    document.body.classList.add('has-mobile-quick-access');

    return () => {
      document.body.classList.remove('has-mobile-quick-access');
    };
  }, []);

  return (
    <>
      <section
        className={cn(
          'relative left-1/2 hidden w-screen -translate-x-1/2 border-b border-[rgba(5,32,49,0.06)] bg-[rgba(255,255,255,0.72)] backdrop-blur sm:block',
          className,
        )}
      >
        <div
          className={cn(
            'mx-auto w-full max-w-[520px] px-4 py-2 sm:px-6 xl:max-w-[980px] xl:px-8',
            containerClassName,
          )}
        >
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
            {actions.map((action) => {
              const Icon = action.icon;
              const isDisabled = !action.onClick && !action.active;

              return (
                <button
                  key={action.label}
                  type='button'
                  onClick={action.onClick}
                  disabled={isDisabled}
                  aria-current={action.active ? 'page' : undefined}
                  aria-disabled={isDisabled}
                  aria-label={action.active ? `${action.label}（現在表示中）` : `${action.label}へ移動`}
                  title={action.active ? `${action.label}（現在表示中）` : `${action.label}へ移動`}
                  className={cn(
                    'group flex min-h-[64px] flex-col items-start justify-center gap-2 rounded-[12px] border px-3 py-3 text-left shadow-[0_8px_18px_rgba(5,32,49,0.05)] transition-transform duration-200 sm:min-h-[60px] sm:flex-row sm:items-center sm:justify-start',
                    action.active
                      ? 'border-[rgba(111,91,59,0.2)] bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] text-white'
                      : isDisabled
                        ? 'cursor-not-allowed border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.04)] text-[var(--ichiyoshi-muted)] shadow-none'
                        : 'border-[rgba(5,32,49,0.08)] bg-white/92 text-[var(--ichiyoshi-navy)] hover:-translate-y-0.5 hover:bg-white',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]',
                      action.active
                        ? 'bg-white/14'
                        : isDisabled
                          ? 'bg-[rgba(5,32,49,0.05)] text-[var(--ichiyoshi-muted)]'
                          : 'bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-gold-soft)]',
                    )}
                  >
                    <Icon className='h-4 w-4' />
                  </span>
                  <span className='flex min-w-0 flex-1 flex-col'>
                    <span className='truncate text-[13px] font-bold leading-[1.3] tracking-[0.02em] sm:text-[12px]'>{action.label}</span>
                    {isDisabled ? <span className='mt-0.5 text-[10px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-muted)]'>準備中</span> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className='fixed inset-x-0 bottom-0 z-50 border-t border-[rgba(5,32,49,0.12)] bg-[rgba(255,255,255,0.9)] backdrop-blur-md sm:hidden'>
        <div className='mx-auto w-full max-w-[520px] px-2 pb-2 pt-2' style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}>
          <div className='grid grid-cols-4 gap-1.5'>
            {actions.map((action) => {
              const Icon = action.icon;
              const isDisabled = !action.onClick && !action.active;

              return (
                <button
                  key={`mobile-${action.label}`}
                  type='button'
                  onClick={action.onClick}
                  disabled={isDisabled}
                  aria-current={action.active ? 'page' : undefined}
                  aria-disabled={isDisabled}
                  aria-label={action.active ? `${action.label}（現在表示中）` : `${action.label}へ移動`}
                  title={action.active ? `${action.label}へ移動` : `${action.label}へ移動`}
                  className={cn(
                    'flex min-h-[66px] flex-col items-center justify-center gap-1 rounded-[10px] border px-1.5 py-2 text-center transition-colors duration-200',
                    action.active
                      ? 'border-[rgba(111,91,59,0.2)] bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] text-white'
                      : isDisabled
                        ? 'cursor-not-allowed border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.04)] text-[var(--ichiyoshi-muted)]'
                        : 'border-[rgba(5,32,49,0.08)] bg-white text-[var(--ichiyoshi-navy)]',
                  )}
                >
                  <Icon className='h-4 w-4' />
                  <span className='text-[11px] font-bold leading-[1.2] tracking-[0.02em]'>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className='inline-flex items-center gap-3 rounded-full bg-[linear-gradient(180deg,rgba(244,239,230,0.98),rgba(255,255,255,0.98))] px-4 py-2 shadow-[0_10px_22px_rgba(5,32,49,0.06)] ring-1 ring-[rgba(5,32,49,0.06)]'>
      <span className='h-2.5 w-2.5 rounded-full bg-[var(--ichiyoshi-gold-soft)]' />
      <span className='text-[13px] font-semibold tracking-[0.08em] text-[var(--ichiyoshi-navy)]'>{children}</span>
    </div>
  );
}

export function HintCard({ children, className, title }: { children: ReactNode; className?: string; title: string }) {
  return (
    <div
      className={cn(
        'rounded-[14px] border border-[rgba(162,133,86,0.18)] bg-[linear-gradient(135deg,rgba(244,239,230,0.9),rgba(255,255,255,0.95))] p-4 shadow-[0_14px_34px_rgba(5,32,49,0.05)]',
        className,
      )}
    >
      <p className='text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--ichiyoshi-gold-soft)]'>{title}</p>
      <div className='mt-2 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>{children}</div>
    </div>
  );
}

export function PrimaryButton({ className, ...props }: ComponentPropsWithoutRef<typeof Button>) {
  return (
    <Button
      className={cn(
        'h-[52px] w-full rounded-[12px] border border-[rgba(111,91,59,0.15)] bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] px-5 text-[16px] font-bold tracking-[0.08em] text-white shadow-[0_16px_40px_rgba(111,91,59,0.26)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#92744a_0%,#765f3d_55%,#5f4d32_100%)] focus-visible:ring-[var(--ichiyoshi-gold)] disabled:border-transparent disabled:bg-[linear-gradient(135deg,#d8d8d8_0%,#cfcfcf_100%)] disabled:text-white disabled:shadow-none disabled:hover:translate-y-0',
        className,
      )}
      {...props}
    />
  );
}

export function SecondaryButton({ className, variant = 'outline', ...props }: ComponentPropsWithoutRef<typeof Button>) {
  return (
    <Button
      variant={variant}
      className={cn(
        'h-[52px] w-full rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-white/88 px-5 text-[16px] font-bold tracking-[0.08em] text-[var(--ichiyoshi-navy)] shadow-[0_12px_30px_rgba(5,32,49,0.08)] transition-colors duration-200 hover:bg-white hover:text-[var(--ichiyoshi-gold)] focus-visible:ring-[var(--ichiyoshi-gold)]',
        className,
      )}
      {...props}
    />
  );
}

type TextFieldProps = Omit<ComponentPropsWithoutRef<typeof Input>, 'onChange'> & {
  error?: string;
  label: string;
  onChange: (value: string) => void;
  trailing?: ReactNode;
  value: string;
};

export function TextField({ className, error, label, onChange, trailing, value, ...props }: TextFieldProps) {
  return (
    <label className='block w-full'>
      <span className='mb-2 block text-[13px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-ink-soft)]'>{label}</span>
      <div className='relative'>
        <Input
          className={cn(
            'h-12 rounded-[12px] border-[rgba(5,32,49,0.1)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] px-4 text-[16px] font-semibold leading-[1.5] tracking-[0.04em] text-[var(--ichiyoshi-navy)] placeholder:font-medium placeholder:text-[#92a0ab] focus-visible:border-[var(--ichiyoshi-gold-soft)] focus-visible:ring-2 focus-visible:ring-[rgba(162,133,86,0.16)]',
            trailing && 'pr-12',
            error &&
              'border-[var(--ichiyoshi-error)] focus-visible:border-[var(--ichiyoshi-error)] focus-visible:ring-[rgba(194,59,42,0.12)]',
            className,
          )}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          {...props}
        />
        {trailing ? <div className='absolute inset-y-0 right-4 flex items-center text-[var(--ichiyoshi-ink-soft)]'>{trailing}</div> : null}
      </div>
      {error ? <span className='mt-2 block text-[13px] leading-[1.6] text-[var(--ichiyoshi-error)]'>{error}</span> : null}
    </label>
  );
}
