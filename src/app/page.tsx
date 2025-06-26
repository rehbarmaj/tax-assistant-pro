
import { redirect } from 'next/navigation';

export default function RootPage() {
  // The middleware will intercept this and redirect to the default locale, e.g., /en/dashboard
  redirect('/dashboard');
}
