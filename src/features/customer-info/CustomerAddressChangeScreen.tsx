import { useMemo, useState } from 'react';
import { ChevronDown, Menu, Search } from 'lucide-react';

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

type CustomerAddressChangeScreenProps = {
  onBackToCustomerInfo: () => void;
  onBackToTop: () => void;
  onLogout: () => void;
  onOpenApplications: () => void;
  onOpenIdentityVerification: () => void;
  onOpenPortfolioAssets: (tab?: AssetTabKey) => void;
  onOpenTradeHistory: () => void;
};

type AddressStep = 'confirm' | 'edit';

type AddressFormState = {
  address1: string;
  address1Kana: string;
  address2: string;
  address2Kana: string;
  building: string;
  buildingKana: string;
  postalCode: string;
};

type AddressFieldKey = keyof AddressFormState;
type AddressFormErrors = Partial<Record<AddressFieldKey, string>>;

const postalAddressLookup: Record<string, Pick<AddressFormState, 'address1' | 'address1Kana'>> = {
  '1000005': {
    address1: '東京都千代田区丸の内1丁目',
    address1Kana: 'ﾄｳｷｮｳﾄﾁﾖﾀﾞｸﾏﾙﾉｳﾁ1-',
  },
  '1030025': {
    address1: '東京都中央区日本橋茅場町1丁目',
    address1Kana: 'ﾄｳｷｮｳﾄﾁﾕｳｵｳｸﾆﾎﾝﾊﾞｼｶﾔﾊﾞﾁﾖｳ1-',
  },
  '1070062': {
    address1: '東京都港区南青山1丁目',
    address1Kana: 'ﾄｳｷｮｳﾄﾐﾅﾄｸﾐﾅﾐｱｵﾔﾏ1-',
  },
};

const defaultFormState: AddressFormState = {
  address1: '',
  address1Kana: '',
  address2: '',
  address2Kana: '',
  building: '',
  buildingKana: '',
  postalCode: '',
};

const taxLawText = `●税法上の告知等
所得税法施行令第336条第3項、同令第339条第4項及び第5項、租税特別措置法施行令第2条の2第12項、同令第4条第9項、同令第4条の5第9項及び同令第4条の6の2第9項、所得税法施行令第342条第3項の規定により、変更事項を告知いたします。

●先物取引の差金等決済をする者の告知に係る変更申請書
所得税法施行令第350条の3第3項の規定により届出ます。

●特定口座異動届出書
告知事項に変更がありましたので、租税特別措置法施行令第25条の10の4第1項及び第2項並びに第3項の規定により、この旨届出ます。

●非課税口座・未成年者口座異動届出書
告知事項に変更がありましたので、租税特別措置法施行令第25条の13の2第1項の規定により、この旨届出ます。`;

