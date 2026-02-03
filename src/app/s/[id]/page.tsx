import { Metadata } from "next";
import VoiceCallPage from "@/components/Pages/VoiceCallPage";

export const metadata: Metadata = {
    title: "Stream - YukNgaji Solo",
    description: "Live voice call YukNgaji Solo",
};

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = await params;
    return <VoiceCallPage params={resolvedParams} />;
}
