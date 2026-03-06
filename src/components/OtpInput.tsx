import * as React from "react";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type OtpInputProps = Omit<
  React.ComponentPropsWithoutRef<typeof InputOTP>,
  "children" | "maxLength"
> & {
  length?: number;
  slotClassName?: string;
};

export function OtpInput({
  length = 6,
  slotClassName,
  ...inputOtpProps
}: OtpInputProps) {
  return (
    <InputOTP maxLength={length} {...inputOtpProps}>
      <InputOTPGroup>
        {Array.from({ length }, (_, index) => (
          <InputOTPSlot key={index} index={index} className={slotClassName} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}

export default OtpInput;
