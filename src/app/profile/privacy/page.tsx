import ProfilePrivacyPage from "@/components/Pages/ProfilePrivacyPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan Profil",
  description: "Pengaturan alias, privasi, dan leaderboard",
};

export default function ProfilePrivacy() {
  return <ProfilePrivacyPage />;
}
