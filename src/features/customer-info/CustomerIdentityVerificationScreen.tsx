import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Menu,
  Upload,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  BrandFooter,
  ContentCard,
  PrimaryButton,
  QuickAccessBar,
  SecondaryButton,
  ServiceScreenHeader,
  ServiceScreenHeroPanel,
} from '@/features/initial-setup/components';
import AppNavigationMenu from '@/features/navigation/AppNavigationMenu';
import { createQuickAccessItems } from '@/features/navigation/quick-access';
import type { AssetTabKey } from '@/features/portfolio-assets/model';
import { trackAuditEvent } from '@/features/security/audit';
import { apiClient } from '@/lib/api/mock-client';
import { cn } from '@/lib/utils';
import { createCapturedKycImage, revokeCapturedKycImage, type CapturedKycImage } from '@/features/customer-info/kyc-image-utils';

type CaptureSide = 'back' | 'front';

type CapturedImages = Record<CaptureSide, CapturedKycImage | null>;

type CustomerIdentityVerificationScreenProps = {
  onBackToNameChange: () => void;
  onBackToCustomerInfo: () => void;
  onBackToTop: () => void;
  onCompleteIdentityVerification: () => void;
  onLogout: () => void;
  onOpenApplications: () => void;
  onOpenPortfolioAssets: (tab?: AssetTabKey) => void;
  onOpenTradeHistory: () => void;
};

const documentTypeOptions = ['マイナンバーカード', '運転免許証', '在留カード', '運転経歴証明書'] as const;

const captureSideMeta: Record<CaptureSide, { helper: string; label: string }> = {
  back: {
    helper: '裏面の全体が収まるように撮影してください。',
    label: '裏面',
  },
  front: {
    helper: '氏名・生年月日が読めるように、明るい場所で撮影してください。',
    label: '表面',
  },
};

const initialCapturedImages: CapturedImages = {
  back: null,
  front: null,
};

const captureSides: CaptureSide[] = ['front', 'back'];

