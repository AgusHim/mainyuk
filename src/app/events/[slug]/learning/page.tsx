import EventLearningPage from "@/components/Pages/EventLearningPage";
import { MainLayout } from "@/layout/MainLayout";
import type { Metadata } from "next";

type EventMetadata = {
  title?: string;
  desc?: string;
  image_url?: string;
};

async function getEvent(slug: string): Promise<EventMetadata | null> {
  const host = process.env.BASE_API;
  if (!host) return null;

  const origin = host.startsWith("http") ? host : `https://${host}`;
  try {
    const response = await fetch(`${origin}/api/events/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    return (await response.json()) as EventMetadata;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  const title = event?.title ? `Materi & Rekaman ${event.title} | YukNgaji Solo` : "Materi & Rekaman Event | YukNgaji Solo";
  const eventDescription = event?.desc?.replace(/\s+/g, " ").trim();
  const description = eventDescription
    ? `${eventDescription.slice(0, 150)}${eventDescription.length > 150 ? "…" : ""}`
    : "Akses materi dan rekaman event YukNgaji Solo sesuai tiket yang dimiliki.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: event?.image_url ? [{ url: event.image_url }] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <MainLayout><EventLearningPage slug={slug} assignmentDriveFolderURL={process.env.ASSIGNMENT_DRIVE_FOLDER_URL} /></MainLayout>;
}
