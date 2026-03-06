import {
  BodyText,
  ContentCard,
  DocumentPreview,
  ReviewActionCard,
  StatusPill,
  Step1Shell,
  StepActionRow,
} from "@/features/account-opening-step1/components";
import {
  step1Documents,
  type Step1DocumentKey,
} from "@/features/account-opening-step1/model";

type Step1DocumentsReviewScreenProps = {
  allReviewed: boolean;
  onBack: () => void;
  onNext: () => void;
  onReview: (documentKey: Step1DocumentKey) => void;
  reviewedDocuments: Record<Step1DocumentKey, boolean>;
  screenIndex: number;
};

export default function Step1DocumentsReviewScreen({
  allReviewed,
  onBack,
  onNext,
  onReview,
  reviewedDocuments,
  screenIndex,
}: Step1DocumentsReviewScreenProps) {
  const reviewedCount = step1Documents.filter(
    (document) => reviewedDocuments[document.key]
  ).length;

  return (
    <Step1Shell
      description="Figma 上では分かれていた 5 つの書面確認画面を、ここでは 1 画面に集約しています。各書面を確認すると確認画面へ進めます。"
      eyebrow="Personal Account Opening"
      nodeId="32374:77307"
      screenIndex={screenIndex}
      showOverallProgress
      title="書面確認"
    >
      <div className="space-y-5">
        <ContentCard className="sticky top-3 z-20 space-y-4 sm:top-4 xl:top-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--ichiyoshi-gold-soft)]">
                Review Status
              </p>
              <p className="mt-2 text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
                {reviewedCount} / {step1Documents.length} 書面を確認済み
              </p>
            </div>
            <StatusPill
              active={allReviewed}
              label={allReviewed ? "確認完了" : "確認中"}
            />
          </div>
          <BodyText>
            各カードの「書面を確認する」から別タブでプレビューを開けます。5 件すべて確認すると確認画面へ進めます。
          </BodyText>
        </ContentCard>

        <div className="grid gap-5">
          {step1Documents.map((document) => {
            const isReviewed = reviewedDocuments[document.key];

            const handleReview = () => {
              window.open(document.previewSrc, "_blank", "noopener,noreferrer");
              onReview(document.key);
            };

            return (
              <div
                key={document.key}
                className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"
              >
                <ContentCard
                  className="space-y-5"
                  data-node-id={document.nodeId}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--ichiyoshi-gold-soft)]">
                        Document
                      </p>
                      <h2 className="mt-2 text-[22px] font-bold tracking-[0.04em] text-[var(--ichiyoshi-navy)]">
                        {document.title}
                      </h2>
                    </div>
                    <StatusPill
                      active={isReviewed}
                      label={isReviewed ? "確認済み" : "未確認"}
                    />
                  </div>

                  <BodyText>{document.description}</BodyText>

                  <DocumentPreview
                    alt={document.previewAlt}
                    imageSrc={document.previewSrc}
                    linkLabel={document.helperLinkLabel}
                    onOpen={handleReview}
                  />
                </ContentCard>

                <ReviewActionCard
                  description="プレビュー確認後に状態が更新されます。確認済みになった書面はそのまま一覧で保持されます。"
                  isReviewed={isReviewed}
                  onReview={handleReview}
                />
              </div>
            );
          })}
        </div>

        <StepActionRow
          onPrimary={onNext}
          onSecondary={onBack}
          primaryDisabled={!allReviewed}
          primaryLabel="確認画面へ進む"
          secondaryLabel="1つ前へ戻る"
        />
      </div>
    </Step1Shell>
  );
}
