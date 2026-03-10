import { useEffect, useMemo } from "react";
import { useAtom } from 'jotai';

import {
  allStep1DocumentsReviewed,
  type Step1State,
  step1ScreenOrder,
  type Step1DocumentKey,
  type Step1Screen,
} from "@/features/account-opening-step1/model";
import { step1ScreenAtom, step1StateAtom } from '@/features/account-opening-step1/state';
import Step1ConfirmationScreen from "@/features/account-opening-step1/screens/Step1ConfirmationScreen";
import Step1DocumentsReviewScreen from "@/features/account-opening-step1/screens/Step1DocumentsReviewScreen";
import Step1ElectronicDeliveryScreen from "@/features/account-opening-step1/screens/Step1ElectronicDeliveryScreen";
import Step1IntroScreen from "@/features/account-opening-step1/screens/Step1IntroScreen";

type AccountOpeningStep1FlowProps = {
  onBackToTop: () => void;
  onProceedToStep2: () => void;
  initialScreen?: Step1Screen;
  initialState?: Step1State;
  onScreenChange?: (screen: Step1Screen) => void;
  screen?: Step1Screen;
};

export default function AccountOpeningStep1Flow({
  onBackToTop,
  onProceedToStep2,
  initialScreen = "intro",
  initialState,
  onScreenChange,
  screen: controlledScreen,
}: AccountOpeningStep1FlowProps) {
  const [internalScreen, setInternalScreen] = useAtom(step1ScreenAtom);
  const [state, setState] = useAtom(step1StateAtom);
  const screen = controlledScreen ?? internalScreen;
  const setScreen = (nextScreen: Step1Screen) => {
    if (controlledScreen !== undefined) {
      onScreenChange?.(nextScreen);
      return;
    }

    setInternalScreen(nextScreen);
  };

  useEffect(() => {
    if (controlledScreen === undefined) {
      setInternalScreen(initialScreen);
    }
  }, [controlledScreen, initialScreen, setInternalScreen]);

  useEffect(() => {
    if (initialState !== undefined) {
      setState(initialState);
    }
  }, [initialState, setState]);

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