function formatPostalCode(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 7);
  if (digits.length <= 3) {
    return digits;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3)}`;
}

function toFullAddress(formState: AddressFormState) {
  return [formState.address1, formState.address2, formState.building].filter(Boolean).join(' ');
}

function toFullAddressKana(formState: AddressFormState) {
  return [formState.address1Kana, formState.address2Kana, formState.buildingKana].filter(Boolean).join(' ');
}

export default function CustomerAddressChangeScreen({
  onBackToCustomerInfo,
  onBackToTop,
  onLogout,
  onOpenApplications,
  onOpenIdentityVerification,
  onOpenPortfolioAssets,
  onOpenTradeHistory,
}: CustomerAddressChangeScreenProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState<AddressStep>('edit');
  const [formState, setFormState] = useState<AddressFormState>(defaultFormState);
  const [errors, setErrors] = useState<AddressFormErrors>({});
  const [taxLawOpen, setTaxLawOpen] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');

  const quickAccessItems = createQuickAccessItems({
    activeKey: 'customerInfo',
    handlers: {
      applications: onOpenApplications,
      portfolioAssets: () => onOpenPortfolioAssets(),
      tradeHistory: onOpenTradeHistory,
    },
  });

  const canConfirm =
    formState.postalCode.replace(/\D/g, '').length === 7 &&
    formState.address1.trim().length > 0 &&
    formState.address1Kana.trim().length > 0 &&
    formState.address2.trim().length > 0 &&
    formState.address2Kana.trim().length > 0;

  const fullAddress = useMemo(() => toFullAddress(formState), [formState]);
  const fullAddressKana = useMemo(() => toFullAddressKana(formState), [formState]);

  const handleFieldChange = (key: AddressFieldKey, value: string) => {
    const normalizedValue = key === 'postalCode' ? value.replace(/\D/g, '').slice(0, 7) : value;
    setFormState((current) => ({ ...current, [key]: normalizedValue }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSearchAddress = () => {
    const normalizedPostalCode = formState.postalCode.replace(/\D/g, '').slice(0, 7);

    if (normalizedPostalCode.length !== 7) {
      setErrors((current) => ({ ...current, postalCode: '郵便番号は7桁で入力してください。' }));
      setSearchMessage('');
      return;
    }

    const lookupAddress = postalAddressLookup[normalizedPostalCode];

    if (!lookupAddress) {
      setFormState((current) => ({
        ...current,
        address1: '',
        address1Kana: '',
        postalCode: normalizedPostalCode,
      }));
      setErrors((current) => ({
        ...current,
        address1: '該当する住所が見つかりません。郵便番号を確認してください。',
        address1Kana: undefined,
        postalCode: undefined,
      }));
      setSearchMessage('');
      return;
    }

    setFormState((current) => ({
      ...current,
      address1: lookupAddress.address1,
      address1Kana: lookupAddress.address1Kana,
      postalCode: normalizedPostalCode,
    }));
    setErrors((current) => ({
      ...current,
      address1: undefined,
      address1Kana: undefined,
      postalCode: undefined,
    }));
    setSearchMessage('住所①を自動入力しました。住所②以降を入力してください。');
  };

  const handleConfirm = () => {
    const nextErrors: AddressFormErrors = {};
    const postalCodeDigits = formState.postalCode.replace(/\D/g, '');

    if (postalCodeDigits.length !== 7) {
      nextErrors.postalCode = '郵便番号は7桁で入力してください。';
    }
    if (!formState.address1.trim()) {
      nextErrors.address1 = '郵便番号を検索して住所①を入力してください。';
    }
    if (!formState.address1Kana.trim()) {
      nextErrors.address1Kana = '住所①（カナ）を入力してください。';
    }
    if (!formState.address2.trim()) {
      nextErrors.address2 = '住所②を入力してください。';
    }
    if (!formState.address2Kana.trim()) {
      nextErrors.address2Kana = '住所②（カナ）を入力してください。';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setStep('confirm');
    }
  };

  const handleProceedToIdentityVerification = async () => {
    await apiClient.customerInfo.submitAddressChange({
      hasBuilding: formState.building.trim().length > 0,
      postalCode: formatPostalCode(formState.postalCode),
    });
    await trackAuditEvent({
      actorType: 'authenticated_user',
      eventType: 'customer_info_submit',
      maskedPayload: {
        action: 'address-change',
        hasBuilding: formState.building.trim().length > 0,
        postalCode: formatPostalCode(formState.postalCode),
      },
      screen: 'customerInfoAddressChange',
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
                  badge='お客様情報 / 住所変更'
                  description='税法条文を確認のうえ、郵便番号検索で住所①を自動入力し、住所②・建物名を入力して内容確認へ進みます。'
                  pretitle='TOP / お届出事項変更・追加申請'
                  title={step === 'edit' ? '住所変更' : '入力内容のご確認'}
                />
              </ServiceScreenHeader>

              <QuickAccessBar actions={quickAccessItems} containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <div className='px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8'>
                <div className='grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
                  <div className='space-y-4'>
                    {step === 'edit' ? (
                      <ContentCard className='space-y-6'>
                        <div className='space-y-2'>
                          <p className='text-[16px] leading-8 tracking-[0.02em] text-[var(--ichiyoshi-navy)]'>
                            郵便番号を入力し、「住所検索」ボタンより新住所をご選択ください。新住所は、ご提出いただく本人確認書類の記載通りにご入力をお願いします。
                          </p>
                          <div className='space-y-1 text-[13px] leading-7 text-[var(--ichiyoshi-error)]'>
                            <p>※ローマ数字はアラビア数字に置き換えてご入力ください。（例：Ⅱ→2・Ⅳ→4）</p>
                            <p>※字・大字や地割の記載・入力有無につきましては、省略して登録させていただく場合がございます。</p>
                          </div>
                        </div>

                        <section className='space-y-3'>
                          <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2'>
                            <p className='text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>税法条文</p>
                          </div>
                          <div className='overflow-hidden rounded-[12px] border border-[rgba(5,32,49,0.1)] bg-white'>
                            <button
                              type='button'
                              onClick={() => setTaxLawOpen((current) => !current)}
                              className='flex w-full items-center justify-between gap-3 px-4 py-3 text-left'
                            >
                              <span className='text-[14px] font-semibold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>
                                税法上の告知等を確認する
                              </span>
                              <ChevronDown
                                className={cn(
                                  'h-4 w-4 text-[var(--ichiyoshi-gold-soft)] transition-transform duration-200',
                                  taxLawOpen && 'rotate-180',
                                )}
                              />
                            </button>
                            {taxLawOpen ? (
                              <div className='max-h-[220px] overflow-y-auto border-t border-[rgba(5,32,49,0.08)] px-4 py-4 text-[13px] leading-7 text-[var(--ichiyoshi-ink-soft)] whitespace-pre-wrap'>
                                {taxLawText}
                              </div>
                            ) : null}
                          </div>
                        </section>

                        <section className='space-y-4'>
                          <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2'>
                            <p className='text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>新住所</p>
                          </div>

                          <div className='space-y-4'>
                            <div className='grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end'>
                              <label className='space-y-2'>
                                <span className='block text-[14px] font-medium tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>郵便番号</span>
                                <Input
                                  value={formState.postalCode}
                                  onChange={(event) => handleFieldChange('postalCode', event.target.value)}
                                  inputMode='numeric'
                                  placeholder='例：1030025'
                                  className={cn(
                                    'h-11 rounded-[8px] border-[rgba(5,32,49,0.12)] bg-white text-[16px] tracking-[0.04em] text-[var(--ichiyoshi-navy)] placeholder:text-[#9e9e9e]',
                                    errors.postalCode && 'border-[var(--ichiyoshi-error)] focus-visible:ring-[var(--ichiyoshi-error)]',
                                  )}
                                />
                                {errors.postalCode ? <p className='text-[12px] text-[var(--ichiyoshi-error)]'>{errors.postalCode}</p> : null}
                              </label>
                              <Button
                                type='button'
                                onClick={handleSearchAddress}
                                className='h-11 min-w-[120px] rounded-[8px] bg-[var(--ichiyoshi-gold-soft)] px-5 text-[14px] font-bold tracking-[0.04em] text-white hover:bg-[#816945]'
                              >
                                <Search className='mr-1 h-4 w-4' />
                                住所検索
                              </Button>
                            </div>

                            {searchMessage ? (
                              <p className='rounded-[8px] border border-[rgba(80,122,231,0.22)] bg-[rgba(80,122,231,0.08)] px-3 py-2 text-[12px] leading-6 text-[#3658a8]'>
                                {searchMessage}
                              </p>
                            ) : null}

                            <div className='grid gap-4 sm:grid-cols-2'>
                              <label className='space-y-2'>
                                <span className='block text-[14px] font-medium tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>住所①（自動入力）</span>
                                <Input
                                  value={formState.address1}
                                  disabled
                                  placeholder='郵便番号検索で自動入力'
                                  className={cn(
                                    'h-11 rounded-[8px] border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.05)] text-[16px] tracking-[0.04em] text-[var(--ichiyoshi-navy)] placeholder:text-[#9e9e9e]',
                                    errors.address1 && 'border-[var(--ichiyoshi-error)]',
                                  )}
                                />
                                {errors.address1 ? <p className='text-[12px] text-[var(--ichiyoshi-error)]'>{errors.address1}</p> : null}
                              </label>

                              <label className='space-y-2'>
                                <span className='block text-[14px] font-medium tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>住所①（カナ）</span>
                                <Input
                                  value={formState.address1Kana}
                                  disabled
                                  placeholder='郵便番号検索で自動入力'
                                  className={cn(
                                    'h-11 rounded-[8px] border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.05)] text-[16px] tracking-[0.04em] text-[var(--ichiyoshi-navy)] placeholder:text-[#9e9e9e]',
                                    errors.address1Kana && 'border-[var(--ichiyoshi-error)]',
                                  )}
                                />
                                {errors.address1Kana ? <p className='text-[12px] text-[var(--ichiyoshi-error)]'>{errors.address1Kana}</p> : null}
                              </label>
                            </div>

                            <div className='grid gap-4 sm:grid-cols-2'>
                              <label className='space-y-2'>
                                <span className='block text-[14px] font-medium tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                                  住所② <span className='text-[12px] text-[var(--ichiyoshi-error)]'>※△丁目が重複しないように入力</span>
                                </span>
                                <Input
                                  value={formState.address2}
                                  onChange={(event) => handleFieldChange('address2', event.target.value)}
                                  placeholder='例：5番8号'
                                  className={cn(
                                    'h-11 rounded-[8px] border-[rgba(5,32,49,0.12)] bg-white text-[16px] tracking-[0.04em] text-[var(--ichiyoshi-navy)] placeholder:text-[#9e9e9e]',
                                    errors.address2 && 'border-[var(--ichiyoshi-error)] focus-visible:ring-[var(--ichiyoshi-error)]',
                                  )}
                                />
                                {errors.address2 ? <p className='text-[12px] text-[var(--ichiyoshi-error)]'>{errors.address2}</p> : null}
                              </label>

                              <label className='space-y-2'>
                                <span className='block text-[14px] font-medium tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>住所②（カナ）</span>
                                <Input
                                  value={formState.address2Kana}
                                  onChange={(event) => handleFieldChange('address2Kana', event.target.value)}
                                  placeholder='例：5-8'
                                  className={cn(
                                    'h-11 rounded-[8px] border-[rgba(5,32,49,0.12)] bg-white text-[16px] tracking-[0.04em] text-[var(--ichiyoshi-navy)] placeholder:text-[#9e9e9e]',
                                    errors.address2Kana && 'border-[var(--ichiyoshi-error)] focus-visible:ring-[var(--ichiyoshi-error)]',
                                  )}
                                />
                                {errors.address2Kana ? <p className='text-[12px] text-[var(--ichiyoshi-error)]'>{errors.address2Kana}</p> : null}
                              </label>
                            </div>

                            <div className='grid gap-4 sm:grid-cols-2'>
                              <label className='space-y-2'>
                                <span className='block text-[14px] font-medium tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>建物名・部屋番号</span>
                                <Input
                                  value={formState.building}
                                  onChange={(event) => handleFieldChange('building', event.target.value)}
                                  placeholder='例：東京証券マンション 501'
                                  className='h-11 rounded-[8px] border-[rgba(5,32,49,0.12)] bg-white text-[16px] tracking-[0.04em] text-[var(--ichiyoshi-navy)] placeholder:text-[#9e9e9e]'
                                />
                              </label>

                              <label className='space-y-2'>
                                <span className='block text-[14px] font-medium tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>建物名・部屋番号（カナ）</span>
                                <Input
                                  value={formState.buildingKana}
                                  onChange={(event) => handleFieldChange('buildingKana', event.target.value)}
                                  placeholder='例：ﾄｳｷｮｳｼｮｳｹﾝﾏﾝｼｮﾝ 501'
                                  className='h-11 rounded-[8px] border-[rgba(5,32,49,0.12)] bg-white text-[16px] tracking-[0.04em] text-[var(--ichiyoshi-navy)] placeholder:text-[#9e9e9e]'
                                />
                              </label>
                            </div>
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
                            disabled={!canConfirm}
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
                            <p className='text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>新住所</p>
                          </div>
                          <div className='space-y-3 rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-4'>
                            <p className='text-[24px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>〒{formatPostalCode(formState.postalCode)}</p>
                            <p className='text-[18px] font-semibold leading-8 tracking-[0.02em] text-[var(--ichiyoshi-navy)]'>{fullAddress}</p>
                            <p className='text-[16px] font-medium leading-7 tracking-[0.02em] text-[var(--ichiyoshi-ink-soft)]'>{fullAddressKana}</p>
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
                          1. 新住所を入力
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

                    <ContentCard className='space-y-3'>
                      <div>
                        <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>Guide</p>
                        <h2 className='mt-2 text-[18px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>入力のポイント</h2>
                      </div>
                      <ul className='space-y-2 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
                        <li>郵便番号検索を押すと、住所①と住所①（カナ）が自動入力されます。</li>
                        <li>住所②は丁目が重複しないように入力してください。</li>
                        <li>本人確認書類の記載と同じ表記で入力してください。</li>
                      </ul>
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
