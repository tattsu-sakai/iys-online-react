import { useEffect } from "react";
import { useAtom, useSetAtom } from 'jotai';
import { useLocation, useNavigate } from "react-router-dom";

import {
  defaultFormState,
  isEmailValid,
  isPasswordValid,
  type FormErrors,
  type FormState,
} from "@/features/initial-setup/model";
import {
  initialSetupErrorsAtom,
  initialSetupFormStateAtom,
  initialSetupVerifyMessageAtom,
  resetInitialSetupStateAtom,
} from '@/features/initial-setup/state';
import {
  flowPaths,
  getPortfolioAssetsPath,
  getFlowScreenFromPathname,
} from "@/features/flow-routes";
import AccountOpeningStep1Flow from "@/features/account-opening-step1/AccountOpeningStep1Flow";
import { completedStep1State } from "@/features/account-opening-step1/model";
import type { Step1Screen } from "@/features/account-opening-step1/model";
import { resetStep1StateAtom } from '@/features/account-opening-step1/state';
import AccountOpeningStep2Flow from "@/features/account-opening-step2/AccountOpeningStep2Flow";
import { resetStep2StateAtom } from '@/features/account-opening-step2/state';
import ApplicationsScreen from "@/features/applications/ApplicationsScreen";
import CustomerInfoScreen from "@/features/customer-info/CustomerInfoScreen";
import AccountScreen from "@/features/initial-setup/screens/AccountScreen";
import DoneScreen from "@/features/initial-setup/screens/DoneScreen";
import IntroScreen from "@/features/initial-setup/screens/IntroScreen";
import LoginScreen from "@/features/initial-setup/screens/LoginScreen";
import PortfolioAssetsScreen from "@/features/portfolio-assets/PortfolioAssetsScreen";
import TradeHistoryScreen from "@/features/trade-history/TradeHistoryScreen";
import TopScreen from "@/features/initial-setup/screens/TopScreen";
import VerifyScreen from "@/features/initial-setup/screens/VerifyScreen";
import PersonalAccountOpeningFlow from "@/features/personal-account-opening/PersonalAccountOpeningFlow";
import type { PersonalAccountOpeningStep } from "@/features/personal-account-opening/model";
import { resetPersonalAccountOpeningStateAtom } from '@/features/personal-account-opening/state';

