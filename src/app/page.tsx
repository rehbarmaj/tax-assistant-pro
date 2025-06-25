import { redirect } from 'next/navigation';

export default function RootPage() {
  // In a real app, you might check if setup is complete before redirecting.
  // For now, we'll always start with the setup wizard.
  redirect('/setup');
  return null;
}
