import { redirect } from 'next/navigation';

// This page is obsolete and has been replaced by the root page /
export default function ObsoletePage() {
  redirect('/');
}