export default function InitialSetupFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formState, setFormState] = useAtom(initialSetupFormStateAtom);
  const [errors, setErrors] = useAtom(initialSetupErrorsAtom);
  const [verifyMessage, setVerifyMessage] = useAtom(initialSetupVerifyMessageAtom);
  const resetInitialSetupState = useSetAtom(resetInitialSetupStateAtom);
  const resetStep1State = useSetAtom(resetStep1StateAtom);
  const resetStep2State = useSetAtom(resetStep2StateAtom);
  const resetPersonalAccountOpeningState = useSetAtom(resetPersonalAccountOpeningStateAtom);
  const step = getFlowScreenFromPathname(location.pathname);
  const step1Screen: Step1Screen | null =
    step === "accountOpeningStep1Intro"
      ? "intro"
      : step === "accountOpeningStep1ElectronicDelivery"
        ? "electronic-delivery"
        : step === "accountOpeningStep1DocumentsReview"
          ? "documents-review"
          : step === "accountOpeningStep1Confirmation"
            ? "confirmation"
            : null;
  const memberRegistrationStep: PersonalAccountOpeningStep | null =
    step === "memberRegistrationWelcome"
      ? "welcome"
      : step === "memberRegistrationIdentity"
        ? "identity"
        : step === "memberRegistrationContact"
          ? "contact"
          : step === "memberRegistrationSecurity"
            ? "security"
            : step === "memberRegistrationSent"
              ? "sent"
              : null;

  useEffect(() => {
    if (!step) {
      navigate(flowPaths.login, { replace: true });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate, step, location.pathname]);

  const updateField = <Key extends keyof FormState,>(
    key: Key,
    value: FormState[Key]
  ) => {
    setFormState((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleStart = () => {
    navigate(flowPaths.account);
    setVerifyMessage("");
  };

  const resetSetupState = () => {
    resetInitialSetupState();
  };

  const resetApplicationFlows = () => {
    resetStep1State();
    resetStep2State();
    resetPersonalAccountOpeningState();
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
      navigate(flowPaths.verify);
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
      navigate(flowPaths.done);
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
    navigate(flowPaths.top);
  };

  const handleLogout = () => {
    resetSetupState();
    resetApplicationFlows();
    navigate(flowPaths.login);
  };

  const emailDisplay = formState.email.trim() || "user-input@example.com";

  if (!step) {
    return null;
  }

  return (
    <>
      {step === "login" ? (
        <LoginScreen
          onLogin={() => {
            resetSetupState();
            resetApplicationFlows();
            navigate(flowPaths.top);
          }}
          onStartMemberRegistration={() => {
            resetSetupState();
            resetPersonalAccountOpeningState();
            navigate(flowPaths.memberRegistrationWelcome);
          }}
          onShowIntro={() => {
            resetSetupState();
            navigate(flowPaths.intro);
          }}
        />
      ) : null}
      {step === "top" ? (
        <TopScreen
          onLogout={handleLogout}
          onOpenApplications={() => navigate(flowPaths.applications)}
          onOpenCustomerInfo={() => navigate(flowPaths.customerInfo)}
          onOpenPortfolioAssets={(tab) =>
            navigate(getPortfolioAssetsPath(tab))
          }
          onOpenTradeHistory={() => navigate(flowPaths.tradeHistory)}
          onStartPersonalAccountOpening={() => {
            resetStep1State();
            resetStep2State();
            navigate(flowPaths.accountOpeningStep1Intro)
          }}
        />
      ) : null}
      {step === "portfolioAssets" ? (
        <PortfolioAssetsScreen
          onBackToTop={() => navigate(flowPaths.top)}
          onOpenApplications={() => navigate(flowPaths.applications)}
          onOpenCustomerInfo={() => navigate(flowPaths.customerInfo)}
          onOpenTradeHistory={() => navigate(flowPaths.tradeHistory)}
          onLogout={handleLogout}
        />
      ) : null}
      {step === "tradeHistory" ? (
        <TradeHistoryScreen
          onBackToTop={() => navigate(flowPaths.top)}
          onOpenApplications={() => navigate(flowPaths.applications)}
          onOpenCustomerInfo={() => navigate(flowPaths.customerInfo)}
          onOpenPortfolioAssets={(tab) =>
            navigate(getPortfolioAssetsPath(tab))
          }
          onLogout={handleLogout}
        />
      ) : null}
      {step === "applications" ? (
        <ApplicationsScreen
          onBackToTop={() => navigate(flowPaths.top)}
          onOpenCustomerInfo={() => navigate(flowPaths.customerInfo)}
          onOpenTradeHistory={() => navigate(flowPaths.tradeHistory)}
          onLogout={handleLogout}
          onOpenPortfolioAssets={(tab) =>
            navigate(getPortfolioAssetsPath(tab))
          }
        />
      ) : null}
      {step === "customerInfo" ? (
        <CustomerInfoScreen
          onBackToTop={() => navigate(flowPaths.top)}
          onOpenApplications={() => navigate(flowPaths.applications)}
          onOpenTradeHistory={() => navigate(flowPaths.tradeHistory)}
          onLogout={handleLogout}
          onOpenPortfolioAssets={(tab) =>
            navigate(getPortfolioAssetsPath(tab))
          }
        />
      ) : null}
      {step1Screen ? (
        <AccountOpeningStep1Flow
          screen={step1Screen}
          initialState={
            step1Screen === "confirmation"
              ? completedStep1State
              : undefined
          }
          onBackToTop={() => {
            resetStep1State();
            resetStep2State();
            navigate(flowPaths.top);
          }}
          onProceedToStep2={() => {
            resetStep2State();
            navigate(flowPaths.accountOpeningStep2);
          }}
          onScreenChange={(nextScreen) => {
            const nextPath =
              nextScreen === "intro"
                ? flowPaths.accountOpeningStep1Intro
                : nextScreen === "electronic-delivery"
                  ? flowPaths.accountOpeningStep1ElectronicDelivery
                  : nextScreen === "documents-review"
                    ? flowPaths.accountOpeningStep1DocumentsReview
                    : flowPaths.accountOpeningStep1Confirmation;

            navigate(nextPath);
          }}
        />
      ) : null}
      {step === "accountOpeningStep2" ? (
        <AccountOpeningStep2Flow
          onBackToStep1={() =>
            navigate(flowPaths.accountOpeningStep1Confirmation)
          }
        />
      ) : null}
      {memberRegistrationStep ? (
        <PersonalAccountOpeningFlow
          onBackToLogin={() => {
            resetPersonalAccountOpeningState();
            navigate(flowPaths.login);
          }}
          onStepChange={(nextStep) => {
            const nextPath =
              nextStep === "welcome"
                ? flowPaths.memberRegistrationWelcome
                : nextStep === "identity"
                  ? flowPaths.memberRegistrationIdentity
                  : nextStep === "contact"
                    ? flowPaths.memberRegistrationContact
                    : nextStep === "security"
                      ? flowPaths.memberRegistrationSecurity
                      : flowPaths.memberRegistrationSent;

            navigate(nextPath);
          }}
          step={memberRegistrationStep}
        />
      ) : null}
      {step === "intro" ? (
        <IntroScreen
          onBack={() => {
            resetSetupState();
            navigate(flowPaths.login);
          }}
          onStart={handleStart}
        />
      ) : null}
      {step === "account" ? (
        <AccountScreen
          errors={errors}
          formState={formState}
          onBack={() => navigate(flowPaths.intro)}
          onFieldChange={updateField}
          onSubmit={handleAccountSubmit}
        />
      ) : null}
      {step === "verify" ? (
        <VerifyScreen
          emailDisplay={emailDisplay}
          errors={errors}
          formState={formState}
          onBack={() => navigate(flowPaths.account)}
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
