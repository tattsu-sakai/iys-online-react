import { useMemo, useRef, useState } from 'react';
import { Menu, Search } from 'lucide-react';

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

type CustomerBankChangeScreenProps = {
  onBackToCustomerInfo: () => void;
  onBackToTop: () => void;
  onLogout: () => void;
  onOpenApplications: () => void;
  onOpenPortfolioAssets: (tab?: AssetTabKey) => void;
  onOpenTradeHistory: () => void;
};

type BankEditorTarget = 'primary' | 'secondary';
type SecondBankAction = 'delete' | 'register';
type Step = 'confirm' | 'edit';
type TransferMethod = 'none' | 'primary' | 'secondary';
type ValidationErrors = {
  accountNumber?: string;
  branch?: string;
  customBank?: string;
  yuchoNumber?: string;
  yuchoSymbol?: string;
};

const bankOptions = ['ゆうちょ銀行', 'みずほ銀行', '三菱UFJ銀行', '三井住友銀行', 'りそな銀行', 'その他の銀行'] as const;
const customBankCandidates = ['あおぞら銀行', 'イオン銀行', 'SBI新生銀行', '楽天銀行', '住信SBIネット銀行'];
const branchCandidates = ['青山支店', '赤坂支店', '上前津支店', '新宿支店', '中央支店'];
const accountTypeOptions = ['普通預金', '当座預金', '貯蓄預金'] as const;

type BankOption = (typeof bankOptions)[number];
type AccountType = (typeof accountTypeOptions)[number];

type BankRecord = {
  accountNumber: string;
  accountType: AccountType;
  bankName: string;
  branch: string;
  type: 'regular' | 'yucho';
  yuchoNumber: string;
  yuchoSymbol: string;
};

function toAccountDigits(accountNumber: string) {
  const safe = accountNumber.replace(/\D/g, '').slice(0, 7);
  return Array.from({ length: 7 }, (_, index) => safe[index] ?? '');
}

function maskRegularAccountNumber(accountNumber: string) {
  if (!accountNumber) {
    return '未入力';
  }

  return `${accountNumber.slice(0, 4)}***`;
}

function maskYuchoNumber(number: string) {
  if (!number) {
    return '未入力';
  }

  return `${number.slice(0, 4)}***`;
}

function resolveBankName(selectedBank: BankOption, selectedCustomBank: string) {
  if (selectedBank === 'ゆうちょ銀行') {
    return 'ゆうちょ銀行総合口座';
  }

  if (selectedBank === 'その他の銀行') {
    return selectedCustomBank.trim();
  }

  return selectedBank;
}

function isPresetBankName(bankName: string) {
  return bankOptions.some((option) => option === bankName);
}

function toBankSummaryLines(record: BankRecord | null) {
  if (!record) {
    return ['-'];
  }

  if (record.type === 'yucho') {
    return [record.bankName, `記号 ${record.yuchoSymbol || '未入力'} 番号 ${maskYuchoNumber(record.yuchoNumber)}`];
  }

  return [record.bankName, `${record.branch || '支店未選択'} ${record.accountType} ${maskRegularAccountNumber(record.accountNumber)}`];
}

function toBankSummaryText(record: BankRecord | null) {
  return toBankSummaryLines(record).join(' ');
}

