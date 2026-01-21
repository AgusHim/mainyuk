import { Metadata } from "next";
import VoiceCallPage from "@/components/Pages/VoiceCallPage";

export const metadata: Metadata = {
    title: "Voice Call City Tour",
    description: "Live voice call for City Tour",
};

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = await params;
    return <VoiceCallPage params={resolvedParams} />;
}
