import * as React from "react";

import { cn } from "@/lib/utils";

type OTPContext = {
  disabled?: boolean;
  value: string[];
  activeIndex: number;
  maxLength: number;
  registerSlotRef: (index: number, ref: HTMLInputElement | null) => void;
  setActiveIndex: (index: number) => void;
  updateSlotValue: (index: number, nextCharacter: string) => void;
  clearSlotValue: (index: number) => void;
  focusSlot: (index: number) => void;
  handleSlotPaste: (
    index: number,
    event: React.ClipboardEvent<HTMLInputElement>
  ) => void;
  handleSlotKeyDown: (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void;
};

const InputOTPContext = React.createContext<OTPContext | null>(null);

type InputOTPProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
  defaultValue?: string;
  value?: string;
  maxLength?: number;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
};

const normalize = (value: string, maxLength: number) =>
  value.replace(/\D/g, "").slice(0, maxLength);

const toSlots = (value: string, maxLength: number) =>
  Array.from({ length: maxLength }, (_, index) => value[index] ?? "");

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  (
    {
      className,
      maxLength = 6,
      value,
      defaultValue = "",
      onChange,
      onComplete,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const slotRefs = React.useRef<Array<HTMLInputElement | null>>([]);
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(
      () => normalize(defaultValue, maxLength)
    );
    const [activeIndex, setActiveIndex] = React.useState(0);

    const currentValue = isControlled
      ? normalize(value ?? "", maxLength)
      : internalValue;
    const slots = toSlots(currentValue, maxLength);

    const commitValue = React.useCallback(
      (nextValue: string) => {
        const normalized = normalize(nextValue, maxLength);
        const nextSlots = toSlots(normalized, maxLength);
        if (!isControlled) {
          setInternalValue(normalized);
        }

        onChange?.(normalized);

        if (nextSlots.every((item) => item !== "")) {
          onComplete?.(normalized);
        }
      },
      [isControlled, maxLength, onChange, onComplete]
    );

    const focusSlot = React.useCallback(
      (index: number) => {
        const target = slotRefs.current[index];
        if (target && !disabled) {
          target.focus();
        }
      },
      [disabled]
    );

    const registerSlotRef = React.useCallback(
      (index: number, inputRef: HTMLInputElement | null) => {
        slotRefs.current[index] = inputRef;
      },
      []
    );

    const setSlot = React.useCallback(
      (index: number, nextCharacter: string) => {
        const next = [...slots];
        if (nextCharacter === "") {
          next[index] = "";
        } else {
          next[index] = normalize(nextCharacter, 1);
        }

        const nextValue = next.join("");
        const nextActiveIndex = Math.min(index + 1, maxLength - 1);

        commitValue(nextValue);
        setActiveIndex(nextActiveIndex);
        focusSlot(nextActiveIndex);
      },
      [slots, focusSlot, maxLength, commitValue]
    );

    const clearSlot = React.useCallback(
      (index: number) => {
        const next = [...slots];
        next[index] = "";

        commitValue(next.join(""));
        focusSlot(index);
        setActiveIndex(index);
      },
      [slots, commitValue, focusSlot]
    );

    const handleSlotPaste = React.useCallback(
      (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
        const text = normalize(event.clipboardData.getData("text/plain"), maxLength);
        if (!text) {
          return;
        }
        event.preventDefault();

        const next = [...slots];
        const charArray = text.split("");
        for (
          let charIndex = 0;
          charIndex < charArray.length && index + charIndex < maxLength;
          charIndex += 1
        ) {
          next[index + charIndex] = charArray[charIndex];
        }

        const nextValue = next.join("");
        commitValue(nextValue);

        const nextFocus = Math.min(index + charArray.length, maxLength - 1);
        focusSlot(nextFocus);
        setActiveIndex(nextFocus);
      },
      [slots, maxLength, commitValue, focusSlot]
    );

    const handleSlotKeyDown = React.useCallback(
      (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) {
          return;
        }

        if (event.key === "Backspace") {
          event.preventDefault();

          if (slots[index]) {
            clearSlot(index);
          } else if (index > 0) {
            focusSlot(index - 1);
            setActiveIndex(index - 1);
          }
          return;
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          if (index > 0) {
            focusSlot(index - 1);
            setActiveIndex(index - 1);
          }
          return;
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          if (index + 1 < maxLength) {
            focusSlot(index + 1);
            setActiveIndex(index + 1);
          }
          return;
        }

        if (event.key === "Delete") {
          event.preventDefault();
          clearSlot(index);
          return;
        }

        if (/^\d$/.test(event.key)) {
          event.preventDefault();
          setSlot(index, event.key);
        }
      },
      [disabled, slots, clearSlot, focusSlot, maxLength, setSlot]
    );

    return (
      <InputOTPContext.Provider
        value={{
          disabled,
          value: slots,
          activeIndex,
          maxLength,
          registerSlotRef,
          setActiveIndex,
          updateSlotValue: setSlot,
          clearSlotValue: clearSlot,
          focusSlot,
          handleSlotPaste,
          handleSlotKeyDown,
        }}
      >
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </InputOTPContext.Provider>
    );
  }
);

InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
));

InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-shrink-0 px-2 text-muted-foreground", className)}
    {...props}
  >
    |
  </div>
));

InputOTPSeparator.displayName = "InputOTPSeparator";

type InputOTPSlotProps = React.InputHTMLAttributes<HTMLInputElement> & {
  index: number;
};

const InputOTPSlot = React.forwardRef<HTMLInputElement, InputOTPSlotProps>(
  ({ className, index, ...props }, ref) => {
    const context = React.useContext(InputOTPContext);
    if (!context) {
      throw new Error("InputOTPSlot must be used within InputOTP");
    }

    return (
      <input
        ref={(input) => {
          context.registerSlotRef(index, input);
          if (typeof ref === "function") {
            ref(input);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current = input;
          }
        }}
        className={cn(
          "relative h-11 w-11 rounded-md border border-solid border-input bg-background text-center text-sm text-foreground transition-all disabled:cursor-not-allowed disabled:opacity-50",
          context.activeIndex === index &&
            "z-10 ring-2 ring-ring ring-offset-2 ring-offset-background",
          className
        )}
        style={{ borderWidth: "1px", borderStyle: "solid", ...(props.style as React.CSSProperties) }}
        maxLength={1}
        inputMode="numeric"
        pattern="[0-9]*"
        value={context.value[index] ?? ""}
        onChange={(event) => context.updateSlotValue(index, event.target.value)}
        onKeyDown={(event) => context.handleSlotKeyDown(index, event)}
        onFocus={() => context.setActiveIndex(index)}
        onPaste={(event) => context.handleSlotPaste(index, event)}
        disabled={context.disabled}
        {...props}
      />
    );
  }
);

InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
