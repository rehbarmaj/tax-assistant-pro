
// This file is no longer needed and is intentionally left blank.
// The root redirect is handled by /app/page.tsx.
import { redirect } from 'next/navigation';
import { getCurrentLocale } from '@/i18n/server';

export default function RootPage() {
  const locale = getCurrentLocale();
  // In a real app, you might check if setup is complete before redirecting.
  redirect(`/${locale}/dashboard`);
  return null;
}