export default function CustomerIdentityVerificationScreen({
  onBackToNameChange,
  onBackToCustomerInfo,
  onBackToTop,
  onCompleteIdentityVerification,
  onLogout,
  onOpenApplications,
  onOpenPortfolioAssets,
  onOpenTradeHistory,
}: CustomerIdentityVerificationScreenProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<(typeof documentTypeOptions)[number]>(documentTypeOptions[0]);
  const [capturedImages, setCapturedImages] = useState<CapturedImages>(initialCapturedImages);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [activeCaptureSide, setActiveCaptureSide] = useState<CaptureSide>('front');
  const [cameraError, setCameraError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [previewSide, setPreviewSide] = useState<CaptureSide | null>(null);

  const frontFileInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const quickAccessItems = createQuickAccessItems({
    activeKey: 'customerInfo',
    handlers: {
      applications: onOpenApplications,
      portfolioAssets: () => onOpenPortfolioAssets(),
      tradeHistory: onOpenTradeHistory,
    },
  });

  const canSubmit = useMemo(() => captureSides.every((side) => !!capturedImages[side]), [capturedImages]);
  const clearCapturedImages = () => {
    setCapturedImages((current) => {
      captureSides.forEach((side) => revokeCapturedKycImage(current[side]));
      return initialCapturedImages;
    });
  };

  const setCapturedImage = (side: CaptureSide, image: CapturedKycImage | null) => {
    setCapturedImages((current) => {
      revokeCapturedKycImage(current[side]);
      return {
        ...current,
        [side]: image,
      };
    });
  };

  const stopCameraStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (!cameraOpen || !streamRef.current || !videoRef.current) {
      return;
    }

    const video = videoRef.current;
    video.srcObject = streamRef.current;
    video
      .play()
      .then(() => undefined)
      .catch(() => {
        setCameraError('カメラ映像を再生できませんでした。画像ファイルの選択をご利用ください。');
      });
  }, [cameraOpen]);

  useEffect(() => {
    return () => {
      stopCameraStream();
      setCapturedImages((current) => {
        captureSides.forEach((side) => revokeCapturedKycImage(current[side]));
        return initialCapturedImages;
      });
    };
  }, []);

  const handleStartCamera = async (side: CaptureSide) => {
    setSubmitted(false);
    setActiveCaptureSide(side);
    setCameraError('');

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('この端末ではカメラが利用できません。画像ファイルを選択してください。');
      setCameraOpen(false);
      return;
    }

    try {
      stopCameraStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: 'environment' },
          height: { ideal: 1080 },
          width: { ideal: 1920 },
        },
      });

      streamRef.current = stream;
      setCameraOpen(true);
    } catch {
      setCameraOpen(false);
      setCameraError('カメラを起動できませんでした。ブラウザのカメラ権限をご確認ください。');
    }

    void trackAuditEvent({
      actorType: 'authenticated_user',
      eventType: 'kyc_image_captured',
      maskedPayload: { side, source: 'camera-open' },
      screen: 'customerInfoIdentityVerification',
    });
  };

  const handleCloseCamera = () => {
    setCameraOpen(false);
    stopCameraStream();
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    if (!context) {
      setCameraError('画像の処理に失敗しました。もう一度お試しください。');
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError('画像の処理に失敗しました。もう一度お試しください。');
          return;
        }

        setCapturedImage(activeCaptureSide, createCapturedKycImage(blob));
        setSubmitted(false);
        handleCloseCamera();
        void trackAuditEvent({
          actorType: 'authenticated_user',
          eventType: 'kyc_image_captured',
          maskedPayload: { side: activeCaptureSide, source: 'camera-capture' },
          screen: 'customerInfoIdentityVerification',
        });
      },
      'image/jpeg',
      0.92,
    );
  };

  const handleOpenFilePicker = (side: CaptureSide) => {
    const targetInput = side === 'front' ? frontFileInputRef.current : backFileInputRef.current;
    targetInput?.click();
  };

  const handleFileSelected = (side: CaptureSide, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setCapturedImage(side, createCapturedKycImage(file));
    setSubmitted(false);
    setCameraError('');
    void trackAuditEvent({
      actorType: 'authenticated_user',
      eventType: 'kyc_image_captured',
      maskedPayload: { side, source: 'file' },
      screen: 'customerInfoIdentityVerification',
    });
  };

  const handleRemoveImage = (side: CaptureSide) => {
    setCapturedImage(side, null);
    if (previewSide === side) {
      setPreviewSide(null);
    }
    setSubmitted(false);
    void trackAuditEvent({
      actorType: 'authenticated_user',
      eventType: 'kyc_image_removed',
      maskedPayload: { side },
      screen: 'customerInfoIdentityVerification',
    });
  };

  const handleSubmit = async () => {
    await apiClient.kyc.submitDocuments({
      documentType: selectedDocumentType,
      sides: captureSides.filter((side) => !!capturedImages[side]),
    });
    await trackAuditEvent({
      actorType: 'authenticated_user',
      eventType: 'kyc_submit',
      maskedPayload: {
        documentType: selectedDocumentType,
        sides: captureSides.filter((side) => !!capturedImages[side]),
      },
      screen: 'customerInfoIdentityVerification',
    });
    onCompleteIdentityVerification();
    clearCapturedImages();
    setSubmitted(true);
    setPreviewSide(null);
  };

  return (
    <main className='min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(162,133,86,0.18),transparent_24%),radial-gradient(circle_at_90%_10%,rgba(5,32,49,0.16),transparent_20%),linear-gradient(180deg,#f7f3eb_0%,#eef2f4_34%,#e6ebee_100%)]'>
      <div className='mx-auto flex min-h-screen max-w-[1380px] flex-col'>
        <section className='relative flex flex-1 items-stretch justify-center px-0 py-0 sm:px-4 lg:px-6 xl:px-10'>
          <div className='relative w-full max-w-[1180px]'>
            <div className='pointer-events-none absolute inset-x-10 top-5 h-32 rounded-full bg-[rgba(162,133,86,0.18)] blur-3xl' />

            <div className='relative'>
              <ServiceScreenHeader
                actions={
                  <>
                    <button
                      type='button'
                      className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white backdrop-blur'
                      aria-label='メニュー'
                      aria-expanded={menuOpen}
                      aria-haspopup='dialog'
                      onClick={() => setMenuOpen(true)}
                    >
                      <Menu className='h-4 w-4' />
                    </button>
                    <Button
                      type='button'
                      onClick={onBackToTop}
                      className='h-11 rounded-full border border-white/12 bg-white/10 px-4 text-[13px] font-semibold tracking-[0.08em] text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur hover:bg-white/16'
                    >
                      TOPへ戻る
                    </Button>
                  </>
                }
              >
                <ServiceScreenHeroPanel
                  badge='お客様情報 / 本人確認'
                  description='端末カメラを使って、本人確認書類の表面・裏面を撮影してください。撮影後に画像内容を確認して次へ進めます。'
                  pretitle='TOP / お届出事項変更・追加申請 / 氏名変更'
                  title='本人確認書類の撮影'
                />
              </ServiceScreenHeader>

              <QuickAccessBar actions={quickAccessItems} containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <div className='px-4 pb-8 pt-6 sm:px-6 xl:px-8 xl:pb-10 xl:pt-8'>
                <div className='grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
                  <div className='space-y-4'>
                    <ContentCard className='space-y-6'>
                      <div className='space-y-2'>
                        <p className='text-[16px] leading-8 tracking-[0.02em] text-[var(--ichiyoshi-navy)]'>
                          ご利用いただいている端末のカメラで、本人確認書類を撮影してください。
                        </p>
                        <p className='text-[14px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
                          文字がぼける場合は、書類から少し距離を取って再撮影すると読み取りやすくなります。
                        </p>
                      </div>

                      <section className='space-y-3'>
                        <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2'>
                          <p className='text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>本人確認書類</p>
                        </div>
                        <div className='grid gap-2 sm:grid-cols-2'>
                          {documentTypeOptions.map((option) => (
                            <button
                              key={option}
                              type='button'
                              onClick={() => setSelectedDocumentType(option)}
                              className={cn(
                                'rounded-[10px] border px-4 py-3 text-left text-[14px] font-semibold tracking-[0.03em] transition-colors',
                                option === selectedDocumentType
                                  ? 'border-[rgba(111,91,59,0.24)] bg-[rgba(162,133,86,0.12)] text-[var(--ichiyoshi-navy)]'
                                  : 'border-[rgba(5,32,49,0.08)] bg-white text-[var(--ichiyoshi-ink-soft)] hover:bg-[rgba(5,32,49,0.03)]',
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </section>

                      {cameraError ? (
                        <div className='rounded-[10px] border border-[rgba(194,59,42,0.3)] bg-[rgba(194,59,42,0.08)] px-4 py-3 text-[13px] leading-6 text-[var(--ichiyoshi-error)]'>
                          {cameraError}
                        </div>
                      ) : null}

                      <section className='space-y-4'>
                        <div className='rounded-[10px] bg-[var(--ichiyoshi-section)] px-4 py-2'>
                          <p className='text-[14px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>撮影画像</p>
                        </div>

                        <div className='grid gap-4 lg:grid-cols-2'>
                          {captureSides.map((side) => {
                            const capturedImage = capturedImages[side];

                            return (
                              <article
                                key={side}
                                className='space-y-3 rounded-[12px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] p-4'
                              >
                                <div className='flex items-start justify-between gap-3'>
                                  <div>
                                    <p className='text-[15px] font-bold tracking-[0.03em] text-[var(--ichiyoshi-navy)]'>{captureSideMeta[side].label}</p>
                                    <p className='mt-1 text-[12px] leading-6 text-[var(--ichiyoshi-ink-soft)]'>{captureSideMeta[side].helper}</p>
                                  </div>
                                  {capturedImage ? (
                                    <span className='inline-flex items-center gap-1 rounded-full bg-[rgba(80,122,231,0.12)] px-2.5 py-1 text-[11px] font-semibold text-[#507ae7]'>
                                      <CheckCircle2 className='h-3.5 w-3.5' />
                                      撮影済み
                                    </span>
                                  ) : null}
                                </div>

                                <div className='overflow-hidden rounded-[10px] border border-[rgba(5,32,49,0.08)] bg-white'>
                                  {capturedImage ? (
                                    <button
                                      type='button'
                                      onClick={() => setPreviewSide(side)}
                                      className='block w-full'
                                    >
                                      <img
                                        src={capturedImage.objectUrl}
                                        alt={`${captureSideMeta[side].label}画像プレビュー`}
                                        className='h-[220px] w-full object-cover'
                                      />
                                    </button>
                                  ) : (
                                    <div className='flex h-[220px] flex-col items-center justify-center gap-2 bg-[linear-gradient(180deg,rgba(247,249,250,0.9),rgba(255,255,255,0.95))]'>
                                      <Camera className='h-8 w-8 text-[var(--ichiyoshi-gold-soft)]' />
                                      <p className='text-[13px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-ink-soft)]'>まだ撮影されていません</p>
                                    </div>
                                  )}
                                </div>

                                <div className='grid gap-2 sm:grid-cols-2'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => handleStartCamera(side)}
                                    className='h-10 rounded-[10px] border-[rgba(5,32,49,0.08)] bg-white text-[13px] font-semibold text-[var(--ichiyoshi-navy)]'
                                  >
                                    <Camera className='h-4 w-4' />
                                    {capturedImage ? '撮り直す' : 'カメラで撮影'}
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => handleOpenFilePicker(side)}
                                    className='h-10 rounded-[10px] border-[rgba(5,32,49,0.08)] bg-white text-[13px] font-semibold text-[var(--ichiyoshi-navy)]'
                                  >
                                    <Upload className='h-4 w-4' />
                                    画像を選択
                                  </Button>
                                </div>

                                {capturedImage ? (
                                  <button
                                    type='button'
                                    onClick={() => handleRemoveImage(side)}
                                    className='text-[12px] font-semibold tracking-[0.04em] text-[var(--ichiyoshi-error)]'
                                  >
                                    画像を削除する
                                  </button>
                                ) : null}

                                <input
                                  ref={side === 'front' ? frontFileInputRef : backFileInputRef}
                                  type='file'
                                  accept='image/*'
                                  capture='environment'
                                  className='hidden'
                                  onChange={(event) => {
                                    void handleFileSelected(side, event);
                                  }}
                                />
                              </article>
                            );
                          })}
                        </div>
                      </section>

                      {submitted ? (
                        <div className='rounded-[10px] border border-[rgba(80,122,231,0.22)] bg-[rgba(80,122,231,0.08)] px-4 py-3 text-[14px] leading-7 text-[var(--ichiyoshi-navy)]'>
                          撮影画像を受け付けました。内容確認後、手続き結果をお知らせします。
                        </div>
                      ) : null}

                      <div className='grid gap-3 sm:grid-cols-2'>
                        <SecondaryButton
                          type='button'
                          onClick={onBackToNameChange}
                          className='h-12 rounded-[10px] text-[16px] tracking-[0.04em]'
                        >
                          1つ前へ戻る
                        </SecondaryButton>
                        <PrimaryButton
                          type='button'
                          onClick={handleSubmit}
                          disabled={!canSubmit}
                          className='h-12 rounded-[10px] text-[16px] tracking-[0.04em]'
                        >
                          本人確認を完了する
                        </PrimaryButton>
                      </div>
                    </ContentCard>
                  </div>

                  <div className='space-y-4 xl:sticky xl:top-6'>
                    <ContentCard className='space-y-4'>
                      <div>
                        <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>Status</p>
                        <h2 className='mt-2 text-[18px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>撮影チェック</h2>
                      </div>
                      <div className='space-y-2'>
                        <div className='rounded-[10px] border border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)] px-4 py-3'>
                          <p className='text-[12px] text-[var(--ichiyoshi-ink-soft)]'>書類種別</p>
                          <p className='mt-1 text-[14px] font-semibold text-[var(--ichiyoshi-navy)]'>{selectedDocumentType}</p>
                        </div>
                        {captureSides.map((side) => (
                          <div
                            key={`status-${side}`}
                            className={cn(
                              'rounded-[10px] border px-4 py-3',
                              capturedImages[side]
                                ? 'border-[rgba(80,122,231,0.25)] bg-[rgba(80,122,231,0.08)]'
                                : 'border-[rgba(5,32,49,0.08)] bg-[rgba(5,32,49,0.03)]',
                            )}
                          >
                            <p className='text-[12px] text-[var(--ichiyoshi-ink-soft)]'>{captureSideMeta[side].label}</p>
                            <p className='mt-1 text-[14px] font-semibold text-[var(--ichiyoshi-navy)]'>
                              {capturedImages[side] ? '撮影済み' : '未撮影'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ContentCard>

                    <ContentCard className='space-y-4'>
                      <div>
                        <p className='text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]'>Guide</p>
                        <h2 className='mt-2 text-[18px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]'>撮影時のポイント</h2>
                      </div>
                      <div className='space-y-2 text-[13px] leading-7 text-[var(--ichiyoshi-ink-soft)]'>
                        <p>・書類全体がフレーム内に入るように撮影してください。</p>
                        <p>・暗い場所や逆光を避けると、文字が読み取りやすくなります。</p>
                        <p>・ぼやけた場合は「撮り直す」で再撮影できます。</p>
                      </div>
                    </ContentCard>
                  </div>
                </div>
              </div>

              <BrandFooter containerClassName='max-w-[1180px] xl:max-w-[1180px]' />

              <AppNavigationMenu
                activeScreen='customerInfo'
                onClose={() => setMenuOpen(false)}
                onLogout={onLogout}
                onOpenApplications={onOpenApplications}
                onOpenCustomerInfo={onBackToCustomerInfo}
                onOpenPortfolioAssets={() => onOpenPortfolioAssets()}
                onOpenTradeHistory={onOpenTradeHistory}
                onOpenTop={onBackToTop}
                open={menuOpen}
              />
            </div>
          </div>
        </section>
      </div>

      {cameraOpen ? (
        <div className='fixed inset-0 z-[140] bg-[rgba(10,16,22,0.72)] px-4 py-6 backdrop-blur-[2px] sm:px-6'>
          <div className='mx-auto flex h-full w-full max-w-[960px] flex-col overflow-hidden rounded-[16px] border border-white/12 bg-[rgba(17,25,33,0.94)] shadow-[0_26px_60px_rgba(0,0,0,0.34)]'>
            <div className='flex items-center justify-between border-b border-white/10 px-4 py-3 text-white sm:px-5'>
              <div>
                <p className='text-[11px] uppercase tracking-[0.2em] text-white/70'>Camera</p>
                <p className='mt-1 text-[16px] font-semibold tracking-[0.04em]'>
                  {selectedDocumentType}（{captureSideMeta[activeCaptureSide].label}）
                </p>
              </div>
              <button
                type='button'
                onClick={handleCloseCamera}
                className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/16 bg-white/10 text-white'
              >
                <X className='h-4 w-4' />
              </button>
            </div>

            <div className='relative flex-1 bg-black'>
              <video ref={videoRef} className='h-full w-full object-contain' autoPlay playsInline muted />
              <div className='pointer-events-none absolute inset-x-4 top-4 rounded-[10px] border border-white/30 bg-black/25 px-3 py-2 text-[12px] text-white/90 sm:inset-x-6'>
                枠内に書類全体が収まるようにしてください。
              </div>
            </div>

            <div className='grid gap-2 border-t border-white/10 p-3 sm:grid-cols-2 sm:p-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCloseCamera}
                className='h-11 rounded-[10px] border-white/20 bg-white/6 text-[14px] font-semibold text-white hover:bg-white/12'
              >
                閉じる
              </Button>
              <PrimaryButton type='button' onClick={handleCapture} className='h-11 rounded-[10px] text-[14px] tracking-[0.04em]'>
                この画像を保存
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}

      {previewSide ? (
        <div className='fixed inset-0 z-[130] bg-[rgba(10,16,22,0.75)] px-4 py-6 backdrop-blur-[2px] sm:px-6'>
          <div className='mx-auto flex h-full w-full max-w-[980px] flex-col overflow-hidden rounded-[16px] border border-white/12 bg-[rgba(17,25,33,0.94)] shadow-[0_26px_60px_rgba(0,0,0,0.34)]'>
            <div className='flex items-center justify-between border-b border-white/10 px-4 py-3 text-white sm:px-5'>
              <p className='text-[16px] font-semibold tracking-[0.04em]'>
                {selectedDocumentType}（{captureSideMeta[previewSide].label}）プレビュー
              </p>
              <button
                type='button'
                onClick={() => setPreviewSide(null)}
                className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/16 bg-white/10 text-white'
              >
                <X className='h-4 w-4' />
              </button>
            </div>

            <div className='flex-1 overflow-auto bg-black p-4'>
              <img
                src={capturedImages[previewSide]?.objectUrl ?? ''}
                alt={`${captureSideMeta[previewSide].label}画像の拡大プレビュー`}
                className='mx-auto max-h-full w-auto max-w-full object-contain'
              />
            </div>

            <div className='grid gap-2 border-t border-white/10 p-3 sm:grid-cols-2 sm:p-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setPreviewSide(null)}
                className='h-11 rounded-[10px] border-white/20 bg-white/6 text-[14px] font-semibold text-white hover:bg-white/12'
              >
                閉じる
              </Button>
              <PrimaryButton
                type='button'
                onClick={() => {
                  setPreviewSide(null);
                  void handleStartCamera(previewSide);
                }}
                className='h-11 rounded-[10px] text-[14px] tracking-[0.04em]'
              >
                この面を撮り直す
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}

      <canvas ref={canvasRef} className='hidden' />
    </main>
  );
}
