// Format rupiah. Uang di seluruh aplikasi berupa bilangan bulat rupiah —
// tidak ada pecahan dan tidak ada float — jadi helper ini hanya menambahkan
// pemisah ribuan tanpa pembulatan.

export const formatRupiah = (value: number): string => {
  if (!Number.isFinite(value)) {
    return "Rp0";
  }
  return `Rp${Math.round(value).toLocaleString("id-ID")}`;
};

// formatRupiahShort memampatkan angka besar untuk bilah progres dan kartu
// ringkas: 1.250.000 -> "Rp1,3 jt", 2.400.000.000 -> "Rp2,4 M".
//
// Nilai di bawah seribu ditampilkan apa adanya supaya angka kecil tidak
// tampak dibulatkan menjadi nol.
export const formatRupiahShort = (value: number): string => {
  if (!Number.isFinite(value)) {
    return "Rp0";
  }

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1_000_000_000_000) {
    return `${sign}Rp${formatDecimal(abs / 1_000_000_000_000)} T`;
  }
  if (abs >= 1_000_000_000) {
    return `${sign}Rp${formatDecimal(abs / 1_000_000_000)} M`;
  }
  if (abs >= 1_000_000) {
    return `${sign}Rp${formatDecimal(abs / 1_000_000)} jt`;
  }
  if (abs >= 1_000) {
    return `${sign}Rp${formatDecimal(abs / 1_000)} rb`;
  }
  return formatRupiah(value);
};

// formatDecimal membulatkan ke satu angka di belakang koma memakai koma
// sebagai pemisah desimal, sesuai kebiasaan penulisan angka Indonesia.
const formatDecimal = (value: number): string => {
  const rounded = Math.round(value * 10) / 10;
  return rounded.toLocaleString("id-ID", { maximumFractionDigits: 1 });
};
