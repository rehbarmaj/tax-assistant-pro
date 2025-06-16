import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/dashboard');
  // Next.js redirect is a server-side operation, so rendering null or an empty fragment is fine.
  return null;
}
