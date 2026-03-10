import { Clock3, ShieldCheck } from 'lucide-react';

import { cn } from '@/lib/utils';

type ImportantInfoPanelProps = {
  className?: string;
  notes: string[];
  reflectionTiming: string;
  referenceDate: string;
  title?: string;
  updatedAt?: string;
};

export default function ImportantInfoPanel({
  className,
  notes,
  reflectionTiming,
  referenceDate,
  title = '表示情報',
  updatedAt,
}: ImportantInfoPanelProps) {
  return (
    <section
      className={cn(
        'space-y-4 rounded-[14px] border border-[rgba(5,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,250,0.94))] p-4 shadow-[0_10px_24px_rgba(5,32,49,0.06)]',
        className,
      )}
    >
      <div className='flex items-center justify-between gap-3'>
        <div>
          <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>重要情報</p>
          <h3 className='mt-1 text-[18px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>{title}</h3>
        </div>
        <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-gold-soft)]'>
          <ShieldCheck className='h-4 w-4' />
        </span>
      </div>

      <div className='grid gap-2 sm:grid-cols-2'>
        <div className='rounded-[10px] border border-[rgba(5,32,49,0.08)] bg-white px-3 py-3'>
          <p className='text-[12px] text-[var(--ichiyoshi-ink-soft)]'>基準日時</p>
          <p className='mt-1 text-[14px] font-semibold text-[var(--ichiyoshi-navy)]'>{referenceDate}</p>
        </div>
        <div className='rounded-[10px] border border-[rgba(5,32,49,0.08)] bg-white px-3 py-3'>
          <p className='text-[12px] text-[var(--ichiyoshi-ink-soft)]'>反映タイミング</p>
          <p className='mt-1 text-[14px] font-semibold text-[var(--ichiyoshi-navy)]'>{reflectionTiming}</p>
        </div>
      </div>

      {updatedAt ? (
        <div className='inline-flex items-center gap-2 rounded-full bg-[rgba(5,32,49,0.04)] px-3 py-1 text-[12px] text-[var(--ichiyoshi-ink-soft)]'>
          <Clock3 className='h-3.5 w-3.5 text-[var(--ichiyoshi-gold-soft)]' />
          最終更新: {updatedAt}
        </div>
      ) : null}

      <ul className='space-y-1 text-[13px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>
        {notes.map((note) => (
          <li key={note}>・{note}</li>
        ))}
      </ul>
    </section>
  );
}

