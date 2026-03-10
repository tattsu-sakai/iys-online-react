import { type ReactNode } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BodyText,
  ContentCard,
  Step1Shell,
} from "@/features/account-opening-step1/components";
import { cn } from "@/lib/utils";

export { BodyText, ContentCard };

export function Step2Shell({
  children,
  description,
  nodeId,
  screenIndex,
  title,
}: {
  children: ReactNode;
  description: string;
  nodeId?: string;
  screenIndex: number;
  title: string;
}) {
  return (
    <Step1Shell
      currentOverallStep={2}
      description={description}
      eyebrow="Personal Account Opening"
      nodeId={nodeId}
      screenIndex={screenIndex}
      screenTotal={1}
      showOverallProgress
      title={title}
    >
      {children}
    </Step1Shell>
  );
}

export function Step2Section({
  children,
  dataNodeId,
  description,
  title,
}: {
  children: ReactNode;
  dataNodeId?: string;
  description?: string;
  title: string;
}) {
  return (
    <ContentCard
      className="overflow-hidden border border-[rgba(5,32,49,0.06)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,249,0.92))] p-0 sm:p-0 xl:p-0"
      data-node-id={dataNodeId}
    >
      <div className="border-b border-[rgba(5,32,49,0.06)] bg-[linear-gradient(135deg,rgba(162,133,86,0.12),rgba(255,255,255,0.96)_44%,rgba(62,96,116,0.06)_100%)] px-4 py-4 sm:px-6">
        <span className="inline-flex rounded-full border border-[rgba(111,91,59,0.12)] bg-white/82 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--ichiyoshi-gold-soft)]">
          Address Flow
        </span>
        <div className="mt-3">
          <h2 className="text-[20px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <div className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">{children}</div>
    </ContentCard>
  );
}

export function FormLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--ichiyoshi-gold-soft)]">
      {children}
    </p>
  );
}

export function SectionNote({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <p
      className={cn(
        "text-[14px] leading-7 tracking-[0.02em]",
        tone === "danger"
          ? "text-[#b61704]"
          : "text-[var(--ichiyoshi-ink-soft)]"
      )}
    >
      {children}
    </p>
  );
}

export function Step2Input({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "h-12 rounded-[12px] border-[rgba(5,32,49,0.1)] bg-white/96 px-4 text-[15px] font-semibold tracking-[0.03em] text-[var(--ichiyoshi-navy)] shadow-[0_6px_18px_rgba(5,32,49,0.04)] placeholder:font-medium placeholder:text-[#9e9e9e] focus-visible:border-[var(--ichiyoshi-gold-soft)] focus-visible:ring-[rgba(162,133,86,0.18)] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:border-[#e0e0e0] disabled:bg-[#f2f2f2] disabled:text-[#9e9e9e] disabled:opacity-100",
        className
      )}
      {...props}
    />
  );
}

export function SearchAddressButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-12 rounded-[12px] px-5 text-[14px] font-semibold tracking-[0.08em]",
        disabled
          ? "bg-[#e0e0e0] text-white hover:bg-[#e0e0e0]"
          : "bg-[linear-gradient(135deg,#85683f_0%,#6f5b3b_55%,#59492f_100%)] text-white shadow-[0_18px_40px_rgba(95,69,35,0.2)] hover:opacity-95"
      )}
    >
      <Search className="h-4 w-4" />
      住所検索
    </Button>
  );
}

export function SelectedTownButton({
  disabled,
  onClick,
  value,
}: {
  disabled: boolean;
  onClick: () => void;
  value: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex min-h-[52px] w-full items-center justify-between rounded-[12px] border border-[rgba(5,32,49,0.1)] px-4 py-3 text-left shadow-[0_6px_18px_rgba(5,32,49,0.04)] transition-colors",
        disabled
          ? "cursor-not-allowed bg-[#f2f2f2] text-[#9e9e9e]"
          : "bg-white text-[var(--ichiyoshi-navy)] hover:bg-[rgba(5,32,49,0.02)]"
      )}
    >
      <span
        className={cn(
          "text-[15px] font-semibold tracking-[0.03em]",
          !value && "text-[#9e9e9e]"
        )}
      >
        {value || "ー"}
      </span>
      <ChevronDown className="h-4 w-4" />
    </button>
  );
}

