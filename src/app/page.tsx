import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the dashboard, the middleware will handle the locale.
  redirect('/dashboard');
}
