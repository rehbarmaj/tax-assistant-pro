import { redirect } from 'next/navigation';

// The root page now automatically redirects to the setup wizard.
// This ensures a clean entry point for new users.
export default function RootPage() {
  redirect('/setup');
}
