
import { redirect } from 'next/navigation';

export default function RootLocalePage({ params: { locale }}: { params: { locale: string }}) {
  // Redirect to the dashboard of the current locale.
  redirect(`/${locale}/dashboard`);
}
