import { ChevronDown, Info } from 'lucide-react';

import { ContentCard } from '@/features/initial-setup/components';
import { cn } from '@/lib/utils';

type DisplayNotesCardProps = {
  description?: string;
  notes?: string[];
  notesOpen: boolean;
  onToggle: () => void;
};

const defaultDescription = '前営業日基準の表示ルールと、評価額に含まれない銘柄の扱いを確認できます。';
const defaultNotes = [
  '「参考時価」は前営業日の参考時価を表示しています。',
  '表示金額および預り情報は前営業日基準で表示されます。',
  '保有資産については一部評価できない銘柄があり、そのような銘柄は評価額に含まれておりません。',
];

export default function DisplayNotesCard({ description = defaultDescription, notes = defaultNotes, notesOpen, onToggle }: DisplayNotesCardProps) {
  return (
    <ContentCard className='space-y-4' data-node-id='32374:141118'>
      <button type='button' onClick={onToggle} className='flex w-full items-start gap-3 text-left'>
        <span className='mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-gold-soft)]'>
          <Info className='h-4 w-4' />
        </span>
        <div className='flex-1'>
          <p className='text-[16px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>表示内容に関する注意事項</p>
          <p className='mt-1 text-[14px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>{description}</p>
        </div>
        <span className='flex h-8 w-8 items-center justify-center text-[var(--ichiyoshi-navy)]'>
          <ChevronDown className={cn('h-4 w-4 transition-transform', notesOpen && 'rotate-180')} />
        </span>
      </button>

      {notesOpen ? (
        <div className='space-y-2 rounded-[12px] bg-[rgba(5,32,49,0.03)] px-4 py-4 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
          {notes.map((note) => (
            <p key={note}>・{note}</p>
          ))}
        </div>
      ) : null}
    </ContentCard>
  );
}
