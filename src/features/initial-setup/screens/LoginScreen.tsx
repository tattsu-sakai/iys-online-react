import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';

import FormErrorSummary from '@/components/ui/form-error-summary';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ContentCard,
  HintCard,
  PrimaryButton,
  ScreenFrame,
  SecondaryButton,
  SectionLabel,
  TextField,
} from '@/features/initial-setup/components';
import { apiClient } from '@/lib/api/mock-client';
import { flattenFieldErrors, findFirstErrorField } from '@/lib/validation/form-schema';
import { defaultLoginFormValues, loginFormSchema, type LoginFormValues } from '@/lib/validation/login-schema';
import { createMaskedPayload, maskAccountNumber, maskLoginId, normalizeDigits, preventSensitivePaste } from '@/features/security/pii';
import { trackAuditEvent } from '@/features/security/audit';

type LoginScreenProps = {
  onLogin: () => void;
  onStartMemberRegistration: () => void;
  onShowIntro: () => void;
};

type LoginMethod = LoginFormValues['loginMethod'];
type LoginFormFieldKey = Exclude<keyof LoginFormValues, 'loginMethod'>;

export default function LoginScreen({ onLogin, onStartMemberRegistration, onShowIntro }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    clearErrors,
    formState: { errors, isSubmitting, submitCount },
    handleSubmit,
    setFocus,
    setValue,
    watch,
  } = useForm<LoginFormValues>({
    defaultValues: defaultLoginFormValues,
    mode: 'onSubmit',
    resolver: zodResolver(loginFormSchema),
  });

  const loginMethod = watch('loginMethod');
  const formErrorMessages = flattenFieldErrors(errors);
  const firstErrorField = findFirstErrorField(errors);

  useEffect(() => {
    if (submitCount === 0 || !firstErrorField) {
      return;
    }

    setFocus(firstErrorField);
  }, [firstErrorField, setFocus, submitCount]);

  const passwordToggle = (
    <button
      type='button'
      className='inline-flex items-center'
      onClick={() => setShowPassword((current) => !current)}
      aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示する'}
    >
      {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
    </button>
  );

  const currentPasswordField = loginMethod === 'login-id' ? 'loginIdPassword' : 'accountPassword';
  const loginIdValue = watch('loginId');
  const accountNumberValue = watch('accountNumber');
  const branchNumberValue = watch('branchNumber');

  const glossaryNotes = useMemo(
    () => [
      'ログインID: 会員登録時に設定した文字列です。',
      '部店番号: 口座情報ログインで利用する3桁番号です。',
      '口座番号: 口座情報ログインで利用する6桁番号です。',
    ],
    [],
  );

  const toErrorMessage = (value: unknown) => (typeof value === 'string' ? value : undefined);

  const updateField = (key: LoginFormFieldKey, value: string) => {
    setValue(key, value, { shouldDirty: true, shouldTouch: true });
    clearErrors([key, currentPasswordField]);
  };

  const handleLoginMethodChange = (nextMethod: LoginMethod) => {
    setValue('loginMethod', nextMethod, { shouldDirty: true, shouldTouch: true });
    clearErrors();
  };

  const onValidSubmit = async (values: LoginFormValues) => {
    const userId = values.loginMethod === 'login-id' ? values.loginId : `${values.branchNumber}-${values.accountNumber}`;
    await apiClient.auth.login({
      loginMethod: values.loginMethod,
      userId,
    });
    await trackAuditEvent({
      actorType: 'guest',
      eventType: 'login_success',
      maskedPayload: createMaskedPayload(
        {
          accountNumber: values.accountNumber,
          branchNumber: values.branchNumber,
          loginId: values.loginId,
          loginMethod: values.loginMethod,
        },
        {
          accountNumber: maskAccountNumber,
          loginId: maskLoginId,
        },
      ),
      screen: 'login',
    });

    onLogin();
  };

  return (
    <ScreenFrame title='ログイン' stage='login'>
      <div className='flex-1 px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8'>
        <div className='space-y-5 xl:grid xl:grid-cols-[minmax(0,1.12fr)_minmax(260px,0.88fr)] xl:items-start xl:gap-5 xl:space-y-0'>
          <ContentCard className='space-y-6'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <SectionLabel>ログイン</SectionLabel>
              </div>
              <span className='hidden shrink-0 self-start items-center justify-center rounded-full bg-[rgba(162,133,86,0.12)] px-3 py-1 text-[12px] font-semibold leading-none tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)] whitespace-nowrap sm:inline-flex'>
                個人・法人共通
              </span>
            </div>

            <form className='space-y-5' onSubmit={handleSubmit(onValidSubmit)} noValidate>
              <Tabs value={loginMethod} onValueChange={(value) => handleLoginMethodChange(value as LoginMethod)} className='space-y-5'>
                <TabsList className='grid h-auto w-full grid-cols-2 rounded-[12px] bg-[#f4efe6] p-1.5'>
                  <TabsTrigger
                    value='login-id'
                    className='rounded-[10px] px-4 py-3 text-[15px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)] data-[state=active]:bg-[linear-gradient(135deg,#ba9a62_0%,#a28556_100%)] data-[state=active]:text-white data-[state=active]:shadow-[0_10px_24px_rgba(162,133,86,0.24)]'
                  >
                    ログインID
                  </TabsTrigger>
                  <TabsTrigger
                    value='account'
                    className='rounded-[10px] px-4 py-3 text-[15px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)] data-[state=active]:bg-[linear-gradient(135deg,#ba9a62_0%,#a28556_100%)] data-[state=active]:text-white data-[state=active]:shadow-[0_10px_24px_rgba(162,133,86,0.24)]'
                  >
                    口座情報
                  </TabsTrigger>
                </TabsList>

                <TabsContent value='login-id' className='mt-0 space-y-5'>
                  <TextField
                    label='ログインID'
                    autoComplete='username'
                    error={toErrorMessage(errors.loginId?.message)}
                    placeholder='例：login001'
                    value={loginIdValue}
                    onChange={(value) => updateField('loginId', value)}
                  />

                  <TextField
                    label='パスワード'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    error={toErrorMessage(errors.loginIdPassword?.message)}
                    placeholder='*************'
                    value={watch('loginIdPassword')}
                    onChange={(value) => updateField('loginIdPassword', value)}
                    onPaste={preventSensitivePaste}
                    trailing={passwordToggle}
                  />
                </TabsContent>

                <TabsContent value='account' className='mt-0 space-y-5'>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <TextField
                      label='部店番号'
                      error={toErrorMessage(errors.branchNumber?.message)}
                      inputMode='numeric'
                      maxLength={3}
                      placeholder='123'
                      value={branchNumberValue}
                      onChange={(value) => updateField('branchNumber', normalizeDigits(value, 3))}
                    />
                    <TextField
                      label='口座番号'
                      error={toErrorMessage(errors.accountNumber?.message)}
                      inputMode='numeric'
                      maxLength={6}
                      placeholder='123456'
                      value={accountNumberValue}
                      onChange={(value) => updateField('accountNumber', normalizeDigits(value, 6))}
                    />
                  </div>

                  <TextField
                    label='パスワード'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    error={toErrorMessage(errors.accountPassword?.message)}
                    placeholder='*************'
                    value={watch('accountPassword')}
                    onChange={(value) => updateField('accountPassword', value)}
                    onPaste={preventSensitivePaste}
                    trailing={passwordToggle}
                  />
                </TabsContent>
              </Tabs>

              <FormErrorSummary errors={formErrorMessages} />

              <div className='space-y-3'>
                <PrimaryButton type='submit' disabled={isSubmitting} data-node-id='35610:66691'>
                  ログイン
                </PrimaryButton>
                <SecondaryButton type='button' onClick={onStartMemberRegistration}>
                  会員登録を始める
                </SecondaryButton>
              </div>
            </form>
          </ContentCard>

          <div className='space-y-5'>
            <ContentCard className='space-y-5'>
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <SectionLabel>法人のお客様</SectionLabel>
                  <p className='mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
                    法人口座のご利用開始や、新規のお手続きに進む方向けのご案内です。ログイン自体は個人のお客様と同じく、左側の共通ログイン欄を使います。
                  </p>
                </div>
                <span className='inline-flex shrink-0 self-start items-center justify-center rounded-full bg-[rgba(162,133,86,0.12)] px-3 py-1 text-[12px] font-semibold leading-none tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)] whitespace-nowrap'>
                  法人向け
                </span>
              </div>

              <Button
                type='button'
                onClick={onShowIntro}
                className='h-12 w-full rounded-[12px] border border-[rgba(33,33,33,0.08)] bg-white text-[15px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-gold-soft)] shadow-[0_10px_26px_rgba(13,10,44,0.08)] hover:bg-[rgba(111,91,59,0.04)]'
              >
                法人向けの初期設定へ
              </Button>
            </ContentCard>

            <HintCard title='サポート'>
              <button type='button' className='border-b border-[#0000ff] pb-0.5 text-[15px] font-bold tracking-[0.04em] text-[#0000ff]'>
                パスワードをお忘れの方はこちらへ
              </button>
              <p className='mt-3'>
                個人・法人ともにログインは左の共通フォームから進みます。法人のお客様向けの確認事項は上の「法人向けの初期設定へ」から確認できます。
              </p>
            </HintCard>

            <HintCard title='用語補助'>
              <ul className='space-y-1'>
                {glossaryNotes.map((note) => (
                  <li key={note}>・{note}</li>
                ))}
              </ul>
            </HintCard>

            <HintCard title='セキュリティ'>
              <div className='flex items-start gap-2'>
                <ShieldCheck className='mt-0.5 h-4 w-4 shrink-0 text-[var(--ichiyoshi-gold-soft)]' />
                <p>パスワード欄では貼り付けを無効化し、入力情報の保護を強化しています。</p>
              </div>
            </HintCard>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}
