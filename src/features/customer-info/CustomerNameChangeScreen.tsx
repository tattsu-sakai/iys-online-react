import { useMemo, useState } from 'react';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BrandFooter,
  ContentCard,
  PrimaryButton,
  QuickAccessBar,
  SecondaryButton,
  ServiceScreenHeader,
  ServiceScreenHeroPanel,
} from '@/features/initial-setup/components';
import AppNavigationMenu from '@/features/navigation/AppNavigationMenu';
import { createQuickAccessItems } from '@/features/navigation/quick-access';
import type { AssetTabKey } from '@/features/portfolio-assets/model';
import { trackAuditEvent } from '@/features/security/audit';
import { apiClient } from '@/lib/api/mock-client';
import { cn } from '@/lib/utils';

type CustomerNameChangeScreenProps = {
  onBackToCustomerInfo: () => void;
  onBackToTop: () => void;
  onLogout: () => void;
  onOpenApplications: () => void;
  onOpenIdentityVerification: () => void;
  onOpenPortfolioAssets: (tab?: AssetTabKey) => void;
  onOpenTradeHistory: () => void;
};

type NameChangeFormState = {
  firstKana: string;
  firstName: string;
  lastKana: string;
  lastName: string;
};

type NameChangeFormKey = keyof NameChangeFormState;

const fieldMeta: Array<{
  key: NameChangeFormKey;
  label: string;
  placeholder: string;
}> = [
  { key: 'lastName', label: '姓', placeholder: '例：一吉' },
  { key: 'firstName', label: '名', placeholder: '例：太郎' },
  { key: 'lastKana', label: 'セイ', placeholder: '例：イチヨシ' },
  { key: 'firstKana', label: 'メイ', placeholder: '例：タロウ' },
];

const defaultFormState: NameChangeFormState = {
  firstKana: '',
  firstName: '',
  lastKana: '',
  lastName: '',
};

function toErrorMessage(label: string) {
  return `${label}を入力してください。`;
}

