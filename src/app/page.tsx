import { redirect } from 'next/navigation';
import { getLocale } from 'next-international/server';

export default async function RootPage() {
  const locale = await getLocale();
  // Redirect to the dashboard of the default locale.
  // The middleware will handle redirects for users with different language preferences.
  redirect(`/${locale}/dashboard`);
}
