
import type { ReactNode } from 'react';
import AppLayout from '../app-layout';

export default function IncomeTaxEstimatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
