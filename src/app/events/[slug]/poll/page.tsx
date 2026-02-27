import PollParticipantView from "@/components/Pages/PollParticipantView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Poll",
    description: "Berpartisipasi dalam poll",
};

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = await params;
    return <PollParticipantView params={resolvedParams} />;
}
