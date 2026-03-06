import { useEffect, useMemo, useState } from "react";

import {
  allStep1DocumentsReviewed,
  defaultStep1State,
  type Step1State,
  step1ScreenOrder,
  type Step1DocumentKey,
  type Step1Screen,
} from "@/features/account-opening-step1/model";
import Step1ConfirmationScreen from "@/features/account-opening-step1/screens/Step1ConfirmationScreen";
import Step1DocumentsReviewScreen from "@/features/account-opening-step1/screens/Step1DocumentsReviewScreen";
import Step1ElectronicDeliveryScreen from "@/features/account-opening-step1/screens/Step1ElectronicDeliveryScreen";
import Step1IntroScreen from "@/features/account-opening-step1/screens/Step1IntroScreen";

type AccountOpeningStep1FlowProps = {
  onBackToTop: () => void;
  onProceedToStep2: () => void;
  initialScreen?: Step1Screen;
  initialState?: Step1State;
};

export default function AccountOpeningStep1Flow({
  onBackToTop,
  onProceedToStep2,
  initialScreen = "intro",
  initialState = defaultStep1State,
}: AccountOpeningStep1FlowProps) {
  const [screen, setScreen] = useState<Step1Screen>(initialScreen);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    setScreen(initialScreen);
    setState(initialState);
  }, [initialScreen, initialState]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);

  const screenIndex = useMemo(
    () => step1ScreenOrder.indexOf(screen) + 1,
    [screen]
  );

  const handleBack = () => {
    const currentIndex = step1ScreenOrder.indexOf(screen);

    if (currentIndex <= 0) {
      onBackToTop();
      return;
    }

    setScreen(step1ScreenOrder[currentIndex - 1]);
  };

  const handleNext = () => {
    const currentIndex = step1ScreenOrder.indexOf(screen);
    const nextScreen = step1ScreenOrder[currentIndex + 1];

    if (nextScreen) {
      setScreen(nextScreen);
    }
  };

  const handleDocumentReviewed = (documentKey: Step1DocumentKey) => {
    setState((current) => ({
      ...current,
      reviewedDocuments: {
        ...current.reviewedDocuments,
        [documentKey]: true,
      },
    }));
  };

  if (screen === "intro") {
    return (
      <Step1IntroScreen
        onBackToTop={onBackToTop}
        onNext={handleNext}
        screenIndex={screenIndex}
      />
    );
  }

  if (screen === "electronic-delivery") {
    return (
      <Step1ElectronicDeliveryScreen
        agreed={state.electronicDeliveryAgreed}
        onBack={handleBack}
        onNext={handleNext}
        onToggleAgreement={() =>
          setState((current) => ({
            ...current,
            electronicDeliveryAgreed: !current.electronicDeliveryAgreed,
          }))
        }
        screenIndex={screenIndex}
      />
    );
  }

  if (screen === "confirmation") {
    return (
      <Step1ConfirmationScreen
        onBack={handleBack}
        onProceedToStep2={onProceedToStep2}
        screenIndex={screenIndex}
      />
    );
  }

  if (screen === "documents-review") {
    return (
      <Step1DocumentsReviewScreen
        allReviewed={allStep1DocumentsReviewed(state.reviewedDocuments)}
        onBack={handleBack}
        onNext={handleNext}
        onReview={handleDocumentReviewed}
        reviewedDocuments={state.reviewedDocuments}
        screenIndex={screenIndex}
      />
    );
  }

  return null;
}
