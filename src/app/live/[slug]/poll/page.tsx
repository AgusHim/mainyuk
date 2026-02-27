import LivePollDisplay from "@/components/Pages/LivePollDisplay";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Live Poll",
    description: "Live poll display",
};

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = await params;
    return <LivePollDisplay params={resolvedParams} />;
}
