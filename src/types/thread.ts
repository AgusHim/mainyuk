// Feed komunitas anonim. Modul ini terpisah dari QnA per event
// (`src/types/comment.ts`): komentar event menampilkan username akun, sedangkan
// feed ini hanya pernah menampilkan alias — dan "Anonim" bila aliasnya kosong.
//
// `author.public_id` adalah penanda profil publik, bukan id akun. Server tidak
// pernah mengirim id akun, email, atau telepon pada bentuk mana pun di bawah.

export type ThreadStatus = "published" | "hidden" | "deleted";

export type ThreadSourceType = "event_registration" | "donation" | "mission";

export type ThreadSort = "terbaru" | "populer";

export type ReportTargetType = "thread" | "thread_comment";

export type ReportReason =
  | "spam"
  | "sara"
  | "pornografi"
  | "penipuan"
  | "perundungan"
  | "lainnya";

export type ReportStatus = "open" | "actioned" | "dismissed";

export type ThreadAuthor = {
  public_id: string;
  alias: string;
  avatar_url?: string | null;
  show_badges: boolean;
};

// Bentuk thread di jalur publik. `excerpt` dipakai daftar feed dan `body`
// dipakai halaman detail — keduanya tidak pernah terisi bersamaan.
export type Thread = {
  public_id: string;
  title: string;
  body?: string;
  excerpt?: string;
  author: ThreadAuthor;
  status: ThreadStatus;
  source_type?: ThreadSourceType | null;
  comment_count: number;
  reaction_count: number;
  reacted: boolean;
  is_mine: boolean;
  created_at: string;
};

export type ThreadComment = {
  public_id: string;
  body: string;
  author: ThreadAuthor;
  status: ThreadStatus;
  is_mine: boolean;
  created_at: string;
};

export type Report = {
  id: string;
  public_id: string;
  target_type: ReportTargetType;
  reason: ReportReason;
  note?: string | null;
  status: ReportStatus;
  decision_reason?: string | null;
  created_at: string;
};

// Ringkasan konten yang dilaporkan, supaya antrean moderator tidak perlu
// memuat halaman thread satu per satu.
export type ReportTarget = {
  type: ReportTargetType;
  public_id: string;
  title: string;
  excerpt: string;
  status: ThreadStatus;
};

export type ModerationReport = {
  report: Report;
  target?: ReportTarget | null;
  author?: ThreadAuthor | null;
};

// Preferensi berbagi aktivitas. Default-nya semua `true` (kebijakan opt-out);
// ketiadaan baris di server berarti semua `true`.
export type SharePrefs = {
  share_event_registration: boolean;
  share_donation: boolean;
  share_mission: boolean;
};

export type CreateThread = {
  title: string;
  body: string;
};

export type CreateThreadComment = {
  body: string;
};

export type CreateReport = {
  target_type: ReportTargetType;
  target_id: string;
  reason: ReportReason;
  note?: string | null;
};

export type UpdateSharePrefs = Partial<SharePrefs>;

export type DecideContent = {
  reason: string;
};

export type DecideReport = {
  reason: string;
  hide_target: boolean;
};

export type RestrictAccount = {
  blocked: boolean;
  reason: string;
};

// Jejak keputusan moderator. Bentuknya sama dengan audit_logs milik
// fundraising; server hanya menyaring entity_type yang relevan dengan moderasi.
export type ModerationAuditLog = {
  id: string;
  actor_user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  reason?: string | null;
  detail?: string | null;
  created_at: string;
};

/* ---------- label ---------- */

export const threadStatusLabel = (status: ThreadStatus | string): string => {
  switch (status) {
    case "published":
      return "Tayang";
    case "hidden":
      return "Disembunyikan";
    case "deleted":
      return "Dihapus";
    default:
      return status;
  }
};

export const reportReasonLabel = (reason: ReportReason | string): string => {
  switch (reason) {
    case "spam":
      return "Spam atau promosi";
    case "sara":
      return "SARA";
    case "pornografi":
      return "Pornografi";
    case "penipuan":
      return "Penipuan";
    case "perundungan":
      return "Perundungan";
    case "lainnya":
      return "Lainnya";
    default:
      return reason;
  }
};

export const reportStatusLabel = (status: ReportStatus | string): string => {
  switch (status) {
    case "open":
      return "Menunggu";
    case "actioned":
      return "Ditindak";
    case "dismissed":
      return "Diabaikan";
    default:
      return status;
  }
};

export const threadSourceLabel = (
  source?: ThreadSourceType | string | null
): string => {
  switch (source) {
    case "event_registration":
      return "Pendaftaran event";
    case "donation":
      return "Donasi";
    case "mission":
      return "Misi selesai";
    default:
      return "";
  }
};

// Alasan laporan yang boleh dipilih anggota, berurutan untuk ditampilkan.
export const reportReasons: ReportReason[] = [
  "spam",
  "sara",
  "pornografi",
  "penipuan",
  "perundungan",
  "lainnya",
];
