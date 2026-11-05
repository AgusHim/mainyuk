import { redirect } from 'next/navigation';

export default function NazaPage() {
  redirect('/events/nobar-naza');  // Or an absolute URL: 'http://example.com/url2'
}