export function ResidentCheckboxRow({
  checked,
  children,
  onToggle,
}: {
  checked: boolean;
  children: ReactNode;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-start gap-3 rounded-[14px] border px-4 py-4 text-left shadow-[0_8px_20px_rgba(5,32,49,0.05)] transition-colors",
        checked
          ? "border-[rgba(111,91,59,0.18)] bg-[linear-gradient(135deg,rgba(133,104,63,0.1),rgba(255,255,255,0.96)_58%,rgba(5,32,49,0.03)_100%)]"
          : "border-[rgba(5,32,49,0.08)] bg-white hover:bg-[rgba(5,32,49,0.02)]"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border-[1.5px]",
          checked
            ? "border-[var(--ichiyoshi-gold-soft)] bg-[rgba(111,91,59,0.12)] text-[var(--ichiyoshi-gold-soft)]"
            : "border-[#bdbdbd] bg-white text-transparent"
        )}
      >
        <Check className="h-4 w-4" />
      </span>
      <span className="text-[15px] font-semibold leading-7 tracking-[0.03em] text-[var(--ichiyoshi-navy)]">
        {children}
      </span>
    </button>
  );
}

export function Step2Select({
  children,
  className,
  disabled,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-12 w-full appearance-none rounded-[12px] border border-[rgba(5,32,49,0.1)] bg-white px-4 pr-10 text-[15px] font-semibold tracking-[0.03em] text-[var(--ichiyoshi-navy)] shadow-[0_6px_18px_rgba(5,32,49,0.04)] outline-none transition-shadow focus:border-[var(--ichiyoshi-gold-soft)] focus:ring-2 focus:ring-[rgba(162,133,86,0.16)] disabled:cursor-not-allowed disabled:bg-[#f2f2f2] disabled:text-[#9e9e9e]",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#616161]" />
    </div>
  );
}

export function ResidencyRadioRow({
  checked,
  children,
  onSelect,
}: {
  checked: boolean;
  children: ReactNode;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-[14px] border px-4 py-4 text-left shadow-[0_8px_20px_rgba(5,32,49,0.05)] transition-colors",
        checked
          ? "border-[rgba(111,91,59,0.18)] bg-[linear-gradient(135deg,rgba(133,104,63,0.1),rgba(255,255,255,0.96)_58%,rgba(5,32,49,0.03)_100%)]"
          : "border-[rgba(5,32,49,0.08)] bg-white hover:bg-[rgba(5,32,49,0.02)]"
      )}
    >
      <span className="flex h-[30px] w-[30px] items-center justify-center">
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border-2",
            checked
              ? "border-[var(--ichiyoshi-gold-soft)]"
              : "border-[#bdbdbd]"
          )}
        >
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              checked ? "bg-[var(--ichiyoshi-gold-soft)]" : "bg-transparent"
            )}
          />
        </span>
      </span>
      <span className="text-[15px] font-semibold leading-7 tracking-[0.03em] text-[var(--ichiyoshi-navy)]">
        {children}
      </span>
    </button>
  );
}

export function TownSelectionDialog({
  onClose,
  onSelect,
  open,
  options,
}: {
  onClose: () => void;
  onSelect: (value: string) => void;
  open: boolean;
  options: readonly string[];
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[rgba(5,32,49,0.36)] px-3 py-[66px] backdrop-blur-sm sm:px-6"
      data-node-id="32374:74664"
    >
      <div className="flex h-[min(680px,calc(100vh-96px))] w-full max-w-[460px] flex-col overflow-hidden rounded-[18px] border border-[rgba(5,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,249,0.96))] shadow-[0_28px_70px_rgba(5,32,49,0.24)]">
        <div className="flex items-center justify-between border-b border-[rgba(5,32,49,0.08)] px-5 py-4">
          <span className="h-8 w-8" aria-hidden="true" />
          <h3 className="text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
            町名選択
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#9e9e9e] transition-colors hover:bg-[rgba(5,32,49,0.04)] hover:text-[var(--ichiyoshi-navy)]"
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[rgba(5,32,49,0.03)] p-4">
          <div className="mb-3 rounded-[12px] border border-[rgba(5,32,49,0.06)] bg-white/92 px-4 py-3 text-[13px] leading-6 text-[var(--ichiyoshi-ink-soft)]">
            郵便番号に一致する候補から町名を選択してください。
          </div>
          <div className="overflow-hidden rounded-[14px] border border-[rgba(5,32,49,0.06)] bg-white">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onSelect(option)}
                className="flex w-full items-center border-b border-[rgba(5,32,49,0.06)] px-4 py-4 text-left text-[15px] font-semibold tracking-[0.03em] text-[var(--ichiyoshi-navy)] transition-colors hover:bg-[rgba(5,32,49,0.02)]"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
