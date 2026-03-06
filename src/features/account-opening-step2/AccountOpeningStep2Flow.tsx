import { useEffect, useState } from "react";

import {
  canSearchTown,
  defaultStep2AddressState,
  formatPostalCodeInput,
  type ResidencyCountry,
} from "@/features/account-opening-step2/model";
import Step2AddressScreen from "@/features/account-opening-step2/screens/Step2AddressScreen";

type AccountOpeningStep2FlowProps = {
  onBackToStep1: () => void;
};

export default function AccountOpeningStep2Flow({
  onBackToStep1,
}: AccountOpeningStep2FlowProps) {
  const [state, setState] = useState(defaultStep2AddressState);
  const [isTownDialogOpen, setIsTownDialogOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isTownDialogOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isTownDialogOpen]);

  const updateField = <Key extends keyof typeof state>(
    key: Key,
    value: (typeof state)[Key]
  ) => {
    setState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handlePostalCodeChange = (value: string) => {
    const postalCode = formatPostalCodeInput(value);

    setState((current) => ({
      ...current,
      postalCode,
      selectedTown: postalCode.length === 7 ? current.selectedTown : "",
    }));

    if (postalCode.length !== 7) {
      setIsTownDialogOpen(false);
    }
  };

  const handlePrefectureToggle = () => {
    setState((current) => ({
      ...current,
      hasDifferentResidentPrefecture: !current.hasDifferentResidentPrefecture,
      residentPrefecture: current.hasDifferentResidentPrefecture
        ? ""
        : current.residentPrefecture,
    }));
  };

  return (
    <Step2AddressScreen
      canSearchTown={canSearchTown(state.postalCode)}
      isTownDialogOpen={isTownDialogOpen}
      onBack={onBackToStep1}
      onCloseTownDialog={() => setIsTownDialogOpen(false)}
      onOpenTownDialog={() => {
        if (canSearchTown(state.postalCode)) {
          setIsTownDialogOpen(true);
        }
      }}
      onPostalCodeChange={handlePostalCodeChange}
      onPrefectureToggle={handlePrefectureToggle}
      onResidentPrefectureChange={(value) =>
        updateField("residentPrefecture", value)
      }
      onResidencyCountryChange={(value: ResidencyCountry) =>
        updateField("residencyCountry", value)
      }
      onSelectTown={(value) => {
        updateField("selectedTown", value);
        setIsTownDialogOpen(false);
      }}
      onUpdateField={updateField}
      screenIndex={1}
      state={state}
    />
  );
}
