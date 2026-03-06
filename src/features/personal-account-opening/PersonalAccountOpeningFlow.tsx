import { useState } from "react";

import {
  defaultPersonalAccountOpeningFormState,
  isEmailValid,
  isKanaValid,
  isPasswordValid,
  isPhoneComplete,
  type PersonalAccountOpeningErrors,
  type PersonalAccountOpeningFormState,
  type PersonalAccountOpeningStep,
} from "@/features/personal-account-opening/model";
import ContactStep from "@/features/personal-account-opening/screens/ContactStep";
import EmailSentStep from "@/features/personal-account-opening/screens/EmailSentStep";
import IdentityStep from "@/features/personal-account-opening/screens/IdentityStep";
import SecurityStep from "@/features/personal-account-opening/screens/SecurityStep";
import WelcomeStep from "@/features/personal-account-opening/screens/WelcomeStep";

type PersonalAccountOpeningFlowProps = {
  onBackToTop: () => void;
};

export default function PersonalAccountOpeningFlow({
  onBackToTop,
}: PersonalAccountOpeningFlowProps) {
  const [step, setStep] = useState<PersonalAccountOpeningStep>("welcome");
  const [formState, setFormState] = useState(defaultPersonalAccountOpeningFormState);
  const [errors, setErrors] = useState<PersonalAccountOpeningErrors>({});
  const [resendMessage, setResendMessage] = useState("");

  const updateField = <Key extends keyof PersonalAccountOpeningFormState>(
    key: Key,
    value: PersonalAccountOpeningFormState[Key]
  ) => {
    const fieldKey = String(key);

    setFormState((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (key === "birthYear" || key === "birthMonth" || key === "birthDay") {
      setErrors((current) => ({ ...current, birthDate: undefined }));
    }
    if (fieldKey.startsWith("mobilePhone")) {
      setErrors((current) => ({ ...current, mobilePhone: undefined }));
    }
    if (fieldKey.startsWith("homePhone")) {
      setErrors((current) => ({ ...current, homePhone: undefined }));
    }
    if (key === "emailOption") {
      setErrors((current) => ({ ...current, email: undefined, confirmEmail: undefined }));
    }
    setResendMessage("");
  };

  const handleIdentityNext = () => {
    const nextErrors: PersonalAccountOpeningErrors = {};

    if (!formState.lastNameKanji.trim()) {
      nextErrors.lastNameKanji = "姓を入力してください。";
    }
    if (!formState.firstNameKanji.trim()) {
      nextErrors.firstNameKanji = "名を入力してください。";
    }
    if (!formState.lastNameKana.trim()) {
      nextErrors.lastNameKana = "セイを入力してください。";
    } else if (!isKanaValid(formState.lastNameKana)) {
      nextErrors.lastNameKana = "全角カタカナで入力してください。";
    }
    if (!formState.firstNameKana.trim()) {
      nextErrors.firstNameKana = "メイを入力してください。";
    } else if (!isKanaValid(formState.firstNameKana)) {
      nextErrors.firstNameKana = "全角カタカナで入力してください。";
    }
    if (!formState.birthYear || !formState.birthMonth || !formState.birthDay) {
      nextErrors.birthDate = "生年月日を選択してください。";
    }
    if (!formState.gender) {
      nextErrors.gender = "性別を選択してください。";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setStep("contact");
    }
  };

  const handleContactNext = () => {
    const nextErrors: PersonalAccountOpeningErrors = {};
    const hasMobile = isPhoneComplete(
      formState.mobilePhone1,
      formState.mobilePhone2,
      formState.mobilePhone3
    );
    const hasHome = isPhoneComplete(
      formState.homePhone1,
      formState.homePhone2,
      formState.homePhone3
    );
    const anyMobileInput =
      formState.mobilePhone1 || formState.mobilePhone2 || formState.mobilePhone3;
    const anyHomeInput = formState.homePhone1 || formState.homePhone2 || formState.homePhone3;

    if (!hasMobile && !hasHome) {
      nextErrors.mobilePhone = "携帯電話番号または自宅電話番号を入力してください。";
      nextErrors.homePhone = "携帯電話番号または自宅電話番号を入力してください。";
    } else {
      if (anyMobileInput && !hasMobile) {
        nextErrors.mobilePhone = "携帯電話番号を最後まで入力してください。";
      }
      if (anyHomeInput && !hasHome) {
        nextErrors.homePhone = "自宅電話番号を最後まで入力してください。";
      }
    }

    if (formState.emailOption !== "hasEmail") {
      nextErrors.email = "現在はメールアドレスありの導線のみ対応しています。";
    } else {
      const email = formState.email.trim();
      const confirmEmail = formState.confirmEmail.trim();

      if (!email) {
        nextErrors.email = "メールアドレスを入力してください。";
      } else if (!isEmailValid(email)) {
        nextErrors.email = "メールアドレスの形式を確認してください。";
      }
      if (!confirmEmail) {
        nextErrors.confirmEmail = "確認用メールアドレスを入力してください。";
      } else if (confirmEmail !== email) {
        nextErrors.confirmEmail = "メールアドレスが一致していません。";
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setStep("security");
    }
  };

  const handleSecurityNext = () => {
    const nextErrors: PersonalAccountOpeningErrors = {};

    if (!formState.password) {
      nextErrors.password = "パスワードを入力してください。";
    } else if (!isPasswordValid(formState.password)) {
      nextErrors.password =
        "8文字以上16文字以内で、数字/英大文字/英小文字/記号から2種類以上を使用してください。";
    }

    if (!formState.confirmPassword) {
      nextErrors.confirmPassword = "確認用パスワードを入力してください。";
    } else if (formState.confirmPassword !== formState.password) {
      nextErrors.confirmPassword = "パスワードが一致していません。";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setResendMessage("");
      setStep("sent");
    }
  };

  if (step === "welcome") {
    return <WelcomeStep onBack={onBackToTop} onNext={() => setStep("identity")} />;
  }

  if (step === "identity") {
    return (
      <IdentityStep
        errors={errors}
        formState={formState}
        onBack={() => setStep("welcome")}
        onFieldChange={updateField}
        onNext={handleIdentityNext}
      />
    );
  }

  if (step === "contact") {
    return (
      <ContactStep
        errors={errors}
        formState={formState}
        onBack={() => setStep("identity")}
        onFieldChange={updateField}
        onNext={handleContactNext}
      />
    );
  }

  if (step === "security") {
    return (
      <SecurityStep
        errors={errors}
        formState={formState}
        onBack={() => setStep("contact")}
        onFieldChange={updateField}
        onNext={handleSecurityNext}
      />
    );
  }

  return (
    <EmailSentStep
      email={formState.email.trim() || "user-input@example.com"}
      resendMessage={resendMessage}
      onResend={() => {
        setResendMessage("メールを再送信しました。受信ボックスをご確認ください。");
      }}
      onReturnToTop={onBackToTop}
    />
  );
}
