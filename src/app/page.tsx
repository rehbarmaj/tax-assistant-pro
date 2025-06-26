
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the setup page. The middleware will handle the locale.
  redirect('/setup');
}
