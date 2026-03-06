import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  ExternalLink,
  Eye,
  FileText,
} from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  BrandMark,
  ContentCard as BaseContentCard,
  PhoneStatusBar,
  companyInfoLines,
} from "@/features/initial-setup/components";
import { cn } from "@/lib/utils";

export function ContentCard({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return (
    <BaseContentCard className={className}>
      <section {...props}>{children}</section>
    </BaseContentCard>
  );
}

function OverallOpeningProgress({
  currentOverallStep,
}: {
  currentOverallStep: 1 | 2 | 3 | 4 | 5;
}) {
  return (
    <div
      className="flex items-center gap-2"
      aria-label={`口座開設ステップ ${currentOverallStep} / 5`}
    >
      {[1, 2, 3, 4, 5].map((step, index) => (
        <div key={step} className="flex flex-1 items-center gap-2">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border text-[14px] font-bold tracking-[0.04em]",
              step === currentOverallStep
                ? "border-white bg-white text-[var(--ichiyoshi-gold-soft)]"
                : step < currentOverallStep
                  ? "border-white/75 bg-white/10 text-white"
                  : "border-white/45 bg-transparent text-white"
            )}
          >
            {step}
          </span>
          {index < 4 ? (
            <span
              className={cn(
                "h-px flex-1 bg-white/35",
                step < currentOverallStep && "bg-white/65"
              )}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function AppFooter() {
  return (
    <footer className="relative left-1/2 w-screen -translate-x-1/2 border-t border-white/70 bg-[linear-gradient(180deg,rgba(248,248,248,0.18),rgba(255,255,255,0.92))] text-center text-[12px] leading-[1.8] text-[var(--ichiyoshi-muted)] backdrop-blur xl:text-left">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-6 xl:px-8">
        <BrandMark className="justify-center xl:justify-start" />
        <div className="mt-5 space-y-1">
          {companyInfoLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="mt-2">Copyright © Ichiyoshi Securities Co., Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}

export function Step1Shell({
  children,
  currentOverallStep = 1,
  description,
  eyebrow,
  nodeId,
  screenIndex,
  screenTotal = 4,
  showOverallProgress = false,
  title,
}: {
  children: ReactNode;
  currentOverallStep?: 1 | 2 | 3 | 4 | 5;
  description: string;
  eyebrow: string;
  nodeId?: string;
  screenIndex: number;
  screenTotal?: number;
  showOverallProgress?: boolean;
  title: string;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(162,133,86,0.18),transparent_24%),radial-gradient(circle_at_90%_10%,rgba(5,32,49,0.16),transparent_20%),linear-gradient(180deg,#f7f3eb_0%,#eef2f4_34%,#e6ebee_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1380px] flex-col">
        <section className="relative flex flex-1 items-stretch justify-center px-0 py-0 sm:px-4 lg:px-6 xl:px-10">
          <div className="relative w-full max-w-[1180px]">
            <div className="pointer-events-none absolute inset-x-10 top-5 h-32 rounded-full bg-[rgba(162,133,86,0.18)] blur-3xl" />

            <div className="relative" data-node-id={nodeId}>
              <PhoneStatusBar />

              <header className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-[rgba(255,255,255,0.14)]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#2a3f4a_0%,#486371_54%,#8f7c63_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(12,27,36,0.12))]" />
                <div className="pointer-events-none absolute -right-8 top-4 h-32 w-32 rounded-full bg-[rgba(255,255,255,0.1)] blur-3xl" />
                <div className="pointer-events-none absolute left-10 top-10 h-24 w-24 rounded-full bg-[rgba(234,224,200,0.16)] blur-2xl" />

                <div className="relative mx-auto w-full max-w-[1180px] px-4 pb-6 pt-5 sm:px-6 sm:pb-7 xl:px-8 xl:pb-8 xl:pt-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-[48rem] rounded-[16px] border border-white/10 bg-[rgba(24,35,46,0.18)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="inline-flex rounded-full border border-white/18 bg-white/14 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)] backdrop-blur">
                          {eyebrow}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/78 [text-shadow:0_1px_10px_rgba(0,0,0,0.24)]">
                          Screen {screenIndex} / {screenTotal}
                        </span>
                      </div>

                      {showOverallProgress ? (
                        <div className="mt-5">
                          <OverallOpeningProgress
                            currentOverallStep={currentOverallStep}
                          />
                        </div>
                      ) : null}

                      <h1 className="mt-5 text-[26px] font-bold leading-[1.3] tracking-[0.04em] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.28)] sm:text-[32px]">
                        {title}
                      </h1>
                      <p className="mt-4 max-w-[42rem] text-[13px] leading-6 text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.22)] sm:text-[14px]">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              </header>

              <div className="px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8">
                {children}
              </div>

              <AppFooter />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export function Step1Section({
  children,
  nodeId,
  title,
}: {
  children: ReactNode;
  nodeId?: string;
  title: string;
}) {
  return (
    <ContentCard className="space-y-5" data-node-id={nodeId}>
      <div className="flex items-start gap-3">
        <span className="mt-1 h-10 w-1.5 rounded-full bg-[var(--ichiyoshi-navy)]" />
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
            Step 1
          </p>
          <h2 className="mt-2 text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
            {title}
          </h2>
        </div>
      </div>
      {children}
    </ContentCard>
  );
}

export function BodyText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[15px] leading-8 tracking-[0.02em] text-[var(--ichiyoshi-ink-soft)]",
        className
      )}
    >
      {children}
    </p>
  );
}

export function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2 pl-5 text-[15px] leading-8 tracking-[0.02em] text-[var(--ichiyoshi-navy)]">
      {items.map((item) => (
        <li key={item} className="list-disc">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ScrollTextCard({ items }: { items: readonly string[] }) {
  return (
    <div className="max-h-[280px] space-y-3 overflow-y-auto rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-white px-5 py-5 text-[14px] leading-7 text-[var(--ichiyoshi-navy)]">
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
}

export function AgreementCard({
  checked,
  label,
  onToggle,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-start gap-3 rounded-[12px] border px-4 py-4 text-left transition-colors",
        checked
          ? "border-[rgba(111,91,59,0.28)] bg-[rgba(111,91,59,0.08)]"
          : "border-[rgba(5,32,49,0.08)] bg-white"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] border",
          checked
            ? "border-[var(--ichiyoshi-gold-soft)] bg-[var(--ichiyoshi-gold-soft)] text-white"
            : "border-[rgba(5,32,49,0.14)] bg-[rgba(5,32,49,0.03)] text-transparent"
        )}
      >
        <Check className="h-4 w-4" />
      </span>
      <span className="text-[16px] font-bold leading-7 tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
        {label}
      </span>
    </button>
  );
}

export function StatusPill({
  active,
  label,
}: {
  active: boolean;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold tracking-[0.12em]",
        active
          ? "bg-[rgba(111,91,59,0.12)] text-[var(--ichiyoshi-gold-soft)]"
          : "bg-[rgba(5,32,49,0.06)] text-[var(--ichiyoshi-ink-soft)]"
      )}
    >
      {active ? <CircleCheckBig className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}

export function DocumentPreview({
  alt,
  imageSrc,
  linkLabel,
  onOpen,
}: {
  alt: string;
  imageSrc: string;
  linkLabel?: string;
  onOpen: () => void;
}) {
  return (
    <div className="space-y-4">
      {linkLabel ? (
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-2 text-[14px] font-bold tracking-[0.04em] text-[#2459d6] underline-offset-4 hover:underline"
        >
          {linkLabel}
          <ExternalLink className="h-4 w-4" />
        </button>
      ) : null}
      <div className="overflow-hidden rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-white shadow-[0_18px_44px_rgba(5,32,49,0.06)] xl:mx-auto xl:max-w-[460px]">
        <img
          alt={alt}
          className="h-auto w-full object-cover xl:max-h-[520px] xl:object-contain"
          src={imageSrc}
        />
      </div>
    </div>
  );
}

export function ReviewActionCard({
  description,
  isReviewed,
  onReview,
}: {
  description: string;
  isReviewed: boolean;
  onReview: () => void;
}) {
  return (
    <ContentCard className="space-y-4">
      <StatusPill
        active={isReviewed}
        label={isReviewed ? "確認済み" : "未確認"}
      />
      <BodyText>{description}</BodyText>
      <Button
        type="button"
        size="lg"
        onClick={onReview}
        className={cn(
          "h-12 w-full rounded-[12px] px-6 text-[14px] font-semibold tracking-[0.08em]",
          isReviewed
            ? "bg-[rgba(111,91,59,0.12)] text-[var(--ichiyoshi-gold-soft)] hover:bg-[rgba(111,91,59,0.16)]"
            : "bg-white text-[var(--ichiyoshi-gold-soft)] shadow-[0_14px_32px_rgba(5,32,49,0.08)] ring-1 ring-[rgba(5,32,49,0.08)] hover:bg-[rgba(111,91,59,0.04)]"
        )}
      >
        <Eye className="h-4 w-4" />
        {isReviewed ? "書面確認済み" : "書面を確認する"}
      </Button>
      <p className="text-[13px] leading-6 text-[var(--ichiyoshi-ink-soft)]">
        書面確認後に「次へ」ボタンが有効になります。
      </p>
    </ContentCard>
  );
}

function ActionButton({
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Button
      size="lg"
      {...props}
      disabled={disabled}
      className={cn(
        "h-12 rounded-[12px] px-6 text-[14px] font-semibold tracking-[0.08em]",
        className
      )}
    >
      {children}
    </Button>
  );
}

export function PrimaryActionButton({
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <ActionButton
      {...props}
      disabled={disabled}
      className={cn(
        disabled
          ? "bg-[#d8d8d8] text-white hover:bg-[#d8d8d8]"
          : "bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] text-white shadow-[0_18px_40px_rgba(95,69,35,0.28)] hover:opacity-95"
      )}
    >
      {children}
    </ActionButton>
  );
}

export function SecondaryActionButton({
  children,
  ...props
}: ButtonProps) {
  return (
    <ActionButton
      variant="outline"
      {...props}
      className="border-[rgba(33,33,33,0.08)] bg-white text-[var(--ichiyoshi-gold-soft)] shadow-[0_14px_32px_rgba(5,32,49,0.06)] hover:bg-[rgba(111,91,59,0.04)]"
    >
      {children}
    </ActionButton>
  );
}

export function StepActionRow({
  primaryDisabled = false,
  primaryLabel,
  onPrimary,
  onSecondary,
  secondaryLabel,
}: {
  onPrimary: () => void;
  onSecondary: () => void;
  primaryDisabled?: boolean;
  primaryLabel: string;
  secondaryLabel: string;
}) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <SecondaryActionButton
        type="button"
        onClick={onSecondary}
        className="order-2 sm:order-1"
      >
        <ChevronLeft className="h-4 w-4" />
        {secondaryLabel}
      </SecondaryActionButton>
      <PrimaryActionButton
        type="button"
        onClick={onPrimary}
        disabled={primaryDisabled}
        className="order-1 sm:order-2"
      >
        {primaryLabel}
        <ChevronRight className="h-4 w-4" />
      </PrimaryActionButton>
    </div>
  );
}

export function ConfirmationRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-white shadow-[0_14px_32px_rgba(5,32,49,0.06)]">
      <div className="bg-[var(--ichiyoshi-section)] px-5 py-3">
        <p className="text-[14px] font-semibold leading-7 tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
          {label}
        </p>
      </div>
      <div className="px-5 py-4">
        <p className="text-[16px] font-bold leading-7 tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
          {value}
        </p>
      </div>
    </div>
  );
}
