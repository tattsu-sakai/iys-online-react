import { ChevronRight, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ContentCard, SectionLabel } from '@/features/initial-setup/components';
import { personalAccountOpeningHighlights } from '@/features/top-screen/model';

type OnlineApplicationsCardProps = {
  onStartPersonalAccountOpening: () => void;
};

export default function OnlineApplicationsCard({ onStartPersonalAccountOpening }: OnlineApplicationsCardProps) {
  return (
    <ContentCard className='space-y-5' data-node-id='32374:74192'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <SectionLabel>オンライン申込み</SectionLabel>
          <p className='mt-4 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
            口座をまだお持ちでない方向けに、個人口座開設の申込みをこの画面から開始できます。会員登録はログイン画面からご利用ください。
          </p>
        </div>
        <span className='inline-flex shrink-0 self-start items-center justify-center rounded-full bg-[rgba(162,133,86,0.12)] px-3 py-1 text-[12px] font-semibold leading-none tracking-[0.08em] text-[var(--ichiyoshi-gold-soft)] whitespace-nowrap'>
          申込み導線
        </span>
      </div>

      <div className='rounded-[12px] border border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.03)] px-4 py-4 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
        すでに口座をお持ちで初めてオンラインを使う方の会員登録は、ログイン画面から進めます。
      </div>

      <article className='rounded-[14px] border border-[rgba(111,91,59,0.16)] bg-[linear-gradient(145deg,rgba(133,104,63,0.12),rgba(255,255,255,0.94)_42%,rgba(5,32,49,0.04)_100%)] p-5 shadow-[0_20px_48px_rgba(5,32,49,0.08)]'>
        <div className='inline-flex items-center gap-2 rounded-full border border-[rgba(111,91,59,0.18)] bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.1em] text-[var(--ichiyoshi-gold-soft)]'>
          <FileText className='h-3.5 w-3.5' />
          口座をまだお持ちでない方
        </div>
        <p className='mt-4 text-[22px] font-bold leading-[1.4] tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>個人口座開設</p>
        <p className='mt-3 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
          本人情報や確認事項を入力して、口座開設の申込みを進めます。
        </p>
        <div className='mt-5 flex flex-wrap gap-2'>
          {personalAccountOpeningHighlights.slice(0, 4).map((item) => (
            <span
              key={item}
              className='rounded-full border border-[rgba(5,32,49,0.08)] bg-white/86 px-3 py-2 text-[13px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'
            >
              {item}
            </span>
          ))}
        </div>
        <Button
          type='button'
          size='lg'
          onClick={onStartPersonalAccountOpening}
          className='mt-6 h-12 w-full rounded-[12px] bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] px-6 text-[15px] font-semibold tracking-[0.04em] text-white shadow-[0_18px_40px_rgba(95,69,35,0.28)] hover:opacity-95'
        >
          個人口座開設を始める
          <ChevronRight className='h-4 w-4' />
        </Button>
      </article>
    </ContentCard>
  );
}
