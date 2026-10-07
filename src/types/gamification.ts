// Tipe untuk XP, level, dan leaderboard. Bentuknya mengikuti DTO server:
// tidak ada id akun internal, email, telepon, atau alamat di sini.

export type NextLevelInfo = {
  level: number;
  name: string;
  min_xp: number;
};

export type XPSummary = {
  total_xp: number;
  level: number;
  level_name: string;
  badge: string;
  progress_percent: number;
  remaining_xp: number;
  next_level?: NextLevelInfo | null;
};

export type XPLedgerEntry = {
  id: string;
  delta: number;
  source_type: string;
  ref_type?: string | null;
  ref_id?: string | null;
  note?: string | null;
  created_at: string;
};

export type LevelRule = {
  id: string;
  level: number;
  name: string;
  min_xp: number;
  badge_label?: string | null;
  badge_icon_url?: string | null;
};

export type XPRule = {
  id: string;
  source_type: string;
  xp: number;
  description?: string | null;
};

export type LeaderboardEntry = {
  rank: number;
  public_id: string;
  alias: string;
  avatar_url?: string | null;
  level: number;
  level_name: string;
  badge: string;
  xp: number;
};

export type LeaderboardPeriod = "weekly" | "monthly" | "all_time";

export type LeaderboardPage = {
  period: LeaderboardPeriod;
  page: number;
  per_page: number;
  has_more: boolean;
  entries: LeaderboardEntry[];
};

export type AdjustXP = {
  user_id: string;
  delta: number;
  reason: string;
};

export type UpdateXPRule = {
  xp: number;
  description?: string | null;
};

// Label manusiawi untuk jenis sumber XP pada riwayat.
export const xpSourceLabel = (sourceType: string): string => {
  switch (sourceType) {
    case "profile_complete":
      return "Profil dilengkapi";
    case "checkin":
      return "Check-in event";
    case "mission":
      return "Misi disetujui";
    case "adjustment":
      return "Koreksi pengurus";
    case "donation":
      return "Donasi terkonfirmasi";
    case "donation_reversal":
      return "Donasi dikembalikan";
    default:
      return sourceType;
  }
};
