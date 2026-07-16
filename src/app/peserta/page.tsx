import { MainLayout } from "@/layout/MainLayout";
import {
  PublicParticipant,
  getPublicParticipants,
} from "@/lib/darisiniParticipants";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Data Peserta",
  description: "Data peserta event dalam tampilan tabel publik.",
};

const formatDate = (value: string) => {
  if (value === "-") return value;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const Table = ({ participants }: { participants: PublicParticipant[] }) => {
  if (!participants.length) {
    return (
      <div className="border-2 border-black bg-white p-6 text-center text-black shadow-bottom">
        Belum ada data peserta yang bisa ditampilkan.
      </div>
    );
  }

  return (
    <div className="overflow-hidden border-2 border-black bg-white shadow-bottom">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[860px] table-auto text-left text-sm text-black">
          <thead className="border-b-2 border-black bg-yellow-300">
            <tr>
              <th className="w-[64px] px-4 py-3 text-center font-bold">No</th>
              <th className="min-w-[160px] px-4 py-3 font-bold">ID Tiket</th>
              <th className="min-w-[220px] px-4 py-3 font-bold">Nama</th>
              <th className="min-w-[120px] px-4 py-3 font-bold">Gender</th>
              <th className="min-w-[180px] px-4 py-3 font-bold">Tiket</th>
              <th className="min-w-[160px] px-4 py-3 font-bold">Order</th>
              <th className="min-w-[160px] px-4 py-3 font-bold">Voucher</th>
              <th className="min-w-[180px] px-4 py-3 font-bold">
                Tanggal Daftar
              </th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => (
              <tr
                key={`${participant.id}-${participant.publicId}-${index}`}
                className="border-b border-black last:border-b-0"
              >
                <td className="px-4 py-3 text-center font-semibold">
                  {index + 1}
                </td>
                <td className="px-4 py-3 font-semibold">
                  {participant.publicId}
                </td>
                <td className="px-4 py-3">{participant.userFullName}</td>
                <td className="px-4 py-3">{participant.userGender}</td>
                <td className="px-4 py-3">{participant.ticketName}</td>
                <td className="px-4 py-3">{participant.orderPublicId}</td>
                <td className="px-4 py-3">{participant.voucherName}</td>
                <td className="px-4 py-3">
                  {formatDate(participant.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default async function PesertaPage() {
  let participants: PublicParticipant[] = [];
  let errorMessage = "";

  try {
    participants = await getPublicParticipants();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengambil data peserta.";
  }

  return (
    <MainLayout>
      <main className="p-4 text-black sm:p-6">
        <section className="mb-5 border-2 border-black bg-white p-5 shadow-bottom">
          <p className="mb-1 text-sm font-semibold uppercase">
            Data Peserta
          </p>
          <h1 className="text-2xl font-black sm:text-3xl">
            Tabel Peserta Event
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6">
            Menampilkan data peserta dari sumber GraphQL tanpa kolom phone dan
            alamat peserta.
          </p>
          <div className="mt-4 inline-flex border border-black bg-yellow-300 px-3 py-1 text-sm font-bold">
            {participants.length} peserta
          </div>
        </section>

        {errorMessage ? (
          <div className="border-2 border-black bg-white p-6 text-black shadow-bottom">
            <h2 className="mb-2 text-lg font-bold">Data belum tersedia</h2>
            <p className="text-sm leading-6">{errorMessage}</p>
          </div>
        ) : (
          <Table participants={participants} />
        )}
      </main>
    </MainLayout>
  );
}
