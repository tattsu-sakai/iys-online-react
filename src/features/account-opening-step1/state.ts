import { atom } from 'jotai';

import { defaultStep1State, type Step1Screen, type Step1State } from '@/features/account-opening-step1/model';

export const step1ScreenAtom = atom<Step1Screen>('intro');
export const step1StateAtom = atom<Step1State>(defaultStep1State);

export const resetStep1StateAtom = atom(null, (_get, set) => {
  set(step1ScreenAtom, 'intro');
  set(step1StateAtom, defaultStep1State);
});
