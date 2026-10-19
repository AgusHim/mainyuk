import { EventLayout } from "@/layout/EventLayout";
import { MainLayout } from "@/layout/MainLayout";
import type { Metadata } from "next";

type EventSEO = {
  title?: string;
  desc?: string;
  image_url?: string;
  speaker?: string;
  start_at?: string;
  end_at?: string;
  location_types?: string[] | null;
  location_desc?: string[] | null;
};

type PageProps = { params: Promise<{ slug: string }> };

function descriptionFor(event?: EventSEO | null) {
  const description = event?.desc?.replace(/\s+/g, " ").trim();
  if (!description) return "Jadwal, detail, dan pendaftaran event YukNgaji Solo.";
  return `${description.slice(0, 155)}${description.length > 155 ? "…" : ""}`;
}

async function getEvent(slug: string): Promise<EventSEO | null> {
  const host = process.env.BASE_API;
  if (!host) return null;

  const origin = host.startsWith("http") ? host : `https://${host}`;
  try {
    const response = await fetch(`${origin}/api/events/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    return (await response.json()) as EventSEO;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  const title = event?.title ? `${event.title} | YukNgaji Solo` : "Event YukNgaji Solo";
  const description = descriptionFor(event);
  const canonical = `/events/${slug}`;

  return {
    metadataBase: new URL("https://ynsolo.id"),
    title,
    description,
    keywords: [event?.title, event?.speaker, "event islami Solo", "kajian Solo", "YukNgaji Solo"].filter((keyword): keyword is string => Boolean(keyword)),
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: canonical,
      siteName: "YukNgaji Solo",
      title,
      description,
      images: event?.image_url ? [{ url: event.image_url, alt: event.title ?? "Event YukNgaji Solo" }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: event?.image_url ? [event.image_url] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);
  const location = event?.location_desc?.filter(Boolean).join(", ") || event?.location_types?.filter(Boolean).join(", ");
  const structuredData = event?.title ? {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: descriptionFor(event),
    image: event.image_url ? [event.image_url] : undefined,
    startDate: event.start_at,
    endDate: event.end_at,
    url: `https://ynsolo.id/events/${slug}`,
    organizer: { "@type": "Organization", name: "YukNgaji Solo", url: "https://ynsolo.id" },
    performer: event.speaker ? { "@type": "Person", name: event.speaker } : undefined,
    location: location ? { "@type": "Place", name: location } : undefined,
  } : null;

  return (
    <MainLayout>
      {structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />}
      <EventLayout slug={slug} />
    </MainLayout>
  );
}
