// Profil komunitas. `public_id` adalah satu-satunya identifier yang boleh
// tampil di halaman publik; id akun internal tidak pernah dikirim server.

export type ProfileVisibility = "public" | "members" | "private";

export type OwnProfile = {
  public_id: string;
  alias?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  profile_visibility: ProfileVisibility;
  leaderboard_opt_out: boolean;
  show_badges: boolean;
};

export type PublicProfile = {
  public_id: string;
  alias: string;
  bio?: string | null;
  avatar_url?: string | null;
  show_badges: boolean;
};

// Semua field opsional: server hanya mengubah field yang dikirim, sehingga
// form dapat menyimpan sebagian pengaturan tanpa menimpa sisanya.
export type UpdateProfile = {
  alias?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  profile_visibility?: ProfileVisibility;
  leaderboard_opt_out?: boolean;
  show_badges?: boolean;
};
