"use client";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { MainLayout } from "@/layout/MainLayout";
import {
  getMyProfile,
  updateMyProfile,
} from "@/redux/slices/communitySlice";
import {
  getMySharePrefs,
  updateMySharePrefs,
} from "@/redux/slices/threadSlice";
import { ProfileVisibility } from "@/types/community";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const RequiredAuthLayout = dynamic(() => import("@/layout/AuthLayout"), {
  ssr: false,
});

export default function ProfilePrivacyPage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.community.profile);
  const isLoading = useAppSelector((state) => state.community.loading);
  const error = useAppSelector((state) => state.community.error);

  const [alias, setAlias] = useState("");
  const [bio, setBio] = useState("");
  const [visibility, setVisibility] = useState<ProfileVisibility>("public");
  const [leaderboardOptOut, setLeaderboardOptOut] = useState(false);
  const [showBadges, setShowBadges] = useState(true);

  const sharePrefs = useAppSelector((state) => state.thread.sharePrefs);
  const isShareLoading = useAppSelector((state) => state.thread.loading);
  // Default tercentang, mengikuti kebijakan opt-out: aktivitas dibagikan
  // kecuali anggotanya mematikannya sendiri.
  const [shareEventRegistration, setShareEventRegistration] = useState(true);
  const [shareDonation, setShareDonation] = useState(true);
  const [shareMission, setShareMission] = useState(true);

  useEffect(() => {
    if (profile == null) {
      dispatch(getMyProfile());
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (sharePrefs == null) {
      dispatch(getMySharePrefs());
    }
  }, [dispatch, sharePrefs]);

  // Nilai checkbox baru diisi setelah preferensi datang, supaya ketikan
  // pengguna tidak tertimpa respons yang datang terlambat.
  useEffect(() => {
    if (sharePrefs != null) {
      setShareEventRegistration(sharePrefs.share_event_registration);
      setShareDonation(sharePrefs.share_donation);
      setShareMission(sharePrefs.share_mission);
    }
  }, [sharePrefs]);

  // Nilai form baru diisi setelah profil datang, supaya ketikan pengguna tidak
  // tertimpa respons yang datang terlambat.
  useEffect(() => {
    if (profile != null) {
      setAlias(profile.alias ?? "");
      setBio(profile.bio ?? "");
      setVisibility(profile.profile_visibility);
      setLeaderboardOptOut(profile.leaderboard_opt_out);
      setShowBadges(profile.show_badges);
    }
  }, [profile?.public_id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(
      updateMyProfile({
        alias,
        bio,
        profile_visibility: visibility,
        leaderboard_opt_out: leaderboardOptOut,
        show_badges: showBadges,
      })
    )
      .unwrap()
      .then(() => toast.success("Pengaturan profil disimpan"))
      .catch(() => {
        // Pesan kesalahan sudah ditampilkan interceptor API.
      });
  };

  const handleShareSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(
      updateMySharePrefs({
        share_event_registration: shareEventRegistration,
        share_donation: shareDonation,
        share_mission: shareMission,
      })
    )
      .unwrap()
      .then(() => toast.success("Pengaturan berbagi disimpan"))
      .catch(() => {
        // Pesan kesalahan sudah ditampilkan interceptor API.
      });
  };

  return (
    <RequiredAuthLayout redirectTo={"/profile/privacy"}>
      <MainLayout>
        <CommonHeader
          title="Pengaturan Profil"
          isShowBack={true}
          isShowTrailing={false}
        />
        <div className="yn-container bg-yellow-400 p-4">
          {error != null ? (
            <div
              role="alert"
              className="mb-4 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger"
            >
              <span>{error}</span>
            </div>
          ) : null}
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom"
          >
            <div className="space-y-1.5">
              <Label htmlFor="alias" className="font-bold text-black">
                Alias komunitas
              </Label>
              <Input
                id="alias"
                name="alias"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Nama yang tampil di leaderboard"
                maxLength={40}
                className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium"
              />
              <p className="text-xs text-black">
                3–40 karakter. Kosongkan untuk memakai nama akun.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="font-bold text-black">
                Bio
              </Label>
              <Input
                id="bio"
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ceritakan singkat tentangmu"
                className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="visibility" className="font-bold text-black">
                Visibilitas profil
              </Label>
              <Select
                value={visibility}
                onValueChange={(value) =>
                  setVisibility(value as ProfileVisibility)
                }
              >
                <SelectTrigger
                  id="visibility"
                  className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium"
                >
                  <SelectValue placeholder="Pilih visibilitas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Publik</SelectItem>
                  <SelectItem value="members">Hanya anggota</SelectItem>
                  <SelectItem value="private">Privat</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-black">
                Profil privat tidak dapat dibuka orang lain.
              </p>
            </div>

            <label className="flex items-center gap-3 text-black">
              <input
                type="checkbox"
                checked={leaderboardOptOut}
                onChange={(e) => setLeaderboardOptOut(e.target.checked)}
                className="h-5 w-5 accent-black"
              />
              Sembunyikan saya dari leaderboard
            </label>

            <label className="flex items-center gap-3 text-black">
              <input
                type="checkbox"
                checked={showBadges}
                onChange={(e) => setShowBadges(e.target.checked)}
                className="h-5 w-5 accent-black"
              />
              Tampilkan badge level saya
            </label>

            <div className="mt-2">
              {isLoading ? (
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
              ) : (
                <Button
                  type="submit"
                  className="h-11 w-full border-2 border-black sm:w-auto sm:px-10"
                  style={{ boxShadow: "0px 5px 0px 0px #000000" }}
                >
                  Simpan Pengaturan
                </Button>
              )}
            </div>
          </form>

          <form
            onSubmit={handleShareSubmit}
            className="mt-4 grid gap-4 rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom"
          >
            <div>
              <h2 className="text-lg font-semibold text-black">
                Berbagi aktivitas ke komunitas
              </h2>
              <p className="mt-1 text-xs text-black">
                Aktivitas berikut dibagikan otomatis ke feed komunitas dengan
                aliasmu. Matikan yang tidak ingin kamu bagikan.
              </p>
            </div>

            <label className="flex items-center gap-3 text-black">
              <input
                type="checkbox"
                checked={shareEventRegistration}
                onChange={(e) =>
                  setShareEventRegistration(e.target.checked)
                }
                className="h-5 w-5 accent-black"
              />
              Pendaftaran event
            </label>

            <label className="flex items-center gap-3 text-black">
              <input
                type="checkbox"
                checked={shareDonation}
                onChange={(e) => setShareDonation(e.target.checked)}
                className="h-5 w-5 accent-black"
              />
              Donasi yang sudah terverifikasi
            </label>

            <label className="flex items-center gap-3 text-black">
              <input
                type="checkbox"
                checked={shareMission}
                onChange={(e) => setShareMission(e.target.checked)}
                className="h-5 w-5 accent-black"
              />
              Misi yang disetujui
            </label>

            <div className="rounded-lg border-2 border-black bg-white p-3 text-xs text-black">
              <p className="font-bold">Yang perlu kamu tahu</p>
              <ul className="mt-1 list-disc pl-5">
                <li>
                  Yang dibagikan hanya judul aktivitasnya. Nominal donasi tidak
                  pernah ikut.
                </li>
                <li>
                  Donasi anonim dan profil privat tidak pernah dibagikan, apa
                  pun pengaturan di atas.
                </li>
                <li>
                  Mematikan sebuah pilihan akan menghapus postingan lama untuk
                  aktivitas itu. Menyalakannya kembali tidak menghidupkan
                  postingan yang sudah dihapus.
                </li>
              </ul>
            </div>

            <div className="mt-2">
              {isShareLoading ? (
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
              ) : (
                <Button
                  type="submit"
                  className="h-11 w-full border-2 border-black sm:w-auto sm:px-10"
                  style={{ boxShadow: "0px 5px 0px 0px #000000" }}
                >
                  Simpan Pengaturan Berbagi
                </Button>
              )}
            </div>
          </form>
        </div>
      </MainLayout>
    </RequiredAuthLayout>
  );
}
