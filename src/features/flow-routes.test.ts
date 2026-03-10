import { describe, expect, it } from 'vitest';

import { flowPaths, getFlowAccess, getFlowScreenFromPathname } from '@/features/flow-routes';

describe('flow-routes', () => {
  it('resolves screen by pathname', () => {
    expect(getFlowScreenFromPathname(flowPaths.top)).toBe('top');
    expect(getFlowScreenFromPathname('/not-found')).toBeNull();
  });

  it('keeps authentication requirements for protected pages', () => {
    expect(getFlowAccess('top')).toBe('authenticated');
    expect(getFlowAccess('login')).toBe('public');
  });
});

