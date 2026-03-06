import { type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BrandMark,
  ContentCard,
  HintCard,
  PhoneStatusBar,
  PrimaryButton,
  SecondaryButton,
  companyInfoLines,
} from "@/features/initial-setup/components";
import {
  openingSteps,
  type PersonalAccountOpeningStep,
} from "@/features/personal-account-opening/model";
import { cn } from "@/lib/utils";

export { ContentCard, HintCard, PrimaryButton, SecondaryButton };

function OpeningHeader({
  description,
  step,
  title,
}: {
  description: string;
  step: PersonalAccountOpeningStep;
  title: string;
}) {
  const currentIndex = openingSteps.findIndex((item) => item.key === step);

  return (
    <header className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-[rgba(255,255,255,0.12)]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#2a3f4a_0%,#486371_54%,#8f7c63_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(12,27,36,0.12))]" />
      <div className="pointer-events-none absolute -right-10 top-3 h-32 w-32 rounded-full bg-[rgba(255,255,255,0.1)] blur-3xl" />
      <div className="pointer-events-none absolute left-10 top-14 h-24 w-24 rounded-full bg-[rgba(234,224,200,0.16)] blur-2xl" />

      <div className="relative mx-auto w-full max-w-[1180px] px-4 pb-6 pt-5 sm:px-6 xl:px-8 xl:pb-7 xl:pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)] backdrop-blur">
            Step {currentIndex + 1}/{openingSteps.length}
          </span>
          <span className="text-[12px] font-semibold tracking-[0.14em] text-white/78 [text-shadow:0_1px_10px_rgba(0,0,0,0.24)]">
            MEMBER REGISTRATION
          </span>
        </div>

        <div className="mt-4 max-w-[46rem] rounded-[20px] border border-white/10 bg-[rgba(24,35,46,0.18)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-5">
          <h1 className="text-[25px] font-bold leading-[1.3] tracking-[0.04em] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.28)] sm:text-[30px]">
            {title}
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.22)] sm:text-[14px]">
            {description}
          </p>
        </div>

        <div className="mt-5 hidden gap-2 xl:grid xl:grid-cols-5">
          {openingSteps.map((item, index) => (
            <div
              key={item.key}
              className={cn(
                "rounded-[16px] border px-3 py-3 backdrop-blur",
                index <= currentIndex
                  ? "border-[rgba(255,255,255,0.18)] bg-white/14 text-white"
                  : "border-[rgba(255,255,255,0.08)] bg-white/6 text-white/62"
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Step {index + 1}
              </p>
              <p className="mt-2 text-[14px] font-bold tracking-[0.04em]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

function OpeningFooter() {
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

export function AccountOpeningShell({
  aside,
  children,
  description,
  step,
  title,
}: {
  aside?: ReactNode;
  children: ReactNode;
  description: string;
  step: PersonalAccountOpeningStep;
  title: string;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(162,133,86,0.18),transparent_24%),radial-gradient(circle_at_90%_10%,rgba(5,32,49,0.16),transparent_20%),linear-gradient(180deg,#f7f3eb_0%,#eef2f4_34%,#e6ebee_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1380px] flex-col">
        <section className="relative flex flex-1 items-stretch justify-center px-0 py-0 sm:px-4 lg:px-6 xl:px-10">
          <div className="relative w-full max-w-[1180px]">
            <div className="pointer-events-none absolute inset-x-10 top-5 h-32 rounded-full bg-[rgba(162,133,86,0.18)] blur-3xl" />

            <div className="relative">
              <PhoneStatusBar />
              <OpeningHeader description={description} step={step} title={title} />

              <div className="px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8">
                <div
                  className={cn(
                    "space-y-5",
                    aside && "xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)] xl:items-start xl:gap-5 xl:space-y-0"
                  )}
                >
                  <div>{children}</div>
                  {aside ? <div className="space-y-5">{aside}</div> : null}
                </div>
              </div>

              <OpeningFooter />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export function OpeningSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-[20px] border border-[rgba(5,32,49,0.08)] bg-white/96 shadow-[0_18px_44px_rgba(5,32,49,0.06)]">
      <div className="flex items-center border-b border-[rgba(5,32,49,0.06)] bg-[linear-gradient(180deg,#edf2f4_0%,#e7edf1_100%)] px-5 py-4">
        <span className="mr-4 h-12 w-1.5 rounded-full bg-[var(--ichiyoshi-navy)]" />
        <h2 className="text-[20px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
          {title}
        </h2>
      </div>
      <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </section>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="block text-[13px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-ink-soft)]">
      {children}
    </span>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) {
    return null;
  }

  return <p className="text-[13px] leading-6 text-[#b61704]">{children}</p>;
}

export function OpeningInput({
  className,
  error,
  ...props
}: React.ComponentProps<typeof Input> & { error?: string }) {
  return (
    <Input
      className={cn(
        "h-12 rounded-[14px] border-[rgba(5,32,49,0.12)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] px-4 text-[16px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)] placeholder:font-medium placeholder:text-[#92a0ab] focus-visible:border-[var(--ichiyoshi-gold-soft)] focus-visible:ring-[rgba(162,133,86,0.16)]",
        error &&
          "border-[#b61704] bg-[#fff5f4] focus-visible:border-[#b61704] focus-visible:ring-[rgba(182,23,4,0.16)]",
        className
      )}
      {...props}
    />
  );
}

export function OpeningSelect({
  className,
  error,
  children,
  ...props
}: React.ComponentProps<"select"> & { error?: string }) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-12 w-full appearance-none rounded-[14px] border border-[rgba(5,32,49,0.12)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] px-4 pr-10 text-[16px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)] outline-none transition-shadow focus:border-[var(--ichiyoshi-gold-soft)] focus:ring-2 focus:ring-[rgba(162,133,86,0.16)]",
          error && "border-[#b61704] bg-[#fff5f4] focus:border-[#b61704] focus:ring-[rgba(182,23,4,0.16)]",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ichiyoshi-ink-soft)]" />
    </div>
  );
}

export function ChoiceButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={cn(
        "h-auto w-full justify-start rounded-[16px] border px-4 py-4 text-left shadow-none",
        active
          ? "border-[rgba(162,133,86,0.34)] bg-[rgba(162,133,86,0.1)] text-[var(--ichiyoshi-navy)]"
          : "border-[rgba(5,32,49,0.08)] bg-white/80 text-[var(--ichiyoshi-navy)]"
      )}
    >
      <span
        className={cn(
          "mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2",
          active
            ? "border-[var(--ichiyoshi-gold-soft)] bg-[var(--ichiyoshi-gold-soft)] text-white"
            : "border-[#bdbdbd] bg-white text-transparent"
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
      <span className="text-[15px] font-bold tracking-[0.04em]">{children}</span>
    </Button>
  );
}

export function SegmentInput({
  error,
  label,
  onChange,
  placeholders,
  values,
}: {
  error?: string;
  label: string;
  onChange: (index: number, value: string) => void;
  placeholders: [string, string, string];
  values: [string, string, string];
}) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
        {values.map((value, index) => (
          <div key={placeholders[index]} className="contents">
            <OpeningInput
              error={error}
              inputMode="numeric"
              maxLength={index === 0 ? 4 : 4}
              placeholder={placeholders[index]}
              value={value}
              onChange={(event) => onChange(index, event.target.value.replace(/\D/g, "").slice(0, 4))}
              className="text-center tracking-[0.08em]"
            />
            {index < values.length - 1 ? (
              <span className="text-[18px] font-bold text-[var(--ichiyoshi-navy)]">-</span>
            ) : null}
          </div>
        ))}
      </div>
      <FieldError>{error}</FieldError>
    </div>
  );
}
