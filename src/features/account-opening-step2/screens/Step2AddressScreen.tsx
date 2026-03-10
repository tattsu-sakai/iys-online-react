import { Globe2, House } from 'lucide-react';

import { StepActionRow } from '@/features/account-opening-step1/components';
import {
  BodyText,
  ContentCard,
  FormLabel,
  ResidentCheckboxRow,
  ResidencyRadioRow,
  SearchAddressButton,
  SectionNote,
  Step2Input,
  Step2Section,
  Step2Select,
  Step2Shell,
  TownSelectionDialog,
  SelectedTownButton,
} from '@/features/account-opening-step2/components';
import {
  addressGuidance,
  prefectureOptions,
  residentPrefectureNotice,
  residencyNotice,
  townOptions,
  type ResidencyCountry,
  type Step2AddressState,
} from '@/features/account-opening-step2/model';

type Step2AddressScreenProps = {
  canSearchTown: boolean;
  isTownDialogOpen: boolean;
  onBack: () => void;
  onCloseTownDialog: () => void;
  onOpenTownDialog: () => void;
  onPostalCodeChange: (value: string) => void;
  onPrefectureToggle: () => void;
  onResidentPrefectureChange: (value: string) => void;
  onResidencyCountryChange: (value: ResidencyCountry) => void;
  onSelectTown: (value: string) => void;
  onUpdateField: <Key extends keyof Step2AddressState>(key: Key, value: Step2AddressState[Key]) => void;
  screenIndex: number;
  state: Step2AddressState;
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-start justify-between gap-3 text-[13px] leading-6'>
      <span className='text-[var(--ichiyoshi-ink-soft)]'>{label}</span>
      <span className='max-w-[14rem] text-right font-semibold text-[var(--ichiyoshi-navy)]'>{value}</span>
    </div>
  );
}

