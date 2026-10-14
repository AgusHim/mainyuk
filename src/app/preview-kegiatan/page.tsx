// Halaman pratinjau sementara untuk membandingkan section "Kegiatan Bersama
// YN Solo" dengan rancangannya. Bukan bagian dari aplikasi.
import KegiatanBersama from "@/components/landing/KegiatanBersama";

export default function PreviewKegiatanPage() {
  return (
    <div className="yn-landing min-h-screen w-full">
      {/* Animasi reveal dimatikan supaya tangkapan layar menampilkan keadaan
          akhir, bukan keadaan tengah transisi. Hanya berlaku di halaman ini. */}
      <style>{`.yn-reveal{opacity:1 !important;transform:none !important;transition:none !important}`}</style>
      <KegiatanBersama />
    </div>
  );
}
