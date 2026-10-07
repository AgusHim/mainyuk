// Bentuk respons GET /admin_api/metrics.
//
// Seluruh isinya angka agregat. Tidak ada id akun, nama, maupun email — jadi
// tidak ada yang perlu disamarkan di sisi klien.

export type MetricsWindow = {
  /** Inklusif. */
  from: string;
  /** Eksklusif. Untuk jendela bulan kalender, boleh berada di masa depan. */
  to: string;
  value: number;
};

export type MetricsView = {
  generated_at: string;
  active_users: {
    /**
     * MAU: bulan kalender Asia/Jakarta berjalan.
     *
     * "Aktif" di sini berarti pernah melakukan aksi bermakna (mendaftar
     * event, berdonasi, mengklaim misi, berbelanja, menulis, atau menerima
     * XP) — bukan sekadar membuka aplikasi. Skema tidak menyimpan jejak sesi,
     * jadi akun yang hanya membaca tidak terhitung.
     */
    calendar_month: MetricsWindow;
    last_7_days: MetricsWindow;
    last_30_days: MetricsWindow;
  };
  missions: {
    approved_total: number;
    /** Dihitung dari reviewed_at. */
    approved_in_month: MetricsWindow;
  };
  donations: {
    paid_total: number;
    /** Status confirmed, dihitung dari confirmed_at. */
    paid_in_month: MetricsWindow;
  };
  orders: {
    /** Seluruh riwayat, bukan hanya bulan berjalan. */
    by_payment_status: Record<string, number>;
    /** Seluruh riwayat, bukan hanya bulan berjalan. */
    by_fulfillment_status: Record<string, number>;
    created_in_month: MetricsWindow;
  };
  community: {
    threads_in_month: MetricsWindow;
    comments_in_month: MetricsWindow;
    reactions_in_month: MetricsWindow;
    reports_in_month: MetricsWindow;
    reports_by_status: Record<string, number>;
  };
};

// Label berbahasa Indonesia untuk nilai status yang datang dari server.
// Nilai yang tidak dikenal ditampilkan apa adanya, supaya penambahan status
// baru di server tidak membuat barisnya hilang dari laporan.
export const paymentStatusLabel = (status: string): string => {
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

export const fulfillmentStatusLabel = (status: string): string => {
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

export const reportStatusLabel = (status: string): string => {
  switch (status) {
    case "open":
      return "Belum ditangani";
    case "actioned":
      return "Ditindak";
    case "dismissed":
      return "Diabaikan";
    default:
      return status;
  }
};
