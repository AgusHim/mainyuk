// Berpasangan dengan server/internal/instagram/instagram.go.
// like_count dan comments_count sengaja nullable: null berarti "tidak
// diketahui", bukan nol. Lihat server/docs/api-contract.md.

export type InstagramSource = "manual" | "sync";

export type InstagramMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export type InstagramPost = {
  id: string;
  ig_media_id?: string | null;
  source: InstagramSource;
  username: string;
  caption?: string | null;
  media_type?: InstagramMediaType | null;
  media_url?: string | null;
  thumbnail_url?: string | null;
  permalink?: string | null;
  like_count?: number | null;
  comments_count?: number | null;
  posted_at?: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CreateInstagramPost = {
  username: string;
  media_url: string;
  caption?: string | null;
  media_type?: InstagramMediaType | null;
  thumbnail_url?: string | null;
  permalink?: string | null;
  like_count?: number | null;
  comments_count?: number | null;
  posted_at?: string | null;
  is_published: boolean;
  sort_order: number;
};

export type UpdateInstagramPost = Partial<CreateInstagramPost>;

export type InstagramSyncResult = {
  fetched: number;
  created: number;
  updated: number;
  skipped: number;
};

export const mediaTypeLabel = (
  type: InstagramMediaType | string | null | undefined
): string => {
  switch (type) {
    case "IMAGE":
      return "Foto";
    case "VIDEO":
      return "Video";
    case "CAROUSEL_ALBUM":
      return "Album";
    default:
      return "—";
  }
};

export const sourceLabel = (source: InstagramSource | string): string => {
  switch (source) {
    case "manual":
      return "Kurasi";
    case "sync":
      return "Sinkron";
    default:
      return source;
  }
};

// Gambar yang ditampilkan kartu: video memakai thumbnail, bukan media_url.
export const displayImage = (post: InstagramPost): string | null =>
  post.media_type === "VIDEO" ? post.thumbnail_url ?? null : post.media_url ?? null;

// Kartu menyembunyikan seluruh baris angka saat keduanya kosong. Nol asli dari
// Instagram tetap ditampilkan, jadi pengecekannya harus `== null`, bukan falsy.
export const hasCounts = (post: InstagramPost): boolean =>
  post.like_count != null || post.comments_count != null;