export default function Step2AddressScreen({
  canSearchTown,
  isTownDialogOpen,
  onBack,
  onCloseTownDialog,
  onOpenTownDialog,
  onPostalCodeChange,
  onPrefectureToggle,
  onResidentPrefectureChange,
  onResidencyCountryChange,
  onSelectTown,
  onUpdateField,
  screenIndex,
  state,
}: Step2AddressScreenProps) {
  const residentPrefectureValue = state.hasDifferentResidentPrefecture ? state.residentPrefecture || '未選択' : '届出住所と同一';
  const residencyCountryValue = state.residencyCountry === 'japan' ? '日本のみ' : '日本以外又はなし';
  const addressPreview = [state.selectedTown, state.addressDetail, state.buildingName].filter((value) => value.trim().length > 0).join(' ');

  return (
    <Step2Shell
      description='本人確認書類に記載の住所をそのまま入力し、届出住所と居住地国の確認を行います。郵便番号から町名を選択できるようにしています。'
      nodeId='32374:74626'
      screenIndex={screenIndex}
      title='住所等'
    >
      <div className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]'>
        <div className='space-y-5'>
          <Step2Section
            dataNodeId='32374:74632'
            description='郵便番号から町名を選んだあと、番地と建物名を補足して住所を完成させます。'
            title='住所を入力'
          >
            <div className='grid gap-3'>
              <div className='rounded-[14px] border border-[rgba(5,32,49,0.06)] bg-white/82 px-4 py-4'>
                <SectionNote>{addressGuidance[0]}</SectionNote>
              </div>
              <div className='rounded-[14px] border border-[rgba(182,23,4,0.1)] bg-[rgba(182,23,4,0.04)] px-4 py-4'>
                <SectionNote tone='danger'>{addressGuidance[1]}</SectionNote>
              </div>
            </div>

            <div className='space-y-2'>
              <FormLabel>郵便番号</FormLabel>
              <div className='grid gap-3 sm:grid-cols-[minmax(0,1fr)_164px] sm:items-end'>
                <Step2Input
                  inputMode='numeric'
                  maxLength={7}
                  placeholder='例：0123456'
                  value={state.postalCode}
                  onChange={(event) => onPostalCodeChange(event.target.value)}
                />
                <SearchAddressButton disabled={!canSearchTown} onClick={onOpenTownDialog} />
              </div>
              <SectionNote>7桁入力すると町名検索を利用できます。</SectionNote>
            </div>

            <div className='space-y-2'>
              <FormLabel>町名</FormLabel>
              <SelectedTownButton disabled={!canSearchTown} onClick={onOpenTownDialog} value={state.selectedTown} />
              <SectionNote>郵便番号に一致する候補から、本人確認書類どおりの町名を選択してください。</SectionNote>
            </div>

            <div className='space-y-2'>
              <FormLabel>番地</FormLabel>
              <Step2Input
                placeholder='例：5番地8'
                value={state.addressDetail}
                onChange={(event) => onUpdateField('addressDetail', event.target.value)}
              />
              <SectionNote tone='danger'>※△丁目が重複しないようにご入力ください。</SectionNote>
            </div>

            <div className='grid gap-4 lg:grid-cols-2'>
              <div className='space-y-2'>
                <FormLabel>建物名・部屋番号</FormLabel>
                <Step2Input
                  placeholder='例：東京証券マンション 501'
                  value={state.buildingName}
                  onChange={(event) => onUpdateField('buildingName', event.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <FormLabel>建物名（カナ）</FormLabel>
                <Step2Input
                  placeholder='例：トウキョウショウケンマンション 501'
                  value={state.buildingKana}
                  onChange={(event) => onUpdateField('buildingKana', event.target.value)}
                />
              </div>
            </div>

            <div className='rounded-[14px] border border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.03)] px-4 py-4'>
              <BodyText className='text-[14px] leading-7'>
                建物名を入力した場合は、読み仮名もあわせて入力してください。建物名がない場合は空欄のままで問題ありません。
              </BodyText>
            </div>
          </Step2Section>

          <Step2Section
            dataNodeId='32374:74648'
            description='住民票記載の都道府県が届出住所と異なる場合のみ、該当する都道府県を指定します。'
            title='届出住所を確認'
          >
            <div className='rounded-[14px] border border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.03)] px-4 py-4'>
              <SectionNote>{residentPrefectureNotice}</SectionNote>
            </div>

            <ResidentCheckboxRow checked={state.hasDifferentResidentPrefecture} onToggle={onPrefectureToggle}>
              届出住所と本年1月1日現在の住民票記載の都道府県が異なる
            </ResidentCheckboxRow>

            <div className='space-y-2'>
              <FormLabel>本年1月1日現在の住民票記載の都道府県</FormLabel>
              <Step2Select
                disabled={!state.hasDifferentResidentPrefecture}
                value={state.residentPrefecture}
                onChange={(event) => onResidentPrefectureChange(event.target.value)}
              >
                <option value=''>{state.hasDifferentResidentPrefecture ? '都道府県を選択' : 'チェックすると選択できます'}</option>
                {prefectureOptions.map((prefecture) => (
                  <option key={prefecture} value={prefecture}>
                    {prefecture}
                  </option>
                ))}
              </Step2Select>
            </div>
          </Step2Section>

          <Step2Section dataNodeId='32374:74655' description='税務上の居住地国に応じて申告区分を選択してください。' title='居住地国を確認'>
            <div className='space-y-3'>
              {residencyNotice.map((paragraph) => (
                <div key={paragraph} className='rounded-[14px] border border-[rgba(5,32,49,0.06)] bg-white/82 px-4 py-4'>
                  <SectionNote>{paragraph}</SectionNote>
                </div>
              ))}
            </div>

            <div className='grid gap-4'>
              <ResidencyRadioRow checked={state.residencyCountry === 'japan'} onSelect={() => onResidencyCountryChange('japan')}>
                日本のみ
              </ResidencyRadioRow>
              <ResidencyRadioRow checked={state.residencyCountry === 'other'} onSelect={() => onResidencyCountryChange('other')}>
                日本以外又はなし
              </ResidencyRadioRow>
            </div>
          </Step2Section>

          <StepActionRow
            onPrimary={() => undefined}
            onSecondary={onBack}
            primaryDisabled
            primaryLabel='次へ'
            secondaryLabel='1つ前へ戻る'
          />
        </div>

        <div className='hidden xl:block xl:self-stretch'>
          <div className='sticky top-8 space-y-4'>
            <ContentCard className='space-y-4 border border-[rgba(5,32,49,0.06)]'>
              <div className='flex items-center gap-3'>
                <span className='flex h-11 w-11 items-center justify-center rounded-[12px] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-gold-soft)]'>
                  <House className='h-5 w-5' />
                </span>
                <div>
                  <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>届出内容</p>
                  <h2 className='mt-1 text-[20px] font-bold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>住所プレビュー</h2>
                </div>
              </div>

              <div className='rounded-[14px] border border-[rgba(5,32,49,0.06)] bg-[rgba(5,32,49,0.03)] px-4 py-4'>
                <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>登録予定住所</p>
                <p className='mt-3 text-[16px] font-semibold leading-7 tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>
                  {addressPreview || '町名・番地・建物名を入力するとここに表示されます'}
                </p>
              </div>

              <div className='space-y-3'>
                <SummaryRow label='郵便番号' value={state.postalCode || '未入力'} />
                <SummaryRow label='住民票記載の都道府県' value={residentPrefectureValue} />
                <SummaryRow label='居住地国' value={residencyCountryValue} />
              </div>
            </ContentCard>

            <ContentCard className='space-y-4 border border-[rgba(5,32,49,0.06)]'>
              <div className='flex items-center gap-3'>
                <span className='flex h-11 w-11 items-center justify-center rounded-[12px] bg-[rgba(62,96,116,0.1)] text-[#3e6074]'>
                  <Globe2 className='h-5 w-5' />
                </span>
                <div>
                  <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>入力のポイント</p>
                  <h2 className='mt-1 text-[18px] font-bold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>迷いやすい項目</h2>
                </div>
              </div>

              <div className='space-y-3 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
                <p>・本人確認書類どおりの表記で入力してください。</p>
                <p>・建物名を入力した場合は、カナもあわせて入力してください。</p>
                <p>・住民票記載の都道府県が異なる場合のみ、チェック後に選択してください。</p>
              </div>
            </ContentCard>
          </div>
        </div>
      </div>

      <TownSelectionDialog open={isTownDialogOpen} options={townOptions} onClose={onCloseTownDialog} onSelect={onSelectTown} />
    </Step2Shell>
  );
}
