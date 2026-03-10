import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

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

type LoginScreenProps = {
  onLogin: () => void;
  onStartMemberRegistration: () => void;
  onShowIntro: () => void;
};

type LoginMethod = 'login-id' | 'account';
type LoginErrors = {
  accountNumber?: string;
  accountPassword?: string;
  branchNumber?: string;
  form?: string;
  loginId?: string;
  loginIdPassword?: string;
};

export default function LoginScreen({ onLogin, onStartMemberRegistration, onShowIntro }: LoginScreenProps) {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('login-id');
  const [loginId, setLoginId] = useState('');
  const [loginIdPassword, setLoginIdPassword] = useState('');
  const [branchNumber, setBranchNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);

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

  const clearError = (field: keyof LoginErrors) => {
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  };

  const handleSubmit = () => {
    const nextErrors: LoginErrors = {};

    if (loginMethod === 'login-id') {
      if (!loginId.trim()) {
        nextErrors.loginId = 'ログインIDを入力してください。';
      }

      if (!loginIdPassword.trim()) {
        nextErrors.loginIdPassword = 'パスワードを入力してください。';
      }
    } else {
      if (!branchNumber.trim()) {
        nextErrors.branchNumber = '部店番号を入力してください。';
      }

      if (!accountNumber.trim()) {
        nextErrors.accountNumber = '口座番号を入力してください。';
      }

      if (!accountPassword.trim()) {
        nextErrors.accountPassword = 'パスワードを入力してください。';
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors({
        ...nextErrors,
        form: '未入力の項目があります。赤字の案内に沿って入力してください。',
      });
      return;
    }

    setErrors({});
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

            <form
              className='space-y-5'
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
            >
              <Tabs
                value={loginMethod}
                onValueChange={(value) => {
                  setLoginMethod(value as LoginMethod);
                  setErrors({});
                }}
                className='space-y-5'
              >
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
                    error={errors.loginId}
                    placeholder='例：ichiyoshi001'
                    value={loginId}
                    onChange={(value) => {
                      clearError('loginId');
                      setLoginId(value);
                    }}
                  />

                  <TextField
                    label='パスワード'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    error={errors.loginIdPassword}
                    placeholder='*************'
                    value={loginIdPassword}
                    onChange={(value) => {
                      clearError('loginIdPassword');
                      setLoginIdPassword(value);
                    }}
                    trailing={passwordToggle}
                  />
                </TabsContent>

                <TabsContent value='account' className='mt-0 space-y-5'>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <TextField
                      label='部店番号'
                      error={errors.branchNumber}
                      inputMode='numeric'
                      maxLength={3}
                      placeholder='123'
                      value={branchNumber}
                      onChange={(value) => {
                        clearError('branchNumber');
                        setBranchNumber(value.replace(/\D/g, '').slice(0, 3));
                      }}
                    />
                    <TextField
                      label='口座番号'
                      error={errors.accountNumber}
                      inputMode='numeric'
                      maxLength={6}
                      placeholder='123456'
                      value={accountNumber}
                      onChange={(value) => {
                        clearError('accountNumber');
                        setAccountNumber(value.replace(/\D/g, '').slice(0, 6));
                      }}
                    />
                  </div>

                  <TextField
                    label='パスワード'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    error={errors.accountPassword}
                    placeholder='*************'
                    value={accountPassword}
                    onChange={(value) => {
                      clearError('accountPassword');
                      setAccountPassword(value);
                    }}
                    trailing={passwordToggle}
                  />
                </TabsContent>
              </Tabs>

              <div className='space-y-3'>
                <PrimaryButton type='submit' data-node-id='35610:66691'>
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
                個人・法人ともにログインは左の共通フォームから進みます。法人のお客様向けの確認事項は上の「法人向けのご案内を見る」から確認できます。
              </p>
            </HintCard>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}
