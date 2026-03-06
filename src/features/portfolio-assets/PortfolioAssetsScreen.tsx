import { type ComponentType, useEffect, useMemo, useState } from "react";
import {
  ChartPie,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Handshake,
  History,
  Info,
  Landmark,
  Menu,
  Sparkles,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BrandMark,
  ContentCard,
  PhoneStatusBar,
  QuickAccessBar,
  companyInfoLines,
} from "@/features/initial-setup/components";
import {
  assetTabs,
  assetTabSummary,
  displayNotes,
  domesticEquityPages,
  foreignEquitySections,
  type AssetTabKey,
  type HoldingItem,
  type HoldingsSection,
} from "@/features/portfolio-assets/model";
import { cn } from "@/lib/utils";

type PortfolioAssetsScreenProps = {
  onBackToTop: () => void;
};

const currencyFormatter = new Intl.NumberFormat("ja-JP");

const quickActions: Array<{
  icon: ComponentType<{ className?: string }>;
  label: string;
}> = [
  { label: "預り資産", icon: Landmark },
  { label: "取引履歴", icon: History },
  { label: "お客様情報", icon: User },
  { label: "各種申込み", icon: FileText },
];

const tabIcons: Record<AssetTabKey, ComponentType<{ className?: string }>> = {
  bond: Landmark,
  cash: Wallet,
  dreamCollection: Sparkles,
  equity: TrendingUp,
  investmentTrust: ChartPie,
  margin: Handshake,
};

function formatCurrency(value: number) {
  return `${currencyFormatter.format(value)}円`;
}

function formatSignedCurrency(value: number) {
  if (value === 0) {
    return "0円";
  }

  return `${value > 0 ? "+" : "-"}${currencyFormatter.format(
    Math.abs(value)
  )}円`;
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[12px] leading-6 text-[var(--ichiyoshi-ink-soft)]">
      <span>{label}</span>
      <span className="text-right font-semibold text-[var(--ichiyoshi-navy)]">
        {value}
      </span>
    </div>
  );
}

function HoldingCard({ item }: { item: HoldingItem }) {
  return (
    <article className="overflow-hidden rounded-[14px] border border-[rgba(33,33,33,0.08)] bg-white shadow-[0_10px_28px_rgba(13,10,44,0.08)]">
      <div className="border-b border-[#ebe2c4] bg-[linear-gradient(180deg,#faf8f0_0%,#f6f1e5_100%)] px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-[var(--ichiyoshi-ink-soft)]">
              <span>{item.code}</span>
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-[var(--ichiyoshi-navy)]">
                {item.accountType}
              </span>
            </div>
            <h3 className="mt-2 text-[16px] font-bold leading-[1.35] tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
              {item.name}
            </h3>
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-[var(--ichiyoshi-navy)]"
            aria-label={`${item.name} の詳細`}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
              評価額
            </p>
            <p className="mt-2 text-[18px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
              {formatCurrency(item.evaluationAmount)}
            </p>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
              評価損益
            </p>
            <p
              className={cn(
                "mt-2 text-[18px] font-bold tracking-[0.04em]",
                item.pnl > 0
                  ? "text-[#507ae7]"
                  : item.pnl < 0
                    ? "text-[#b61704]"
                    : "text-[var(--ichiyoshi-navy)]"
              )}
            >
              {formatSignedCurrency(item.pnl)}
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 sm:gap-x-4">
          <InfoPair label="数量" value={item.quantityLabel} />
          {item.acquisitionCostLabel ? (
            <InfoPair label="取得コスト" value={item.acquisitionCostLabel} />
          ) : null}
          {item.referencePriceLabel ? (
            <InfoPair label="参考時価" value={item.referencePriceLabel} />
          ) : null}
          <InfoPair label="取得金額" value={formatCurrency(item.acquisitionAmount)} />
          {item.evaluationRateLabel ? (
            <InfoPair label="評価レート" value={item.evaluationRateLabel} />
          ) : null}
        </div>
      </div>
    </article>
  );
}

function HoldingsSectionBlock({ section }: { section: HoldingsSection }) {
  return (
    <section className="space-y-4">
      <div className="border-b-2 border-[rgba(176,149,36,0.32)] pb-2">
        <h2 className="text-[17px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
          {section.title}
        </h2>
      </div>
      <div className="space-y-4">
        {section.items.map((item) => (
          <HoldingCard key={`${section.title}-${item.code}-${item.name}`} item={item} />
        ))}
      </div>
    </section>
  );
}

