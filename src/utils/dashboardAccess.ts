// Peta izin rute dashboard — satu-satunya sumber kebenaran untuk "siapa boleh
// membuka apa" di sisi klien.
//
// Sebelum ini aturannya ada di dua tempat yang bisa berbeda: `Sidebar.tsx`
// menyembunyikan entri dengan perbandingan `user?.role` inline, sedangkan
// `app/dashboard/layout.tsx` hanya memeriksa sudah masuk atau belum. Akibatnya
// entri yang tidak terlihat di menu tetap bisa dibuka dengan mengetik alamatnya.
// Keduanya sekarang memakai berkas ini, jadi menu dan akses tidak mungkin lagi
// berbeda.
//
// Peran yang dikenal: "admin", "pj", "ranger", "user" (kanonik), "jamaah"
// (nilai lama, satu tier dengan "user"). Daftar peran di sini **mengikuti izin
// di server** (`server/internal/authz/authz.go`), bukan sebaliknya: server tetap
// penentu akhir, dan pemeriksaan di klien hanya untuk kenyamanan.

/**
 * Tier anggota. "user" adalah nilai kanonik, "jamaah" nilai lama dari alur
 * tamu, "member" ikut diterima karena dipakai sebagian data lama.
 */
export const MEMBER_ROLES = ["user", "jamaah", "member"];

const ADMIN = ["admin"];
const ADMIN_PJ = ["admin", "pj"];
const ADMIN_PJ_RANGER = ["admin", "pj", "ranger"];
const PJ_RANGER = ["pj", "ranger"];

type Route = {
  /** Awalan jalur, tanpa garis miring di ujung. */
  prefix: string;
  /**
   * Peran yang boleh membuka. `null` berarti "semua yang sudah masuk".
   */
  roles: string[] | null;
  /**
   * Cocokkan hanya jalur persis, bukan turunannya. Dipakai oleh akar
   * `/dashboard`, yang tidak boleh menyerap rute di bawahnya.
   */
  exact?: boolean;
};

// Setiap rute dashboard harus terdaftar di sini. Rute yang tidak terdaftar
// ditolak untuk semua orang — termasuk admin. Sengaja begitu: kegagalannya
// langsung terlihat saat halaman baru dibuat, bukan menjadi lubang yang
// diam-diam terbuka untuk peran lain.
const ROUTES: Route[] = [
  { prefix: "/dashboard", roles: ADMIN, exact: true },

  { prefix: "/dashboard/agenda", roles: ADMIN_PJ },
  { prefix: "/dashboard/campaigns", roles: ADMIN_PJ },
  // Halaman ini membaca donasi yang dikonfirmasi ranger; izinnya sama dengan
  // entri "Riwayat Kontribusi" di menu.
  { prefix: "/dashboard/contributions", roles: PJ_RANGER },
  { prefix: "/dashboard/divisi", roles: ADMIN },
  { prefix: "/dashboard/donations", roles: ADMIN_PJ },
  { prefix: "/dashboard/events", roles: ADMIN },
  { prefix: "/dashboard/feedback", roles: ADMIN },
  // Server memeriksa izin `metrics:view`, yang dimiliki admin dan pj.
  { prefix: "/dashboard/metrics", roles: ADMIN_PJ },
  { prefix: "/dashboard/missions", roles: ADMIN_PJ },
  // Server memeriksa izin `moderation:moderate`, yang juga dimiliki ranger.
  { prefix: "/dashboard/moderation", roles: ADMIN_PJ_RANGER },
  { prefix: "/dashboard/orders", roles: ADMIN },
  { prefix: "/dashboard/payment_methods", roles: ADMIN },
  // Riwayat kehadiran pribadi. Hanya anggota; pengurus memakai halaman lain.
  // Perilaku ini dipertahankan apa adanya dari menu lama — kalau ternyata
  // pengurus juga perlu membukanya, perubahannya cukup satu baris di sini.
  { prefix: "/dashboard/presences", roles: MEMBER_ROLES },
  { prefix: "/dashboard/rangers/card", roles: PJ_RANGER },
  { prefix: "/dashboard/rangers", roles: ADMIN_PJ },
  { prefix: "/dashboard/shop", roles: ADMIN_PJ },
  // Server memeriksa izin `users:view`, yang dimiliki admin dan pj.
  { prefix: "/dashboard/users", roles: ADMIN_PJ },
];

// Diurutkan dari awalan terpanjang supaya "/dashboard/rangers/card" menang atas
// "/dashboard/rangers", bukan bergantung pada urutan penulisan di atas. Rute
// `exact` selalu di akhir, jadi ia hanya terpakai kalau tidak ada yang cocok.
const ROUTES_BY_LENGTH = [...ROUTES].sort((a, b) => {
  if (!!a.exact !== !!b.exact) {
    return a.exact ? 1 : -1;
  }
  return b.prefix.length - a.prefix.length;
});

const normalize = (pathname: string): string => {
  const withoutQuery = pathname.split("?")[0].split("#")[0];
  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery;
};

/**
 * Peran yang boleh membuka `pathname`.
 *
 * - `string[]` — hanya peran tersebut.
 * - `null` — semua yang sudah masuk.
 * - `[]` — tidak ada yang boleh (rute belum terdaftar di peta ini).
 */
export const dashboardRoles = (pathname: string): string[] | null => {
  const path = normalize(pathname);

  for (const route of ROUTES_BY_LENGTH) {
    const cocok = route.exact
      ? path === route.prefix
      : path === route.prefix || path.startsWith(route.prefix + "/");
    if (cocok) {
      return route.roles;
    }
  }

  return [];
};

/**
 * Apakah `role` boleh membuka `pathname`.
 *
 * Peran kosong/null selalu ditolak: pemanggil diharapkan sudah memastikan
 * pengguna masuk lebih dulu (lihat `app/dashboard/layout.tsx`).
 */
export const canAccessDashboard = (
  pathname: string,
  role: string | null | undefined
): boolean => {
  if (!role) {
    return false;
  }
  const roles = dashboardRoles(pathname);
  if (roles === null) {
    return true;
  }
  return roles.includes(role);
};
