type FormErrorSummaryProps = {
  errors: string[];
  id?: string;
};

export default function FormErrorSummary({ errors, id = 'form-error-summary' }: FormErrorSummaryProps) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      role='alert'
      aria-live='assertive'
      className='rounded-[12px] border border-[rgba(194,59,42,0.3)] bg-[rgba(194,59,42,0.08)] px-4 py-3'
    >
      <p className='text-[14px] font-bold tracking-[0.03em] text-[var(--ichiyoshi-error)]'>
        入力内容をご確認ください
      </p>
      <ul className='mt-2 space-y-1 text-[13px] leading-6 text-[var(--ichiyoshi-error)]'>
        {errors.map((errorText) => (
          <li key={errorText}>・{errorText}</li>
        ))}
      </ul>
    </section>
  );
}