export default function CustomerNameChangeScreen({
  onBackToCustomerInfo,
  onBackToTop,
  onLogout,
  onOpenApplications,
  onOpenIdentityVerification,
  onOpenPortfolioAssets,
  onOpenTradeHistory,
}: CustomerNameChangeScreenProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState<'edit' | 'confirm'>('edit');
  const [formState, setFormState] = useState<NameChangeFormState>(defaultFormState);
  const [errors, setErrors] = useState<Partial<Record<NameChangeFormKey, string>>>({});

  const quickAccessItems = createQuickAccessItems({
    activeKey: 'customerInfo',
    handlers: {
      applications: onOpenApplications,
      portfolioAssets: () => onOpenPortfolioAssets(),
      tradeHistory: onOpenTradeHistory,
    },
  });

  const hasAllFields = useMemo(() => Object.values(formState).every((value) => value.trim().length > 0), [formState]);

  const handleFieldChange = (key: NameChangeFormKey, value: string) => {
    setFormState((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleConfirm = () => {
    const nextErrors: Partial<Record<NameChangeFormKey, string>> = {};

    fieldMeta.forEach((field) => {
      if (!formState[field.key].trim()) {
        nextErrors[field.key] = toErrorMessage(field.label);
      }
    });

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setStep('confirm');
    }
  };

  const handleProceedToIdentityVerification = async () => {
    await apiClient.customerInfo.submitNameChange({
      changedFields: fieldMeta.map((field) => field.key),
    });
    await trackAuditEvent({
      actorType: 'authenticated_user',
      eventType: 'customer_info_submit',
      maskedPayload: { action: 'name-change', changedFieldCount: fieldMeta.length },
      screen: 'customerInfoNameChange',
    });
    onOpenIdentityVerification();
  };

  return (
    <main className='min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(162,133,86,0.18),transparent_24%),radial-gradient(circle_at_90%_10%,rgba(5,32,49,0.16),transparent_20%),linear-gradient(180deg,#f7f3eb_0%,#eef2f4_34%,#e6ebee_100%)]'>
      <div className='mx-auto flex min-h-screen max-w-[1380px] flex-col'>
        <section className='relative flex flex-1 items-stretch justify-center px-0 py-0 sm:px-4 lg:px-6 xl:px-10'>
          <div className='relative w-full max-w-[1180px]'>
            <div className='pointer-events-none absolute inset-x-10 top-5 h-32 rounded-full bg-[rgba(162,133,86,0.18)] blur-3xl' />

            <div className='relative'>
              <ServiceScreenHeader
                actions={
                  <>
                    <button
                      type='button'
                      className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white backdrop-blur'
                      aria-label='メニュー'
                      aria-expanded={menuOpen}
                      aria-haspopup='dialog'
                      onClick={() => setMenuOpen(true)}
                    >
                      <Menu className='h-4 w-4' />
                    </button>
                    <Button
                      type='button'
                      onClick={onBackToTop}
                      className='h-11 rounded-full border border-white/12 bg-white/10 px-4 text-[13px] font-semibold tracking-[0.08em] text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur hover:bg-white/16'
                    >
                      TOPへ戻る
                    </Button>
                  </>
                }
              >
                <ServiceScreenHeroPanel
                  badge='お客様情報 / 氏名変更'
                  description='旧字体等は登録できない場合があるため、入力時は常用漢字をご利用ください。'
                  pretitle='TOP / お届出事項変更・追加申請'
                  title={step === 'edit' ? '氏名変更' : '入力内容のご確認'}
                />
              </ServiceScreenHeader>

              <QuickAccessBar actions={quickAccessItems} containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <div className='px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8'>
                <div className='grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
                  <div className='space-y-4'>
                    {step === 'edit' ? (
                      <ContentCard className='space-y-6'>
                        <p className='text-[16px] leading-8 tracking-[0.02em] text-[var(--ichiyoshi-navy)]'>
                          氏名の変更における旧字体等につきましては、登録が出来かねる場合には常用漢字にてご入力ください。
                        </p>

                        <section className='space-y-4'>
                          <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2'>
                            <p className='text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>新氏名</p>
                          </div>

                          <div className='grid gap-4 sm:grid-cols-2'>
                            {fieldMeta.map((field) => (
                              <label key={field.key} className='space-y-2'>
                                <span className='block text-[14px] font-medium tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                                  {field.label}
                                </span>
                                <Input
                                  value={formState[field.key]}
                                  onChange={(event) => handleFieldChange(field.key, event.target.value)}
                                  placeholder={field.placeholder}
                                  className={cn(
                                    'h-11 rounded-[8px] border-[rgba(5,32,49,0.12)] bg-white text-[16px] tracking-[0.04em] text-[var(--ichiyoshi-navy)] placeholder:text-[#9e9e9e]',
                                    errors[field.key] && 'border-[var(--ichiyoshi-error)] focus-visible:ring-[var(--ichiyoshi-error)]',
                                  )}
                                />
                                {errors[field.key] ? (
                                  <p className='text-[12px] text-[var(--ichiyoshi-error)]'>{errors[field.key]}</p>
                                ) : null}
                              </label>
                            ))}
                          </div>
                        </section>

                        <div className='grid gap-3 sm:grid-cols-2'>
                          <SecondaryButton
                            type='button'
                            onClick={onBackToCustomerInfo}
                            className='h-12 rounded-[10px] text-[16px] tracking-[0.04em]'
                          >
                            1つ前へ戻る
                          </SecondaryButton>
                          <PrimaryButton
                            type='button'
                            onClick={handleConfirm}
                            disabled={!hasAllFields}
                            className='h-12 rounded-[10px] text-[16px] tracking-[0.04em]'
                          >
                            変更内容を確認する
                          </PrimaryButton>
                        </div>
                      </ContentCard>
                    ) : (
                      <ContentCard className='space-y-6'>
                        <p className='text-[16px] leading-8 tracking-[0.02em] text-[var(--ichiyoshi-navy)]'>
                          この内容でよろしければ、「本人確認へ進む」ボタンを押してください。
                        </p>

                        <section className='space-y-4'>
                          <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2'>
                            <p className='text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>新氏名</p>
                          </div>

                          <div className='grid gap-4 sm:grid-cols-2'>
                            {fieldMeta.map((field) => (
                              <div
                                key={field.key}
                                className='rounded-[10px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-3'
                              >
                                <p className='text-[13px] tracking-[0.04em] text-[var(--ichiyoshi-ink-soft)]'>{field.label}</p>
                                <p className='mt-2 text-[20px] font-bold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>
                                  {formState[field.key]}
                                </p>
                              </div>
                            ))}
                          </div>
                        </section>

                        <div className='grid gap-3 sm:grid-cols-2'>
                          <SecondaryButton
                            type='button'
                            onClick={() => setStep('edit')}
                            className='h-12 rounded-[10px] text-[16px] tracking-[0.04em]'
                          >
                            1つ前へ戻る
                          </SecondaryButton>
                          <PrimaryButton
                            type='button'
                            onClick={() => {
                              void handleProceedToIdentityVerification();
                            }}
                            className='h-12 rounded-[10px] text-[16px] tracking-[0.04em]'
                          >
                            本人確認へ進む
                          </PrimaryButton>
                        </div>
                      </ContentCard>
                    )}
                  </div>

                  <div className='space-y-4 xl:sticky xl:top-6'>
                    <ContentCard className='space-y-4'>
                      <div>
                        <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>Flow</p>
                        <h2 className='mt-2 text-[18px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>お手続きの流れ</h2>
                      </div>
                      <div className='space-y-3'>
                        <div
                          className={cn(
                            'rounded-[10px] border px-4 py-3 text-[14px] font-semibold',
                            step === 'edit'
                              ? 'border-[rgba(111,91,59,0.26)] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-navy)]'
                              : 'border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] text-[var(--ichiyoshi-ink-soft)]',
                          )}
                        >
                          1. 新氏名を入力
                        </div>
                        <div
                          className={cn(
                            'rounded-[10px] border px-4 py-3 text-[14px] font-semibold',
                            step === 'confirm'
                              ? 'border-[rgba(111,91,59,0.26)] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-navy)]'
                              : 'border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] text-[var(--ichiyoshi-ink-soft)]',
                          )}
                        >
                          2. 入力内容を確認
                        </div>
                        <div className='rounded-[10px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-3 text-[14px] font-semibold text-[var(--ichiyoshi-ink-soft)]'>
                          3. 本人確認へ進む
                        </div>
                      </div>
                    </ContentCard>
                  </div>
                </div>
              </div>

              <BrandFooter containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <AppNavigationMenu
                activeScreen='customerInfo'
                onClose={() => setMenuOpen(false)}
                onLogout={onLogout}
                onOpenApplications={onOpenApplications}
                onOpenCustomerInfo={() => {
                  setMenuOpen(false);
                  onBackToCustomerInfo();
                }}
                onOpenPortfolioAssets={() => onOpenPortfolioAssets()}
                onOpenTradeHistory={onOpenTradeHistory}
                onOpenTop={onBackToTop}
                open={menuOpen}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
