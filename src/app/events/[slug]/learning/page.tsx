import EventLearningPage from "@/components/Pages/EventLearningPage";
import { MainLayout } from "@/layout/MainLayout";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <MainLayout><EventLearningPage slug={slug} /></MainLayout>;
}
