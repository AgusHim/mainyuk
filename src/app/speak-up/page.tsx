import { redirect } from 'next/navigation';

export default function PublicSpeakingPage() {
  redirect('/events/speak-up');
}