// Marketplace merchandise resmi. Modul ini terpisah dari `src/types/order.ts`
// dengan sengaja: `order.ts` adalah tiket event — barisnya terikat pada satu
// event dan pembuatannya menerbitkan tiket. Pesanan merchandise tidak pernah
// menyentuh event mana pun.
//
// Harga di sini adalah rupiah bulat (`number`), bukan string, dan ditampilkan
// lewat `formatRupiah` dari `src/utils/currency.ts`.
//
// Satu hal yang tidak pernah ada di berkas ini: harga pada keranjang. Keranjang
// hanya menyimpan id varian dan jumlahnya, sama seperti `CartLine` di server —
// harga selalu dihitung server saat checkout.

export type ProductStatus = "draft" | "published" | "archived";

export type VariantStatus = "active" | "inactive";

// Dua sumbu status pesanan sengaja dipisah: uang dan barang bergerak dengan
// kecepatan yang berbeda, dan menggabungkannya membuat "sudah dibayar tetapi
// belum dikirim" tidak dapat dinyatakan sama sekali.
export type PaymentStatus = "pending" | "paid" | "rejected" | "refunded";

export type FulfillmentStatus =
  | "unfulfilled"
  | "ready_for_pickup"
  | "shipped"
  | "completed"
  | "cancelled";

export type FulfillmentMethod = "pickup" | "shipping";

export type ProductSort = "terbaru" | "termurah" | "termahal";

export type ProductImage = {
  id: string;
  image_url: string;
  position: number;
};

export type ProductVariant = {
  id: string;
  public_id: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  status: VariantStatus;
  position: number;
};

// Varian seperti yang tampil di katalog: `label` sudah dirakit server
// ("L / Merah"), dan `available` adalah sisa yang benar-benar bisa dijual —
// stok fisik dikurangi tahanan pesanan yang belum dibayar.
export type VariantView = ProductVariant & {
  label: string;
  available: number;
};

export type Product = {
  id: string;
  public_id: string;
  slug: string;
  name: string;
  description?: string | null;
  cover_image_url?: string | null;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
};

export type ProductView = Product & {
  images: ProductImage[];
  variants: VariantView[];
  min_price: number;
  max_price: number;
  available: number;
};

export type ShopOrderItem = {
  id: string;
  product_name: string;
  variant_label: string;
  unit_price: number;
  qty: number;
  created_at: string;
};

export type ChargeInstruction = {
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
  instructions: ChargeInstruction[] | null;
  expires_at?: string | null;
};

export type ShopOrder = {
  id: string;
  public_id: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
  fulfillment_method: FulfillmentMethod;
  recipient_name: string;
  recipient_phone: string;
  recipient_address?: string | null;
  tracking_number?: string | null;
  paid_amount?: number | null;
  payment_reference?: string | null;
  proof_url?: string | null;
  confirmed_at?: string | null;
  decision_reason?: string | null;
  rewarded_xp: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
  items?: ShopOrderItem[];
  charge?: Charge | null;
};

/* ---------- masukan ---------- */

export type CartLine = {
  variant_id: string;
  qty: number;
};

export type CreateShopOrder = {
  items: CartLine[];
  fulfillment_method: FulfillmentMethod;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_address?: string;
  payment_method_id?: string | null;
};

export type SubmitProof = {
  proof_url: string;
  payment_reference?: string;
  payment_method_id?: string;
};

export type CreateProduct = {
  name: string;
  slug?: string;
  description?: string;
  cover_image_url?: string;
  image_urls?: string[];
};

export type UpdateProduct = Partial<CreateProduct>;

export type SetProductStatus = {
  status: ProductStatus;
  reason?: string;
};

export type VariantInput = {
  sku?: string;
  size: string;
  color: string;
  price: number;
  stock?: number;
  status?: VariantStatus;
  position?: number;
};

export type AdjustStock = {
  delta: number;
  reason: string;
  note?: string;
};

export type ConfirmShopOrder = {
  paid_amount?: number;
  payment_reference: string;
  proof_url?: string;
  reason?: string;
};

export type DecideShopOrder = {
  reason: string;
};

export type FulfillShopOrder = {
  status: FulfillmentStatus;
  reason?: string;
};

export type SetShopShipping = {
  shipping_cost: number;
  tracking_number?: string;
};

export type ShopAuditLog = {
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

export const productStatusLabel = (status: ProductStatus | string): string => {
  switch (status) {
    case "draft":
      return "Draf";
    case "published":
      return "Terbit";
    case "archived":
      return "Diarsipkan";
    default:
      return status;
  }
};

export const variantStatusLabel = (status: VariantStatus | string): string => {
  switch (status) {
    case "active":
      return "Aktif";
    case "inactive":
      return "Nonaktif";
    default:
      return status;
  }
};

export const paymentStatusLabel = (status: PaymentStatus | string): string => {
  switch (status) {
    case "pending":
      return "Menunggu pembayaran";
    case "paid":
      return "Dibayar";
    case "rejected":
      return "Ditolak";
    case "refunded":
      return "Dana dikembalikan";
    default:
      return status;
  }
};

export const fulfillmentStatusLabel = (
  status: FulfillmentStatus | string
): string => {
  switch (status) {
    case "unfulfilled":
      return "Belum diproses";
    case "ready_for_pickup":
      return "Siap diambil";
    case "shipped":
      return "Dikirim";
    case "completed":
      return "Selesai";
    case "cancelled":
      return "Dibatalkan";
    default:
      return status;
  }
};

export const fulfillmentMethodLabel = (
  method: FulfillmentMethod | string
): string => {
  switch (method) {
    case "pickup":
      return "Ambil sendiri";
    case "shipping":
      return "Dikirim";
    default:
      return method;
  }
};

// Pilihan status pemenuhan yang sah untuk pengurus, bergantung pada cara
// pemenuhannya. Server tetap penentu akhir; ini hanya supaya tombol yang
// ditawarkan tidak pernah menawarkan perpindahan yang pasti ditolak.
export const fulfillmentTargets = (
  method: FulfillmentMethod,
  from: FulfillmentStatus
): FulfillmentStatus[] => {
  if (from === "completed" || from === "cancelled") {
    return [];
  }
  if (method === "pickup") {
    return from === "unfulfilled"
      ? ["ready_for_pickup", "cancelled"]
      : ["completed", "cancelled"];
  }
  return from === "unfulfilled" ? ["shipped", "cancelled"] : ["completed"];
};

// Ringkasan satu baris varian untuk pemilih di halaman produk.
export const variantLabel = (variant: {
  size: string;
  color: string;
}): string => {
  const parts = [variant.size, variant.color]
    .map((part) => part.trim())
    .filter((part) => part !== "");
  return parts.join(" / ");
};

export const paymentStatuses: PaymentStatus[] = [
  "pending",
  "paid",
  "rejected",
  "refunded",
];

export const fulfillmentStatuses: FulfillmentStatus[] = [
  "unfulfilled",
  "ready_for_pickup",
  "shipped",
  "completed",
  "cancelled",
];

export const productStatuses: ProductStatus[] = [
  "draft",
  "published",
  "archived",
];
