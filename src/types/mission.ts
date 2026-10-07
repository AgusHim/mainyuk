import { PublicProfile } from "./community";

export type MissionType = "daily" | "weekly" | "special";

export type VerificationMode = "auto" | "self_claim" | "proof_approval";

export type ClaimStatus = "pending" | "approved" | "rejected" | "cancelled";

export type Mission = {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  type: MissionType;
  verification_mode: VerificationMode;
  reward_xp: number;
  claim_limit: number;
  version: number;
  starts_at: string;
  ends_at: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// Bentuk misi untuk anggota: server menghitung periode yang berlaku sekarang
// di zona Asia/Jakarta, jadi client tidak perlu menghitung zona waktu sendiri.
export type MissionView = Mission & {
  current_period_key: string;
  can_claim_now: boolean;
  required_proof: boolean;
};

export type MissionClaim = {
  id: string;
  mission_id: string;
  mission_version: number;
  period_key: string;
  status: ClaimStatus;
  reward_xp?: number | null;
  proof_url?: string | null;
  proof_note?: string | null;
  decision_reason?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type ClaimView = MissionClaim & {
  mission_title: string;
  mission_type: MissionType;
};

export type AdminClaimView = ClaimView & {
  claimant?: PublicProfile | null;
};

export type CreateMission = {
  code: string;
  title: string;
  description?: string | null;
  type: MissionType;
  verification_mode: VerificationMode;
  reward_xp: number;
  claim_limit: number;
  starts_at: string;
  ends_at: string;
  is_published: boolean;
  sort_order: number;
};

export type UpdateMission = Partial<CreateMission>;

export type ClaimMission = {
  proof_url?: string | null;
  proof_note?: string | null;
};

export type DecideClaim = {
  reason?: string;
};

export const missionTypeLabel = (type: MissionType | string): string => {
  switch (type) {
    case "daily":
      return "Harian";
    case "weekly":
      return "Mingguan";
    case "special":
      return "Khusus";
    default:
      return type;
  }
};

export const verificationModeLabel = (mode: VerificationMode | string): string => {
  switch (mode) {
    case "auto":
      return "Otomatis";
    case "self_claim":
      return "Klaim mandiri";
    case "proof_approval":
      return "Bukti + persetujuan";
    default:
      return mode;
  }
};

export const claimStatusLabel = (status: ClaimStatus | string): string => {
  switch (status) {
    case "pending":
      return "Menunggu";
    case "approved":
      return "Disetujui";
    case "rejected":
      return "Ditolak";
    case "cancelled":
      return "Dibatalkan";
    default:
      return status;
  }
};
