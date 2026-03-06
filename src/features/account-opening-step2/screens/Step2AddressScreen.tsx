import { StepActionRow } from "@/features/account-opening-step1/components";
import {
  BodyText,
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
} from "@/features/account-opening-step2/components";
import {
  addressGuidance,
  prefectureOptions,
  residentPrefectureNotice,
  residencyNotice,
  townOptions,
  type ResidencyCountry,
  type Step2AddressState,
} from "@/features/account-opening-step2/model";

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
  onUpdateField: <Key extends keyof Step2AddressState>(
    key: Key,
    value: Step2AddressState[Key]
  ) => void;
  screenIndex: number;
  state: Step2AddressState;
};

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
  return (
    <Step2Shell
      description="本人確認書類に記載の住所をそのまま入力し、届出住所と居住地国の確認を行います。郵便番号から町名を選択できるようにしています。"
      nodeId="32374:74626"
      screenIndex={screenIndex}
      title="住所等"
    >
      <div className="space-y-5">
        <Step2Section dataNodeId="32374:74632" title="住所">
          <div className="space-y-2">
            <SectionNote>{addressGuidance[0]}</SectionNote>
            <SectionNote tone="danger">{addressGuidance[1]}</SectionNote>
          </div>

          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_148px] sm:items-end">
            <div className="space-y-2">
              <FormLabel>郵便番号</FormLabel>
              <Step2Input
                inputMode="numeric"
                maxLength={7}
                placeholder="例：0123456"
                value={state.postalCode}
                onChange={(event) => onPostalCodeChange(event.target.value)}
              />
            </div>
            <SearchAddressButton
              disabled={!canSearchTown}
              onClick={onOpenTownDialog}
            />
          </div>

          <div className="space-y-2">
            <FormLabel>住所</FormLabel>
            <SelectedTownButton
              disabled={!canSearchTown}
              onClick={onOpenTownDialog}
              value={state.selectedTown}
            />
            <Step2Input
              placeholder="例：5番地8"
              value={state.addressDetail}
              onChange={(event) =>
                onUpdateField("addressDetail", event.target.value)
              }
            />
            <SectionNote tone="danger">
              ※△丁目が重複しないようにご入力ください。
            </SectionNote>
          </div>

          <div className="space-y-2">
            <FormLabel>建物名・部屋番号</FormLabel>
            <Step2Input
              placeholder="例：東京証券マンション 501"
              value={state.buildingName}
              onChange={(event) =>
                onUpdateField("buildingName", event.target.value)
              }
            />
          </div>

          <BodyText className="text-[16px] leading-7 tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
            ↓建物名のフリガナをご入力ください。↓
          </BodyText>

          <div className="space-y-2">
            <FormLabel>建物名（カナ）</FormLabel>
            <Step2Input
              placeholder="例：トウキョウショウケンマンション 501"
              value={state.buildingKana}
              onChange={(event) =>
                onUpdateField("buildingKana", event.target.value)
              }
            />
          </div>
        </Step2Section>

        <Step2Section dataNodeId="32374:74648" title="届出住所の確認">
          <SectionNote>{residentPrefectureNotice}</SectionNote>

          <ResidentCheckboxRow
            checked={state.hasDifferentResidentPrefecture}
            onToggle={onPrefectureToggle}
          >
            届出住所と本年1月1日現在の住民票記載の都道府県が異なる
          </ResidentCheckboxRow>

          <div className="space-y-2">
            <FormLabel>本年1月1日現在の住民票記載の都道府県</FormLabel>
            <Step2Select
              disabled={!state.hasDifferentResidentPrefecture}
              value={state.residentPrefecture}
              onChange={(event) =>
                onResidentPrefectureChange(event.target.value)
              }
            >
              <option value="">
                {state.hasDifferentResidentPrefecture
                  ? "都道府県を選択"
                  : "チェックすると選択できます"}
              </option>
              {prefectureOptions.map((prefecture) => (
                <option key={prefecture} value={prefecture}>
                  {prefecture}
                </option>
              ))}
            </Step2Select>
          </div>
        </Step2Section>

        <Step2Section dataNodeId="32374:74655" title="居住地国">
          <div className="space-y-2">
            {residencyNotice.map((paragraph) => (
              <SectionNote key={paragraph}>{paragraph}</SectionNote>
            ))}
          </div>

          <div className="space-y-4">
            <ResidencyRadioRow
              checked={state.residencyCountry === "japan"}
              onSelect={() => onResidencyCountryChange("japan")}
            >
              日本のみ
            </ResidencyRadioRow>
            <ResidencyRadioRow
              checked={state.residencyCountry === "other"}
              onSelect={() => onResidencyCountryChange("other")}
            >
              日本以外又はなし
            </ResidencyRadioRow>
          </div>
        </Step2Section>

        <StepActionRow
          onPrimary={() => undefined}
          onSecondary={onBack}
          primaryDisabled
          primaryLabel="次へ"
          secondaryLabel="1つ前へ戻る"
        />
      </div>

      <TownSelectionDialog
        open={isTownDialogOpen}
        options={townOptions}
        onClose={onCloseTownDialog}
        onSelect={onSelectTown}
      />
    </Step2Shell>
  );
}
