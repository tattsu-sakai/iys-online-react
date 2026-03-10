import { atom } from 'jotai';

import { defaultFormState, type FormErrors } from '@/features/initial-setup/model';

export const initialSetupFormStateAtom = atom(defaultFormState);
export const initialSetupErrorsAtom = atom<FormErrors>({});
export const initialSetupVerifyMessageAtom = atom('');

export const resetInitialSetupStateAtom = atom(null, (_get, set) => {
  set(initialSetupFormStateAtom, defaultFormState);
  set(initialSetupErrorsAtom, {});
  set(initialSetupVerifyMessageAtom, '');
});