export default function PortfolioAssetsScreen({
  onBackToTop,
}: PortfolioAssetsScreenProps) {
  const [activeTab, setActiveTab] = useState<AssetTabKey>("equity");
  const [currentPage, setCurrentPage] = useState(0);
  const [notesOpen, setNotesOpen] = useState(true);

  useEffect(() => {
    setCurrentPage(0);
  }, [activeTab]);

  const currentDomesticSections =
    activeTab === "equity" ? domesticEquityPages[currentPage]?.sections ?? [] : [];

  const equitySummary = useMemo(() => {
    const domesticItems = domesticEquityPages.flatMap((page) =>
      page.sections.flatMap((section) => section.items)
    );
    const foreignItems = foreignEquitySections.flatMap((section) => section.items);
    const allItems = [...domesticItems, ...foreignItems];

    return {
      holdingsCount: allItems.length,
      totalAmount: allItems.reduce(
        (sum, item) => sum + item.evaluationAmount,
        0
      ),
      totalPnl: allItems.reduce((sum, item) => sum + item.pnl, 0),
    };
  }, []);

  const selectedSummary =
    activeTab === "equity"
      ? {
          holdingsLabel: `${equitySummary.holdingsCount}銘柄を表示`,
          note: assetTabSummary.equity.note,
          totalAmount: equitySummary.totalAmount,
          totalPnl: equitySummary.totalPnl,
        }
      : assetTabSummary[activeTab];

  const ActiveTabIcon = tabIcons[activeTab];
  const quickAccessItems = quickActions.map((action, index) => ({
    ...action,
    active: index === 0,
  }));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(162,133,86,0.18),transparent_24%),radial-gradient(circle_at_90%_10%,rgba(5,32,49,0.16),transparent_20%),linear-gradient(180deg,#f7f3eb_0%,#eef2f4_34%,#e6ebee_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1380px] flex-col">
        <section className="relative flex flex-1 items-stretch justify-center px-0 py-0 sm:px-4 lg:px-6 xl:px-10">
          <div className="relative w-full max-w-[1180px]">
            <div className="pointer-events-none absolute inset-x-10 top-5 h-32 rounded-full bg-[rgba(162,133,86,0.18)] blur-3xl" />

            <div className="relative">
              <PhoneStatusBar />

              <header
                className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-[rgba(255,255,255,0.14)]"
                data-node-id="32374:141104"
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#2a3f4a_0%,#486371_54%,#8f7c63_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(12,27,36,0.12))]" />
                <div className="pointer-events-none absolute -right-8 top-4 h-32 w-32 rounded-full bg-[rgba(255,255,255,0.1)] blur-3xl" />
                <div className="pointer-events-none absolute left-10 top-10 h-24 w-24 rounded-full bg-[rgba(234,224,200,0.16)] blur-2xl" />

                <div className="relative mx-auto w-full max-w-[1180px] px-4 pb-6 pt-5 sm:px-6 sm:pb-7 xl:px-8 xl:pb-8 xl:pt-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="max-w-[44rem] rounded-[16px] border border-white/10 bg-[rgba(24,35,46,0.18)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-5">
                      <span className="inline-flex rounded-full border border-white/18 bg-white/14 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)] backdrop-blur">
                        Asset Details
                      </span>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-white/12 text-white shadow-[0_16px_32px_rgba(0,0,0,0.16)] ring-1 ring-white/12">
                          <Landmark className="h-5 w-5" />
                        </span>
                        <div>
                          <h1 className="text-[26px] font-bold leading-[1.25] tracking-[0.04em] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.28)] sm:text-[32px]">
                            預り資産
                          </h1>
                          <p className="mt-2 max-w-[40rem] text-[13px] leading-6 text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.22)] sm:text-[14px]">
                            商品分類ごとに保有明細を見渡せる一覧画面です。国内株式と外国株式を中心に、評価額と損益をシンプルに確認できる構成にしています。
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white backdrop-blur xl:inline-flex"
                        aria-label="メニュー"
                      >
                        <Menu className="h-4 w-4" />
                      </button>
                      <Button
                        type="button"
                        onClick={onBackToTop}
                        className="h-11 rounded-full border border-white/12 bg-white/10 px-4 text-[13px] font-semibold tracking-[0.08em] text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur hover:bg-white/16"
                      >
                        TOPへ戻る
                      </Button>
                    </div>
                  </div>
                </div>
              </header>

              <QuickAccessBar actions={quickAccessItems} containerClassName="max-w-[1180px] xl:max-w-[1180px]" />

              <div className="px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8">
                <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-4">
                    <ContentCard className="space-y-5" data-node-id="32374:141110">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
                            Product Tabs
                          </p>
                          <p className="mt-2 text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
                            商品分類を切り替えて、保有明細の一覧とサマリーを確認できます。
                          </p>
                        </div>
                      </div>

                      <Tabs
                        value={activeTab}
                        onValueChange={(value) =>
                          setActiveTab(value as AssetTabKey)
                        }
                      >
                        <TabsList className="grid h-auto w-full grid-cols-3 gap-2 rounded-[14px] bg-[rgba(5,32,49,0.05)] p-2 sm:grid-cols-6">
                          {assetTabs.map((tab) => {
                            const Icon = tabIcons[tab.key];

                            return (
                              <TabsTrigger
                                key={tab.key}
                                value={tab.key}
                                className="flex h-auto flex-col gap-2 rounded-[10px] px-2 py-3 text-[12px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-ink-soft)] data-[state=active]:bg-white data-[state=active]:text-[var(--ichiyoshi-navy)] data-[state=active]:shadow-[0_12px_24px_rgba(5,32,49,0.08)]"
                              >
                                <Icon className="h-5 w-5" />
                                <span>{tab.label}</span>
                              </TabsTrigger>
                            );
                          })}
                        </TabsList>
                      </Tabs>
                    </ContentCard>

                    <ContentCard className="space-y-4" data-node-id="32374:141118">
                      <button
                        type="button"
                        onClick={() => setNotesOpen((current) => !current)}
                        className="flex w-full items-start gap-3 text-left"
                      >
                        <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-gold-soft)]">
                          <Info className="h-4 w-4" />
                        </span>
                        <div className="flex-1">
                          <p className="text-[16px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
                            表示内容に関する注意事項
                          </p>
                          <p className="mt-1 text-[14px] leading-6 text-[var(--ichiyoshi-ink-soft)]">
                            前営業日基準の表示ルールと、評価額に含まれない銘柄の扱いを確認できます。
                          </p>
                        </div>
                        <span className="flex h-8 w-8 items-center justify-center text-[var(--ichiyoshi-navy)]">
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              notesOpen && "rotate-180"
                            )}
                          />
                        </span>
                      </button>

                      {notesOpen ? (
                        <div className="space-y-2 rounded-[12px] bg-[rgba(5,32,49,0.03)] px-4 py-4 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
                          {displayNotes.map((note) => (
                            <p key={note}>・{note}</p>
                          ))}
                        </div>
                      ) : null}
                    </ContentCard>

                    {activeTab === "equity" ? (
                      <>
                        <ContentCard className="space-y-5" data-node-id="32374:141137">
                          <div className="border-b border-[rgba(176,149,36,0.38)] pb-3">
                            <h2 className="text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-gold-soft)]">
                              国内株式
                            </h2>
                          </div>

                          <div className="space-y-6">
                            {currentDomesticSections.map((section) => (
                              <HoldingsSectionBlock
                                key={`${currentPage}-${section.title}`}
                                section={section}
                              />
                            ))}
                          </div>
                        </ContentCard>

                        <ContentCard className="space-y-5">
                          <div className="border-b border-[rgba(176,149,36,0.38)] pb-3">
                            <h2 className="text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-gold-soft)]">
                              外国株式
                            </h2>
                          </div>
                          <div className="space-y-6">
                            {foreignEquitySections.map((section) => (
                              <HoldingsSectionBlock
                                key={`foreign-${section.title}`}
                                section={section}
                              />
                            ))}
                          </div>
                        </ContentCard>

                        <ContentCard className="space-y-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
                              Page
                            </p>
                            <p className="text-[13px] text-[var(--ichiyoshi-ink-soft)]">
                              {currentPage + 1} / {domesticEquityPages.length}
                            </p>
                          </div>

                          <div className="grid grid-cols-[48px_repeat(5,minmax(0,1fr))_48px] gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                setCurrentPage((current) =>
                                  Math.max(current - 1, 0)
                                )
                              }
                              disabled={currentPage === 0}
                              className="h-12 rounded-[10px] border-[rgba(33,33,33,0.08)] bg-white text-[var(--ichiyoshi-gold-soft)] disabled:bg-white/70"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            {domesticEquityPages.map((_, index) => (
                              <Button
                                key={index}
                                type="button"
                                variant="outline"
                                onClick={() => setCurrentPage(index)}
                                className={cn(
                                  "h-12 rounded-[10px] border-[rgba(33,33,33,0.08)] text-[15px] font-bold shadow-[0_6px_18px_rgba(13,10,44,0.06)]",
                                  currentPage === index
                                    ? "bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] text-white hover:opacity-95"
                                    : "bg-white text-[var(--ichiyoshi-gold-soft)] hover:bg-[rgba(111,91,59,0.04)]"
                                )}
                              >
                                {index + 1}
                              </Button>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                setCurrentPage((current) =>
                                  Math.min(
                                    current + 1,
                                    domesticEquityPages.length - 1
                                  )
                                )
                              }
                              disabled={currentPage === domesticEquityPages.length - 1}
                              className="h-12 rounded-[10px] border-[rgba(33,33,33,0.08)] bg-white text-[var(--ichiyoshi-gold-soft)] disabled:bg-white/70"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </ContentCard>
                      </>
                    ) : (
                      <ContentCard className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-gold-soft)]">
                            <ActiveTabIcon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
                              {selectedSummary.holdingsLabel}
                            </p>
                            <h2 className="mt-1 text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
                              {assetTabs.find((tab) => tab.key === activeTab)?.label}
                            </h2>
                          </div>
                        </div>
                        <p className="text-[15px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
                          {selectedSummary.note}
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-[12px] bg-[rgba(5,32,49,0.03)] px-4 py-4">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
                              評価額合計
                            </p>
                            <p className="mt-2 text-[20px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
                              {formatCurrency(selectedSummary.totalAmount)}
                            </p>
                          </div>
                          <div className="rounded-[12px] bg-[rgba(5,32,49,0.03)] px-4 py-4">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
                              評価損益
                            </p>
                            <p
                              className={cn(
                                "mt-2 text-[20px] font-bold tracking-[0.04em]",
                                selectedSummary.totalPnl > 0
                                  ? "text-[#507ae7]"
                                  : selectedSummary.totalPnl < 0
                                    ? "text-[#b61704]"
                                    : "text-[var(--ichiyoshi-navy)]"
                              )}
                            >
                              {formatSignedCurrency(selectedSummary.totalPnl)}
                            </p>
                          </div>
                        </div>
                      </ContentCard>
                    )}

                    <div className="xl:hidden">
                      <Button
                        type="button"
                        onClick={onBackToTop}
                        className="h-12 w-full rounded-[12px] border border-[rgba(33,33,33,0.08)] bg-white text-[15px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-gold-soft)] shadow-[0_10px_26px_rgba(13,10,44,0.08)] hover:bg-[rgba(111,91,59,0.04)]"
                      >
                        TOPページへ戻る
                      </Button>
                    </div>
                  </div>

                  <div className="hidden space-y-4 xl:block">
                    <div className="xl:sticky xl:top-6">
                      <ContentCard className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-gold-soft)]">
                            <ActiveTabIcon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
                              Active Category
                            </p>
                            <h2 className="mt-1 text-[20px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
                              {assetTabs.find((tab) => tab.key === activeTab)?.label}
                            </h2>
                          </div>
                        </div>

                        <div className="grid gap-3">
                          <div className="rounded-[12px] bg-[rgba(5,32,49,0.03)] px-4 py-4">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
                              保有サマリー
                            </p>
                            <p className="mt-2 text-[15px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
                              {selectedSummary.holdingsLabel}
                            </p>
                            <p className="mt-2 text-[14px] leading-6 text-[var(--ichiyoshi-ink-soft)]">
                              {selectedSummary.note}
                            </p>
                          </div>
                          <div className="rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-white px-4 py-4">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
                              評価額合計
                            </p>
                            <p className="mt-2 text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
                              {formatCurrency(selectedSummary.totalAmount)}
                            </p>
                          </div>
                          <div className="rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-white px-4 py-4">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
                              評価損益
                            </p>
                            <p
                              className={cn(
                                "mt-2 text-[22px] font-bold tracking-[0.04em]",
                                selectedSummary.totalPnl > 0
                                  ? "text-[#507ae7]"
                                  : selectedSummary.totalPnl < 0
                                    ? "text-[#b61704]"
                                    : "text-[var(--ichiyoshi-navy)]"
                              )}
                            >
                              {formatSignedCurrency(selectedSummary.totalPnl)}
                            </p>
                          </div>
                        </div>

                        <Button
                          type="button"
                          onClick={onBackToTop}
                          className="h-12 w-full rounded-[12px] border border-[rgba(33,33,33,0.08)] bg-white text-[15px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-gold-soft)] shadow-[0_10px_26px_rgba(13,10,44,0.08)] hover:bg-[rgba(111,91,59,0.04)]"
                        >
                          TOPページへ戻る
                        </Button>
                      </ContentCard>
                    </div>
                  </div>
                </div>
              </div>

              <footer className="relative left-1/2 w-screen -translate-x-1/2 border-t border-white/70 bg-[linear-gradient(180deg,rgba(248,248,248,0.2),rgba(255,255,255,0.92))] text-center text-[12px] leading-[1.8] text-[var(--ichiyoshi-muted)] backdrop-blur xl:text-left">
                <div className="mx-auto w-full max-w-[1180px] px-5 py-6 xl:px-8">
                  <BrandMark className="justify-center xl:justify-start" />
                  <div className="mt-5 space-y-1">
                    {companyInfoLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  <p className="mt-2">
                    Copyright © Ichiyoshi Securities Co., Ltd. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
