import { PublicProfile } from "./community";

export type CampaignStatus = "draft" | "published" | "closed";

export type FundType =
  | "operasional"
  | "dakwah"
  | "sosial"
  | "pendidikan"
  | "lainnya";

export type DonationStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "cancelled"
  | "refunded";

// "none" berarti donatur tidak menulis pesan; ia dibedakan dari "pending"
// supaya donasi tanpa pesan tidak menumpuk di antrean moderasi.
export type MessageStatus = "none" | "pending" | "approved" | "hidden";

export type UpdateKind = "update" | "usage" | "fee";

export type Campaign = {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  story?: string | null;
  cover_image_url?: string | null;
  fund_type: FundType;
  recipient: string;
  target_amount: number;
  status: CampaignStatus;
  starts_at?: string | null;
  ends_at?: string | null;
  published_at?: string | null;
  closed_at?: string | null;
  created_at: string;
  updated_at: string;
};

// CampaignView melengkapi campaign dengan progres yang dihitung server saat
// diakses — tidak pernah dikirim sebagai counter yang bisa melenceng.
export type CampaignView = Campaign & {
  raised_amount: number;
  donor_count: number;
  progress_percent: number;
  is_open: boolean;
};

// Bentuk publik satu donasi. amount null berarti nominalnya disembunyikan —
// server memaksa itu untuk donasi anonim.
export type PublicDonation = {
  public_id: string;
  donor_name: string;
  donor_hidden: boolean;
  avatar_url?: string | null;
  amount?: number | null;
  message?: string | null;
  created_at: string;
};

export type Donation = {
  id: string;
  public_id: string;
  campaign_id: string;
  amount: number;
  status: DonationStatus;
  is_anonymous: boolean;
  show_amount: boolean;
  message?: string | null;
  message_status: MessageStatus;
  payment_method_id?: string | null;
  paid_amount?: number | null;
  payment_reference?: string | null;
  proof_url?: string | null;
  confirmed_at?: string | null;
  decision_reason?: string | null;
  rewarded_xp: number;
  created_at: string;
  updated_at: string;
};

// DonationView adalah donasi milik pemanggil sendiri; selalu lengkap.
export type DonationView = Donation & {
  campaign_slug: string;
  campaign_title: string;
};

export type AdminDonationView = Donation & {
  donor?: PublicProfile | null;
  campaign_slug: string;
  campaign_title: string;
};

export type CampaignUpdate = {
  id: string;
  campaign_id: string;
  title: string;
  body: string;
  kind: UpdateKind;
  amount?: number | null;
  proof_url?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type PaymentInstruction = {
  method_id: string;
  type: string;
  name: string;
  account_name: string;
  account_number: string;
  image_url?: string | null;
};

export type Charge = {
  provider: string;
  external_id?: string | null;
  amount: number;
  instructions: PaymentInstruction[] | null;
  expires_at?: string | null;
};

export type DonationResult = {
  donation: DonationView;
  charge?: Charge | null;
};

export type ReportTotals = {
  confirmed_amount: number;
  confirmed_count: number;
  pending_amount: number;
  pending_count: number;
  rejected_amount: number;
  rejected_count: number;
  refunded_amount: number;
  refunded_count: number;
  fee_amount: number;
  usage_amount: number;
  net_amount: number;
};

export type ReportView = {
  campaign: Campaign;
  totals: ReportTotals;
  updates: CampaignUpdate[] | null;
};

export type AuditLog = {
  id: string;
  actor_user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  reason?: string | null;
  detail?: string | null;
  created_at: string;
};

export type CreateCampaign = {
  slug: string;
  title: string;
  summary?: string | null;
  story?: string | null;
  cover_image_url?: string | null;
  fund_type: FundType;
  recipient: string;
  target_amount: number;
  starts_at?: string | null;
  ends_at?: string | null;
};

export type UpdateCampaign = Partial<CreateCampaign>;

export type CreateDonation = {
  campaign_slug: string;
  amount: number;
  is_anonymous: boolean;
  show_amount: boolean;
  message?: string | null;
  payment_method_id?: string | null;
  // Token idempotensi: dibuat sekali per pemuatan form, supaya klik ganda
  // menghasilkan satu donasi, bukan dua.
  client_token: string;
};

export type ConfirmDonation = {
  paid_amount?: number;
  payment_reference?: string;
  proof_url?: string | null;
  reason?: string | null;
};

export type CampaignUpdateInput = {
  title: string;
  body: string;
  kind: UpdateKind;
  amount?: number | null;
  proof_url?: string | null;
  is_published?: boolean;
};

export type DonationFilter = {
  status?: DonationStatus | "";
  message_status?: MessageStatus | "";
  campaign_id?: string;
  page?: number;
};

/* ---------- label ---------- */

export const campaignStatusLabel = (status: CampaignStatus): string => {
  switch (status) {
    case "draft":
      return "Draf";
    case "published":
      return "Terbit";
    case "closed":
      return "Ditutup";
    default:
      return status;
  }
};

export const fundTypeLabel = (fundType: FundType): string => {
  switch (fundType) {
    case "operasional":
      return "Operasional";
    case "dakwah":
      return "Dakwah";
    case "sosial":
      return "Sosial";
    case "pendidikan":
      return "Pendidikan";
    case "lainnya":
      return "Lainnya";
    default:
      return fundType;
  }
};

export const donationStatusLabel = (status: DonationStatus): string => {
  switch (status) {
    case "pending":
      return "Menunggu verifikasi";
    case "confirmed":
      return "Terkonfirmasi";
    case "rejected":
      return "Ditolak";
    case "cancelled":
      return "Dibatalkan";
    case "refunded":
      return "Dana dikembalikan";
    default:
      return status;
  }
};

export const messageStatusLabel = (status: MessageStatus): string => {
  switch (status) {
    case "none":
      return "Tanpa pesan";
    case "pending":
      return "Menunggu moderasi";
    case "approved":
      return "Tampil";
    case "hidden":
      return "Disembunyikan";
    default:
      return status;
  }
};

export const updateKindLabel = (kind: UpdateKind): string => {
  switch (kind) {
    case "update":
      return "Perkembangan";
    case "usage":
      return "Penggunaan dana";
    case "fee":
      return "Biaya";
    default:
      return kind;
  }
};
