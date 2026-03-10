import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  tradeHistoryAccountOptions,
  tradeHistoryProductOptions,
  transactionCategoryOptions,
  type TradeHistoryAccountKey,
  type TradeHistoryFilters,
  type TradeHistoryProductKey,
  type TransactionCategoryKey,
} from '@/features/trade-history/model';
import { cn } from '@/lib/utils';

type TradeHistorySearchModalProps = {
  filters: TradeHistoryFilters;
  onChangeAccount: (value: TradeHistoryAccountKey) => void;
  onChangeProduct: (value: TradeHistoryProductKey) => void;
  onChangeTransaction: (value: TransactionCategoryKey) => void;
  onClose: () => void;
  onSearch: () => void;
  open: boolean;
};

function OptionButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-[12px] border px-4 py-2 text-left text-[14px] font-semibold tracking-[0.03em] transition-colors',
        active
          ? 'border-[rgba(111,91,59,0.18)] bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] text-white shadow-[0_12px_28px_rgba(95,69,35,0.2)]'
          : 'border-[rgba(5,32,49,0.08)] bg-white text-[var(--ichiyoshi-navy)] hover:bg-[rgba(111,91,59,0.05)]',
      )}
    >
      {children}
    </button>
  );
}

export default function TradeHistorySearchModal({
  filters,
  onChangeAccount,
  onChangeProduct,
  onChangeTransaction,
  onClose,
  onSearch,
  open,
}: TradeHistorySearchModalProps) {
  const titleId = useId();
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    selectRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className='fixed inset-0 z-[130] flex items-center justify-center p-4'>
      <button
        type='button'
        aria-label='検索モーダルを閉じる'
        className='absolute inset-0 bg-[rgba(10,16,22,0.42)] backdrop-blur-[3px]'
        onClick={onClose}
      />

      <section
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        className='relative z-10 w-full max-w-[30rem] overflow-hidden rounded-[18px] border border-[rgba(5,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(244,247,248,0.97))] shadow-[0_28px_70px_rgba(5,32,49,0.22)]'
      >
        <div className='flex items-center justify-between gap-3 border-b border-[rgba(5,32,49,0.08)] px-5 py-4'>
          <div>
            <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>
              詳細検索
            </p>
            <h2 id={titleId} className='mt-2 text-[24px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>
              取引履歴検索
            </h2>
          </div>

          <button
            type='button'
            aria-label='検索モーダルを閉じる'
            onClick={onClose}
            className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(5,32,49,0.08)] bg-white text-[var(--ichiyoshi-navy)] shadow-[0_10px_24px_rgba(5,32,49,0.06)] transition-colors hover:bg-[rgba(5,32,49,0.04)]'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <div className='max-h-[min(76vh,44rem)] space-y-6 overflow-y-auto px-5 py-5'>
          <section className='space-y-3'>
            <p className='inline-flex rounded-[8px] bg-[var(--ichiyoshi-navy)] px-4 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-white'>
              商品区分
            </p>
            <div className='relative'>
              <select
                ref={selectRef}
                value={filters.product}
                onChange={(event) => onChangeProduct(event.target.value as TradeHistoryProductKey)}
                className='h-12 w-full appearance-none rounded-[12px] border border-[rgba(5,32,49,0.1)] bg-white px-4 pr-12 text-[16px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)] shadow-[0_8px_18px_rgba(5,32,49,0.05)] outline-none transition-colors focus:border-[var(--ichiyoshi-gold-soft)] focus:ring-2 focus:ring-[rgba(162,133,86,0.16)]'
              >
                {tradeHistoryProductOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className='pointer-events-none absolute inset-y-0 right-4 flex items-center text-[var(--ichiyoshi-ink-soft)]'>
                <ChevronDown className='h-4 w-4' />
              </span>
            </div>
          </section>

          <section className='space-y-3'>
            <p className='inline-flex rounded-[8px] bg-[var(--ichiyoshi-navy)] px-4 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-white'>
              取引区分
            </p>
            <div className='grid gap-2 sm:grid-cols-2'>
              {transactionCategoryOptions.map((option) => (
                <OptionButton
                  key={option.key}
                  active={filters.transaction === option.key}
                  onClick={() => onChangeTransaction(option.key)}
                >
                  {option.label}
                </OptionButton>
              ))}
            </div>
          </section>

          <section className='space-y-3'>
            <p className='inline-flex rounded-[8px] bg-[var(--ichiyoshi-navy)] px-4 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-white'>
              預り区分
            </p>
            <div className='grid gap-2 sm:grid-cols-2'>
              {tradeHistoryAccountOptions.map((option) => (
                <OptionButton
                  key={option.key}
                  active={filters.account === option.key}
                  onClick={() => onChangeAccount(option.key)}
                >
                  {option.label}
                </OptionButton>
              ))}
            </div>
          </section>
        </div>

        <div className='border-t border-[rgba(5,32,49,0.08)] bg-[rgba(247,243,235,0.58)] px-5 py-4'>
          <div className='grid gap-3 sm:grid-cols-2'>
            <Button
              type='button'
              onClick={onSearch}
              className='h-12 rounded-[12px] bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] px-5 text-[15px] font-bold tracking-[0.08em] text-white shadow-[0_16px_36px_rgba(111,91,59,0.24)] hover:opacity-95'
            >
              <Search className='h-4 w-4' />
              検索
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='h-12 rounded-[12px] border-[rgba(5,32,49,0.08)] bg-white text-[15px] font-bold tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)] shadow-[0_10px_24px_rgba(5,32,49,0.06)] hover:bg-[rgba(111,91,59,0.04)]'
            >
              キャンセル
            </Button>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
