import * as React from 'react';

import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden='true'
      className={cn('animate-pulse rounded-md bg-[rgba(5,32,49,0.08)]', className)}
      {...props}
    />
  );
}

export { Skeleton };
