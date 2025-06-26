import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the default locale's setup page.
  // The middleware will handle subsequent language detection.
  redirect('/en/setup');
}
