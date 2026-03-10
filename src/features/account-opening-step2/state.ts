import { atom } from 'jotai';

import { defaultStep2AddressState } from '@/features/account-opening-step2/model';

export const step2AddressStateAtom = atom(defaultStep2AddressState);
export const step2TownDialogOpenAtom = atom(false);

export const resetStep2StateAtom = atom(null, (_get, set) => {
  set(step2AddressStateAtom, defaultStep2AddressState);
  set(step2TownDialogOpenAtom, false);
});
