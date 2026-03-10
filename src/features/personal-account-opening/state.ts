import { atom } from 'jotai';

import {
  defaultPersonalAccountOpeningFormState,
  type PersonalAccountOpeningErrors,
  type PersonalAccountOpeningStep,
} from '@/features/personal-account-opening/model';

export const personalAccountOpeningStepAtom = atom<PersonalAccountOpeningStep>('welcome');
export const personalAccountOpeningFormStateAtom = atom(defaultPersonalAccountOpeningFormState);
export const personalAccountOpeningErrorsAtom = atom<PersonalAccountOpeningErrors>({});
export const personalAccountOpeningResendMessageAtom = atom('');

export const resetPersonalAccountOpeningStateAtom = atom(null, (_get, set) => {
  set(personalAccountOpeningStepAtom, 'welcome');
  set(personalAccountOpeningFormStateAtom, defaultPersonalAccountOpeningFormState);
  set(personalAccountOpeningErrorsAtom, {});
  set(personalAccountOpeningResendMessageAtom, '');
});
