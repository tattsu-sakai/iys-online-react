import { Fragment, isValidElement } from 'react';

export const isFragment = (value: unknown): boolean => {
  return isValidElement(value) && value.type === Fragment;
};
