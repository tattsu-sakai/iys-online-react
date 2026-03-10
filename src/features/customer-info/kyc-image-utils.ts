export type CapturedKycImage = {
  blob: Blob;
  createdAt: number;
  objectUrl: string;
};

export function createCapturedKycImage(blob: Blob): CapturedKycImage {
  return {
    blob,
    createdAt: Date.now(),
    objectUrl: URL.createObjectURL(blob),
  };
}

export function revokeCapturedKycImage(image: CapturedKycImage | null) {
  if (!image) {
    return;
  }

  URL.revokeObjectURL(image.objectUrl);
}

