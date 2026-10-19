import { redirect } from 'next/navigation';

export default function PublicSpeakingPage() {
  redirect('/events/speaking-for-life');
}