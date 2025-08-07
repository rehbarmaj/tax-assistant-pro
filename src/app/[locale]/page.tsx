
import { redirect } from 'next/navigation';
import { getLocale } from 'next-international/server';

export default async function RootLocalePage() {
  const locale = await getLocale();
  // Redirect to the dashboard of the current locale.
  redirect(`/${locale}/dashboard`);
}
