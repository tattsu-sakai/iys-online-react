import { describe, expect, it, vi } from 'vitest';

import { createCapturedKycImage, revokeCapturedKycImage } from '@/features/customer-info/kyc-image-utils';

describe('kyc image utils', () => {
  it('creates and revokes object URLs', () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const blob = new Blob(['mock'], { type: 'image/jpeg' });

    const image = createCapturedKycImage(blob);

    expect(image.objectUrl).toBe('blob:mock');
    expect(image.blob.type).toBe('image/jpeg');

    revokeCapturedKycImage(image);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock');

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });
});

