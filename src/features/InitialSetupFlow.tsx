import { useEffect, useState } from "react";

import {
  defaultFormState,
  isEmailValid,
  isPasswordValid,
  type FormErrors,
  type FormState,
  type SetupStep,
} from "@/features/initial-setup/model";
import AccountOpeningStep1Flow from "@/features/account-opening-step1/AccountOpeningStep1Flow";
import { completedStep1State } from "@/features/account-opening-step1/model";
import AccountOpeningStep2Flow from "@/features/account-opening-step2/AccountOpeningStep2Flow";
import AccountScreen from "@/features/initial-setup/screens/AccountScreen";
import DoneScreen from "@/features/initial-setup/screens/DoneScreen";
import IntroScreen from "@/features/initial-setup/screens/IntroScreen";
import LoginScreen from "@/features/initial-setup/screens/LoginScreen";
import PortfolioAssetsScreen from "@/features/portfolio-assets/PortfolioAssetsScreen";
import TopScreen from "@/features/initial-setup/screens/TopScreen";
import VerifyScreen from "@/features/initial-setup/screens/VerifyScreen";
import PersonalAccountOpeningFlow from "@/features/personal-account-opening/PersonalAccountOpeningFlow";

type FlowScreen =
  | SetupStep
  | "top"
  | "member-registration"
  | "account-opening-step1"
  | "account-opening-step1-confirmation"
  | "account-opening-step2"
  | "portfolio-assets";

export default function InitialSetupFlow() {
  const [step, setStep] = useState<FlowScreen>("login");
  const [formState, setFormState] = useState(defaultFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [verifyMessage, setVerifyMessage] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const updateField = <Key extends keyof FormState,>(
    key: Key,
    value: FormState[Key]
  ) => {
    setFormState((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleStart = () => {
    setStep("account");
    setVerifyMessage("");
  };

  const resetSetupState = () => {
    setFormState(defaultFormState);
    setErrors({});
    setVerifyMessage("");
  };

  const handleAccountSubmit = () => {
    const nextErrors: FormErrors = {};
    const password = formState.password;
    const confirmPassword = formState.confirmPassword;
    const email = formState.email.trim();
    const confirmEmail = formState.confirmEmail.trim();

    if (!password) {
      nextErrors.password = "新しいパスワードを入力してください。";
    } else if (!isPasswordValid(password)) {
      nextErrors.password =
        "8文字以上16文字以内で、数字/英大文字/英小文字/記号から2種類以上を使用してください。";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "確認用パスワードを入力してください。";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "パスワードが一致していません。";
    }

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

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setStep("verify");
      setVerifyMessage("");
      setFormState((current) => ({ ...current, code: "" }));
    }
  };

  const handleVerifySubmit = () => {
    const code = formState.code.trim();
    const nextErrors: FormErrors = {};

    if (code.length !== 6) {
      nextErrors.code = "6桁の認証コードを入力してください。";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setStep("done");
      setVerifyMessage("");
    }
  };

  const handleResend = () => {
    setVerifyMessage("認証コードを再送信しました。");
    setFormState((current) => ({ ...current, code: "" }));
    setErrors((current) => ({ ...current, code: undefined }));
  };

  const handleBackToTop = () => {
    resetSetupState();
    setStep("top");
  };

  const handleLogout = () => {
    resetSetupState();
    setStep("login");
  };

  const emailDisplay = formState.email.trim() || "user-input@example.com";

  return (
    <>
      {step === "login" ? (
        <LoginScreen
          onLogin={() => {
            resetSetupState();
            setStep("top");
          }}
          onShowIntro={() => {
            resetSetupState();
            setStep("intro");
          }}
        />
      ) : null}
      {step === "top" ? (
        <TopScreen
          onLogout={handleLogout}
          onOpenPortfolioAssets={() => setStep("portfolio-assets")}
          onStartPersonalAccountOpening={() => setStep("account-opening-step1")}
          onStartMemberRegistration={() => setStep("member-registration")}
        />
      ) : null}
      {step === "portfolio-assets" ? (
        <PortfolioAssetsScreen onBackToTop={() => setStep("top")} />
      ) : null}
      {step === "account-opening-step1" ||
      step === "account-opening-step1-confirmation" ? (
        <AccountOpeningStep1Flow
          initialScreen={
            step === "account-opening-step1-confirmation"
              ? "confirmation"
              : "intro"
          }
          initialState={
            step === "account-opening-step1-confirmation"
              ? completedStep1State
              : undefined
          }
          onBackToTop={() => setStep("top")}
          onProceedToStep2={() => setStep("account-opening-step2")}
        />
      ) : null}
      {step === "account-opening-step2" ? (
        <AccountOpeningStep2Flow
          onBackToStep1={() => setStep("account-opening-step1-confirmation")}
        />
      ) : null}
      {step === "member-registration" ? (
        <PersonalAccountOpeningFlow onBackToTop={() => setStep("top")} />
      ) : null}
      {step === "intro" ? (
        <IntroScreen
          onBack={() => {
            resetSetupState();
            setStep("login");
          }}
          onStart={handleStart}
        />
      ) : null}
      {step === "account" ? (
        <AccountScreen
          errors={errors}
          formState={formState}
          onBack={() => setStep("intro")}
          onFieldChange={updateField}
          onSubmit={handleAccountSubmit}
        />
      ) : null}
      {step === "verify" ? (
        <VerifyScreen
          emailDisplay={emailDisplay}
          errors={errors}
          formState={formState}
          onBack={() => setStep("account")}
          onFieldChange={updateField}
          onResend={handleResend}
          onSubmit={handleVerifySubmit}
          verifyMessage={verifyMessage}
        />
      ) : null}
      {step === "done" ? <DoneScreen onBackToTop={handleBackToTop} /> : null}
    </>
  );
}
