import { redirect } from 'next/navigation';
import { getCurrentLocale } from '@/i18n/server';

export default function RootPage() {
  const locale = getCurrentLocale();
  // In a real app, you might check if setup is complete before redirecting.
  // For now, we'll always start with the setup wizard.
  redirect(`/${locale}/setup`);
  return null;
}