export default function CustomerBankChangeScreen({
  onBackToCustomerInfo,
  onBackToTop,
  onLogout,
  onOpenApplications,
  onOpenPortfolioAssets,
  onOpenTradeHistory,
}: CustomerBankChangeScreenProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState<Step>('edit');
  const [editingTarget, setEditingTarget] = useState<BankEditorTarget>('secondary');
  const [secondBankAction, setSecondBankAction] = useState<SecondBankAction>('register');
  const [selectedBank, setSelectedBank] = useState<BankOption>('みずほ銀行');
  const [bankSearchKeyword, setBankSearchKeyword] = useState('');
  const [customBankResults, setCustomBankResults] = useState<string[]>([]);
  const [selectedCustomBank, setSelectedCustomBank] = useState('');
  const [branchSearchKeyword, setBranchSearchKeyword] = useState('');
  const [branchResults, setBranchResults] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('普通預金');
  const [accountDigits, setAccountDigits] = useState<string[]>(Array.from({ length: 7 }, () => ''));
  const [yuchoSymbol, setYuchoSymbol] = useState('');
  const [yuchoNumber, setYuchoNumber] = useState('');
  const [transferMethod, setTransferMethod] = useState<TransferMethod>('primary');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [primaryBank, setPrimaryBank] = useState<BankRecord>({
    accountNumber: '',
    accountType: '普通預金',
    bankName: 'ゆうちょ銀行総合口座',
    branch: '',
    type: 'yucho',
    yuchoNumber: '1234567',
    yuchoSymbol: '11230',
  });
  const [secondaryBank, setSecondaryBank] = useState<BankRecord | null>(null);

  const digitRefs = useRef<Array<HTMLInputElement | null>>([]);

  const quickAccessItems = createQuickAccessItems({
    activeKey: 'customerInfo',
    handlers: {
      applications: onOpenApplications,
      portfolioAssets: () => onOpenPortfolioAssets(),
      tradeHistory: onOpenTradeHistory,
    },
  });

  const isEditingPrimary = editingTarget === 'primary';
  const isRegisterFlow = isEditingPrimary || secondBankAction === 'register';
  const isCustomBankSelected = selectedBank === 'その他の銀行';
  const isYuchoBankSelected = selectedBank === 'ゆうちょ銀行';
  const accountNumber = accountDigits.join('');

  const applyRecordToDraft = (record: BankRecord | null) => {
    if (!record) {
      setSelectedBank('みずほ銀行');
      setSelectedCustomBank('');
      setSelectedBranch('');
      setAccountType('普通預金');
      setAccountDigits(Array.from({ length: 7 }, () => ''));
      setYuchoSymbol('');
      setYuchoNumber('');
      setBankSearchKeyword('');
      setBranchSearchKeyword('');
      setCustomBankResults([]);
      setBranchResults([]);
      setErrors({});
      return;
    }

    if (record.type === 'yucho') {
      setSelectedBank('ゆうちょ銀行');
      setSelectedCustomBank('');
      setSelectedBranch('');
      setAccountType(record.accountType);
      setAccountDigits(Array.from({ length: 7 }, () => ''));
      setYuchoSymbol(record.yuchoSymbol);
      setYuchoNumber(record.yuchoNumber);
    } else {
      if (isPresetBankName(record.bankName) && record.bankName !== 'その他の銀行') {
        setSelectedBank(record.bankName as BankOption);
        setSelectedCustomBank('');
      } else {
        setSelectedBank('その他の銀行');
        setSelectedCustomBank(record.bankName);
      }
      setSelectedBranch(record.branch);
      setAccountType(record.accountType);
      setAccountDigits(toAccountDigits(record.accountNumber));
      setYuchoSymbol('');
      setYuchoNumber('');
    }

    setBankSearchKeyword('');
    setBranchSearchKeyword('');
    setCustomBankResults([]);
    setBranchResults([]);
    setErrors({});
  };

  const handleSelectTarget = (target: BankEditorTarget) => {
    setStep('edit');
    setSubmitted(false);
    setEditingTarget(target);

    if (target === 'primary') {
      setSecondBankAction('register');
      applyRecordToDraft(primaryBank);
      return;
    }

    setSecondBankAction('register');
    applyRecordToDraft(secondaryBank);
  };

  const handleSecondActionChange = (action: SecondBankAction) => {
    setSecondBankAction(action);
    setStep('edit');
    setSubmitted(false);
    setErrors({});

    if (action === 'register') {
      applyRecordToDraft(secondaryBank);
      return;
    }

    if (transferMethod === 'secondary') {
      setTransferMethod('primary');
    }
  };

  const draftBankName = resolveBankName(selectedBank, selectedCustomBank);

  const draftRecord = useMemo<BankRecord | null>(() => {
    if (!isRegisterFlow) {
      return null;
    }

    if (isYuchoBankSelected) {
      return {
        accountNumber: '',
        accountType: '普通預金',
        bankName: draftBankName || 'ゆうちょ銀行総合口座',
        branch: '',
        type: 'yucho',
        yuchoNumber: yuchoNumber.trim(),
        yuchoSymbol: yuchoSymbol.trim(),
      };
    }

    return {
      accountNumber,
      accountType,
      bankName: draftBankName,
      branch: selectedBranch,
      type: 'regular',
      yuchoNumber: '',
      yuchoSymbol: '',
    };
  }, [accountNumber, accountType, draftBankName, isRegisterFlow, isYuchoBankSelected, selectedBranch, yuchoNumber, yuchoSymbol]);

  const canProceedToConfirm = useMemo(() => {
    if (!isRegisterFlow) {
      return true;
    }

    if (!draftBankName) {
      return false;
    }

    if (isYuchoBankSelected) {
      return /^\d{5}$/.test(yuchoSymbol) && /^\d{1,8}$/.test(yuchoNumber);
    }

    const hasAllDigits = accountDigits.every((digit) => /^\d$/.test(digit));
    return Boolean(selectedBranch && hasAllDigits);
  }, [accountDigits, draftBankName, isRegisterFlow, isYuchoBankSelected, selectedBranch, yuchoNumber, yuchoSymbol]);

  const transferMethodLabel =
    transferMethod === 'primary'
      ? '振込先金融機関①へ送金を希望する'
      : transferMethod === 'secondary'
        ? '振込先金融機関②へ送金を希望する'
        : '登録しない';

  const confirmTargetLabel = isEditingPrimary ? '振込先金融機関①' : '振込先金融機関②';
  const confirmBankSummary = !isRegisterFlow ? '削除' : toBankSummaryText(draftRecord);

  const validateForm = () => {
    if (!isRegisterFlow) {
      setErrors({});
      return true;
    }

    const nextErrors: ValidationErrors = {};

    if (isCustomBankSelected && !selectedCustomBank.trim()) {
      nextErrors.customBank = '金融機関名を選択してください。';
    }

    if (!draftBankName) {
      nextErrors.customBank = '金融機関名を選択してください。';
    }

    if (isYuchoBankSelected) {
      if (!/^\d{5}$/.test(yuchoSymbol)) {
        nextErrors.yuchoSymbol = '記号は5桁の数字で入力してください。';
      }
      if (!/^\d{1,8}$/.test(yuchoNumber)) {
        nextErrors.yuchoNumber = '番号は1〜8桁の数字で入力してください。';
      }
    } else {
      if (!selectedBranch) {
        nextErrors.branch = '支店名を選択してください。';
      }
      if (!accountDigits.every((digit) => /^\d$/.test(digit))) {
        nextErrors.accountNumber = '口座番号は7桁の数字で入力してください。';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSearchBanks = () => {
    if (!bankSearchKeyword.trim()) {
      setCustomBankResults(customBankCandidates);
      return;
    }

    const keyword = bankSearchKeyword.trim().toLowerCase();
    setCustomBankResults(customBankCandidates.filter((candidate) => candidate.toLowerCase().includes(keyword)));
  };

  const handleSearchBranches = () => {
    if (!branchSearchKeyword.trim()) {
      setBranchResults(branchCandidates);
      return;
    }

    const keyword = branchSearchKeyword.trim().toLowerCase();
    setBranchResults(branchCandidates.filter((candidate) => candidate.toLowerCase().includes(keyword)));
  };

  const handleAccountDigitChange = (index: number, value: string) => {
    const safeValue = value.replace(/\D/g, '').slice(-1);

    setAccountDigits((current) => {
      const next = [...current];
      next[index] = safeValue;
      return next;
    });
    setErrors((current) => ({ ...current, accountNumber: undefined }));

    if (safeValue && digitRefs.current[index + 1]) {
      digitRefs.current[index + 1]?.focus();
    }
  };

  const handleMoveToConfirm = () => {
    setSubmitted(false);

    if (!validateForm()) {
      return;
    }

    setStep('confirm');
  };

  const handleComplete = async () => {
    if (isRegisterFlow && draftRecord) {
      if (isEditingPrimary) {
        setPrimaryBank(draftRecord);
      } else {
        setSecondaryBank(draftRecord);
      }
    } else if (!isEditingPrimary) {
      setSecondaryBank(null);
      if (transferMethod === 'secondary') {
        setTransferMethod('primary');
      }
    }

    await apiClient.customerInfo.submitBankChange({
      action: isRegisterFlow ? 'register' : 'delete',
      target: editingTarget,
    });
    await trackAuditEvent({
      actorType: 'authenticated_user',
      eventType: 'customer_info_submit',
      maskedPayload: {
        action: 'bank-change',
        operation: isRegisterFlow ? 'register' : 'delete',
        target: editingTarget,
      },
      screen: 'customerInfoBankChange',
    });

    setSubmitted(true);
  };

  const primarySummaryLines = toBankSummaryLines(primaryBank);
  const secondarySummaryLines = toBankSummaryLines(secondaryBank);

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
                  badge='お客様情報 / 振込先等変更'
                  description='振込先金融機関①・②を変更できます。振込先金融機関②でゆうちょ銀行を選択した場合は、記号と番号のみ入力できます。'
                  pretitle='TOP / お届出事項変更・追加申請'
                  title={step === 'edit' ? '振込先等変更' : '入力内容のご確認'}
                />
              </ServiceScreenHeader>

              <QuickAccessBar actions={quickAccessItems} containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <div className='px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8'>
                <div className='grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
                  <div className='space-y-4'>
                    <ContentCard className='space-y-5'>
                      <p className='text-[15px] leading-8 tracking-[0.02em] text-[var(--ichiyoshi-navy)]'>
                        現在ご登録されている振込先金融機関は以下の通りです。
                        <br />
                        ※振込先金融機関①は変更可能です（削除はできません）。
                      </p>

                      <article className='space-y-3 rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] p-4'>
                        <div className='rounded-[8px] bg-[var(--ichiyoshi-section)] px-3 py-2 text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                          振込先金融機関①
                        </div>
                        <div className='space-y-1'>
                          {primarySummaryLines.map((line, index) => (
                            <p
                              key={`primary-line-${index}`}
                              className={cn(
                                'tracking-[0.03em] text-[var(--ichiyoshi-navy)]',
                                index === 0 ? 'text-[20px] font-bold' : 'text-[17px] font-bold',
                              )}
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                        <SecondaryButton
                          type='button'
                          onClick={() => handleSelectTarget('primary')}
                          className='h-10 rounded-[8px] text-[14px] tracking-[0.03em]'
                        >
                          変更する
                        </SecondaryButton>
                      </article>

                      <article className='space-y-3 rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] p-4'>
                        <div className='rounded-[8px] bg-[var(--ichiyoshi-section)] px-3 py-2 text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                          振込先金融機関②
                        </div>
                        <div className='space-y-1'>
                          {secondarySummaryLines.map((line, index) => (
                            <p
                              key={`secondary-line-${index}`}
                              className={cn(
                                'tracking-[0.03em] text-[var(--ichiyoshi-navy)]',
                                index === 0 ? 'text-[20px] font-bold' : 'text-[17px] font-bold',
                              )}
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                        <div className='grid gap-2 sm:grid-cols-2'>
                          <SecondaryButton
                            type='button'
                            onClick={() => handleSelectTarget('secondary')}
                            className='h-10 rounded-[8px] text-[14px] tracking-[0.03em]'
                          >
                            {secondaryBank ? '変更する' : '新規登録する'}
                          </SecondaryButton>
                          <SecondaryButton
                            type='button'
                            onClick={() => {
                              setEditingTarget('secondary');
                              handleSecondActionChange('delete');
                            }}
                            className='h-10 rounded-[8px] text-[14px] tracking-[0.03em]'
                          >
                            削除する
                          </SecondaryButton>
                        </div>
                      </article>
                    </ContentCard>

                    {step === 'edit' ? (
                      <ContentCard className='space-y-6'>
                        <section className='space-y-3'>
                          <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2 text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                            変更対象
                          </div>
                          <div className='grid gap-2 sm:grid-cols-2'>
                            <button
                              type='button'
                              onClick={() => handleSelectTarget('primary')}
                              className={cn(
                                'rounded-[10px] border px-4 py-3 text-left text-[14px] font-semibold tracking-[0.03em] transition-colors',
                                editingTarget === 'primary'
                                  ? 'border-[rgba(111,91,59,0.24)] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-navy)]'
                                  : 'border-[rgba(5,32,49,0.08)] bg-white text-[var(--ichiyoshi-ink-soft)]',
                              )}
                            >
                              振込先金融機関①
                            </button>
                            <button
                              type='button'
                              onClick={() => handleSelectTarget('secondary')}
                              className={cn(
                                'rounded-[10px] border px-4 py-3 text-left text-[14px] font-semibold tracking-[0.03em] transition-colors',
                                editingTarget === 'secondary'
                                  ? 'border-[rgba(111,91,59,0.24)] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-navy)]'
                                  : 'border-[rgba(5,32,49,0.08)] bg-white text-[var(--ichiyoshi-ink-soft)]',
                              )}
                            >
                              振込先金融機関②
                            </button>
                          </div>
                        </section>

                        {!isEditingPrimary ? (
                          <section className='space-y-3'>
                            <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2 text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                              振込先金融機関②の操作
                            </div>
                            <div className='grid gap-2 sm:grid-cols-2'>
                              <button
                                type='button'
                                onClick={() => handleSecondActionChange('register')}
                                className={cn(
                                  'rounded-[10px] border px-4 py-3 text-left text-[14px] font-semibold tracking-[0.03em] transition-colors',
                                  secondBankAction === 'register'
                                    ? 'border-[rgba(111,91,59,0.24)] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-navy)]'
                                    : 'border-[rgba(5,32,49,0.08)] bg-white text-[var(--ichiyoshi-ink-soft)]',
                                )}
                              >
                                変更 / 新規登録する
                              </button>
                              <button
                                type='button'
                                onClick={() => handleSecondActionChange('delete')}
                                className={cn(
                                  'rounded-[10px] border px-4 py-3 text-left text-[14px] font-semibold tracking-[0.03em] transition-colors',
                                  secondBankAction === 'delete'
                                    ? 'border-[rgba(111,91,59,0.24)] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-navy)]'
                                    : 'border-[rgba(5,32,49,0.08)] bg-white text-[var(--ichiyoshi-ink-soft)]',
                                )}
                              >
                                削除する
                              </button>
                            </div>
                          </section>
                        ) : null}

                        {isRegisterFlow ? (
                          <>
                            <section className='space-y-4'>
                              <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2 text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                                金融機関名
                              </div>
                              <div className='grid gap-2 sm:grid-cols-2'>
                                {bankOptions.map((option) => (
                                  <button
                                    key={option}
                                    type='button'
                                    onClick={() => {
                                      setSelectedBank(option);
                                      setErrors((current) => ({ ...current, customBank: undefined, branch: undefined, accountNumber: undefined, yuchoNumber: undefined, yuchoSymbol: undefined }));

                                      if (option !== 'その他の銀行') {
                                        setSelectedCustomBank('');
                                        setCustomBankResults([]);
                                      }
                                      if (option !== 'ゆうちょ銀行') {
                                        setYuchoSymbol('');
                                        setYuchoNumber('');
                                      } else {
                                        setSelectedBranch('');
                                        setAccountDigits(Array.from({ length: 7 }, () => ''));
                                      }
                                    }}
                                    className={cn(
                                      'rounded-[10px] border px-4 py-3 text-left text-[14px] font-semibold tracking-[0.03em] transition-colors',
                                      selectedBank === option
                                        ? 'border-[rgba(111,91,59,0.24)] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-navy)]'
                                        : 'border-[rgba(5,32,49,0.08)] bg-white text-[var(--ichiyoshi-ink-soft)] hover:bg-[rgba(5,32,49,0.03)]',
                                    )}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>

                              {isCustomBankSelected ? (
                                <div className='space-y-3 rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] p-4'>
                                  <p className='text-[13px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>
                                    金融機関名の頭文字（ひらがな1文字）を入力して検索してください。
                                  </p>
                                  <div className='grid gap-2 sm:grid-cols-[minmax(0,1fr)_92px]'>
                                    <Input
                                      value={bankSearchKeyword}
                                      onChange={(event) => setBankSearchKeyword(event.target.value)}
                                      placeholder='例：あ'
                                      className='h-11 rounded-[8px] border-[rgba(5,32,49,0.12)] bg-white'
                                    />
                                    <SecondaryButton
                                      type='button'
                                      onClick={handleSearchBanks}
                                      className='h-11 rounded-[8px] text-[14px] tracking-[0.03em]'
                                    >
                                      <Search className='h-4 w-4' />
                                      検索
                                    </SecondaryButton>
                                  </div>
                                  <select
                                    value={selectedCustomBank}
                                    onChange={(event) => {
                                      setSelectedCustomBank(event.target.value);
                                      setErrors((current) => ({ ...current, customBank: undefined }));
                                    }}
                                    className='h-11 w-full rounded-[8px] border border-[rgba(5,32,49,0.12)] bg-white px-3 text-[15px] font-semibold text-[var(--ichiyoshi-navy)]'
                                  >
                                    <option value=''>金融機関を選択</option>
                                    {customBankResults.map((bankName) => (
                                      <option key={bankName} value={bankName}>
                                        {bankName}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.customBank ? <p className='text-[12px] text-[var(--ichiyoshi-error)]'>{errors.customBank}</p> : null}
                                </div>
                              ) : null}
                            </section>

                            {!isYuchoBankSelected ? (
                              <>
                                <section className='space-y-4'>
                                  <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2 text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                                    支店名
                                  </div>
                                  <p className='text-[13px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>
                                    支店名の頭文字（ひらがなまたは英字1文字）を入力して「検索」ボタンより支店を選択してください。
                                  </p>
                                  <div className='grid gap-2 sm:grid-cols-[minmax(0,1fr)_92px]'>
                                    <Input
                                      value={branchSearchKeyword}
                                      onChange={(event) => setBranchSearchKeyword(event.target.value)}
                                      placeholder='例：あ'
                                      className='h-11 rounded-[8px] border-[rgba(5,32,49,0.12)] bg-white'
                                    />
                                    <SecondaryButton
                                      type='button'
                                      onClick={handleSearchBranches}
                                      className='h-11 rounded-[8px] text-[14px] tracking-[0.03em]'
                                    >
                                      <Search className='h-4 w-4' />
                                      検索
                                    </SecondaryButton>
                                  </div>
                                  <select
                                    value={selectedBranch}
                                    onChange={(event) => {
                                      setSelectedBranch(event.target.value);
                                      setErrors((current) => ({ ...current, branch: undefined }));
                                    }}
                                    className='h-11 w-full rounded-[8px] border border-[rgba(5,32,49,0.12)] bg-white px-3 text-[15px] font-semibold text-[var(--ichiyoshi-navy)]'
                                  >
                                    <option value=''>支店を選択</option>
                                    {branchResults.map((branchName) => (
                                      <option key={branchName} value={branchName}>
                                        {branchName}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.branch ? <p className='text-[12px] text-[var(--ichiyoshi-error)]'>{errors.branch}</p> : null}
                                </section>

                                <section className='space-y-4'>
                                  <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2 text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                                    預金種別・口座番号
                                  </div>
                                  <select
                                    value={accountType}
                                    onChange={(event) => setAccountType(event.target.value as AccountType)}
                                    className='h-11 w-full rounded-[8px] border border-[rgba(5,32,49,0.12)] bg-white px-3 text-[15px] font-semibold text-[var(--ichiyoshi-navy)]'
                                  >
                                    {accountTypeOptions.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>

                                  <div className='space-y-2'>
                                    <p className='text-[14px] font-medium tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>口座番号</p>
                                    <div className='flex flex-wrap gap-2'>
                                      {accountDigits.map((digit, index) => (
                                        <Input
                                          key={`digit-${index}`}
                                          ref={(element) => {
                                            digitRefs.current[index] = element;
                                          }}
                                          value={digit}
                                          onChange={(event) => handleAccountDigitChange(index, event.target.value)}
                                          inputMode='numeric'
                                          maxLength={1}
                                          className='h-11 w-10 rounded-[8px] border-[rgba(5,32,49,0.12)] bg-white px-0 text-center text-[18px] font-bold tracking-[0.08em] text-[var(--ichiyoshi-navy)]'
                                        />
                                      ))}
                                    </div>
                                    <p className='text-[12px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>
                                      ※口座番号が7桁未満の場合は先頭に「0」を追加して7桁にしてください。
                                    </p>
                                    {errors.accountNumber ? <p className='text-[12px] text-[var(--ichiyoshi-error)]'>{errors.accountNumber}</p> : null}
                                  </div>
                                </section>
                              </>
                            ) : (
                              <section className='space-y-4'>
                                <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2 text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                                  記号・番号（ゆうちょ銀行）
                                </div>
                                <p className='text-[13px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>
                                  ゆうちょ銀行を選択した場合は、支店名や預金種別ではなく記号と番号を入力してください。
                                </p>
                                <div className='grid gap-3 sm:grid-cols-2'>
                                  <label className='space-y-2'>
                                    <span className='text-[14px] font-medium tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>記号（5桁）</span>
                                    <Input
                                      value={yuchoSymbol}
                                      onChange={(event) => {
                                        setYuchoSymbol(event.target.value.replace(/\D/g, '').slice(0, 5));
                                        setErrors((current) => ({ ...current, yuchoSymbol: undefined }));
                                      }}
                                      inputMode='numeric'
                                      placeholder='例：11230'
                                      className='h-11 rounded-[8px] border-[rgba(5,32,49,0.12)] bg-white text-[16px] font-semibold tracking-[0.08em]'
                                    />
                                    {errors.yuchoSymbol ? <p className='text-[12px] text-[var(--ichiyoshi-error)]'>{errors.yuchoSymbol}</p> : null}
                                  </label>
                                  <label className='space-y-2'>
                                    <span className='text-[14px] font-medium tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>番号（1〜8桁）</span>
                                    <Input
                                      value={yuchoNumber}
                                      onChange={(event) => {
                                        setYuchoNumber(event.target.value.replace(/\D/g, '').slice(0, 8));
                                        setErrors((current) => ({ ...current, yuchoNumber: undefined }));
                                      }}
                                      inputMode='numeric'
                                      placeholder='例：1234567'
                                      className='h-11 rounded-[8px] border-[rgba(5,32,49,0.12)] bg-white text-[16px] font-semibold tracking-[0.08em]'
                                    />
                                    {errors.yuchoNumber ? <p className='text-[12px] text-[var(--ichiyoshi-error)]'>{errors.yuchoNumber}</p> : null}
                                  </label>
                                </div>
                              </section>
                            )}
                          </>
                        ) : (
                          <div className='rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] p-4 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
                            振込先金融機関②は削除として確認画面に進みます。
                          </div>
                        )}

                        <section className='space-y-3'>
                          <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2 text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                            利金・収益金等の受取方法
                          </div>
                          <div className='grid gap-2'>
                            {[
                              { key: 'primary', label: '振込先金融機関①へ送金を希望する' },
                              { key: 'secondary', label: '振込先金融機関②へ送金を希望する' },
                              { key: 'none', label: '登録しない' },
                            ].map((option) => (
                              <button
                                key={option.key}
                                type='button'
                                onClick={() => setTransferMethod(option.key as TransferMethod)}
                                disabled={option.key === 'secondary' && !secondaryBank && !(editingTarget === 'secondary' && isRegisterFlow)}
                                className={cn(
                                  'rounded-[10px] border px-4 py-3 text-left text-[14px] font-semibold tracking-[0.03em] transition-colors',
                                  transferMethod === option.key
                                    ? 'border-[rgba(111,91,59,0.24)] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-navy)]'
                                    : 'border-[rgba(5,32,49,0.08)] bg-white text-[var(--ichiyoshi-ink-soft)]',
                                  option.key === 'secondary' && !secondaryBank && !(editingTarget === 'secondary' && isRegisterFlow)
                                    ? 'cursor-not-allowed opacity-60'
                                    : '',
                                )}
                              >
                                {option.label}
                              </button>
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
                            onClick={handleMoveToConfirm}
                            disabled={!canProceedToConfirm}
                            className='h-12 rounded-[10px] text-[16px] tracking-[0.04em]'
                          >
                            変更内容を確認する
                          </PrimaryButton>
                        </div>
                      </ContentCard>
                    ) : (
                      <ContentCard className='space-y-6'>
                        <p className='text-[16px] leading-8 tracking-[0.02em] text-[var(--ichiyoshi-navy)]'>
                          この内容でよろしければ、「手続き完了」ボタンを押してください。
                        </p>

                        <section className='space-y-4'>
                          <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2 text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                            {confirmTargetLabel}
                          </div>
                          <div className='rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-3'>
                            <p className='text-[18px] font-bold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>{confirmBankSummary}</p>
                          </div>
                        </section>

                        <section className='space-y-4'>
                          <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2 text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
                            利金・収益金等の受取方法
                          </div>
                          <div className='rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-3'>
                            <p className='text-[18px] font-bold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>{transferMethodLabel}</p>
                          </div>
                        </section>

                        {submitted ? (
                          <div className='rounded-[10px] border border-[rgba(80,122,231,0.22)] bg-[rgba(80,122,231,0.08)] px-4 py-3 text-[14px] leading-7 text-[var(--ichiyoshi-navy)]'>
                            振込先等変更の手続きを受け付けました。反映後にお知らせします。
                          </div>
                        ) : null}

                        <div className='grid gap-3 sm:grid-cols-2'>
                          <SecondaryButton
                            type='button'
                            onClick={() => setStep('edit')}
                            className='h-12 rounded-[10px] text-[16px] tracking-[0.04em]'
                          >
                            修正する
                          </SecondaryButton>
                          <PrimaryButton
                            type='button'
                            onClick={handleComplete}
                            className='h-12 rounded-[10px] text-[16px] tracking-[0.04em]'
                          >
                            手続き完了
                          </PrimaryButton>
                        </div>

                        <SecondaryButton
                          type='button'
                          onClick={onBackToCustomerInfo}
                          className='h-12 rounded-[10px] text-[16px] tracking-[0.04em]'
                        >
                          1つ前へ戻る
                        </SecondaryButton>
                      </ContentCard>
                    )}
                  </div>

                  <div className='space-y-4 xl:sticky xl:top-6'>
                    <ContentCard className='space-y-4'>
                      <div>
                        <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>Status</p>
                        <h2 className='mt-2 text-[18px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>入力状況</h2>
                      </div>
                      <div className='space-y-2'>
                        <div className='rounded-[10px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-3'>
                          <p className='text-[12px] text-[var(--ichiyoshi-ink-soft)]'>振込先金融機関①</p>
                          <p className='mt-1 text-[14px] font-semibold text-[var(--ichiyoshi-navy)]'>{toBankSummaryText(primaryBank)}</p>
                        </div>
                        <div className='rounded-[10px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-3'>
                          <p className='text-[12px] text-[var(--ichiyoshi-ink-soft)]'>振込先金融機関②</p>
                          <p className='mt-1 text-[14px] font-semibold text-[var(--ichiyoshi-navy)]'>{toBankSummaryText(secondaryBank)}</p>
                        </div>
                        <div className='rounded-[10px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-3'>
                          <p className='text-[12px] text-[var(--ichiyoshi-ink-soft)]'>受取方法</p>
                          <p className='mt-1 text-[14px] font-semibold text-[var(--ichiyoshi-navy)]'>{transferMethodLabel}</p>
                        </div>
                        {step === 'confirm' ? (
                          <div className='rounded-[10px] border border-[rgba(80,122,231,0.25)] bg-[rgba(80,122,231,0.08)] px-4 py-3'>
                            <p className='text-[12px] text-[var(--ichiyoshi-ink-soft)]'>確認予定</p>
                            <p className='mt-1 text-[14px] font-semibold text-[var(--ichiyoshi-navy)]'>
                              {confirmTargetLabel}: {confirmBankSummary}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </ContentCard>

                    <ContentCard className='space-y-3'>
                      <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>Guide</p>
                      <div className='space-y-2 text-[13px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
                        <p>・振込先金融機関①は変更できますが、削除はできません。</p>
                        <p>・振込先金融機関②でゆうちょ銀行を選ぶと、記号と番号のみ入力します。</p>
                        <p>・内容確認後に「手続き完了」を押すと受付完了になります。</p>
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
                onOpenCustomerInfo={onBackToCustomerInfo}
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
