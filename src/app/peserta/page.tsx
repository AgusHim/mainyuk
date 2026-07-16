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
    <div className="hidden overflow-hidden border-2 border-black bg-white shadow-bottom-right md:block">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm text-black">
          <thead className="border-b-2 border-black bg-yellow-300">
            <tr>
              <th className="w-14 px-3 py-3 text-center font-bold">No</th>
              <th className="w-[13%] px-3 py-3 font-bold">ID Tiket</th>
              <th className="w-[23%] px-3 py-3 font-bold">Nama</th>
              <th className="w-[10%] px-3 py-3 font-bold">Gender</th>
              <th className="w-[14%] px-3 py-3 font-bold">Tiket</th>
              <th className="w-[13%] px-3 py-3 font-bold">Order</th>
              <th className="w-[12%] px-3 py-3 font-bold">Voucher</th>
              <th className="w-[15%] px-3 py-3 font-bold">
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
                <td className="px-3 py-3 text-center font-semibold">
                  {index + 1}
                </td>
                <td className="break-words px-3 py-3 font-semibold">
                  {participant.publicId}
                </td>
                <td className="break-words px-3 py-3">
                  {participant.userFullName}
                </td>
                <td className="px-3 py-3">{participant.userGender}</td>
                <td className="break-words px-3 py-3">
                  {participant.ticketName}
                </td>
                <td className="break-words px-3 py-3">
                  {participant.orderPublicId}
                </td>
                <td className="break-words px-3 py-3">
                  {participant.voucherName}
                </td>
                <td className="px-3 py-3">
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

const ParticipantCards = ({
  participants,
}: {
  participants: PublicParticipant[];
}) => {
  if (!participants.length) return null;

  return (
    <div className="grid gap-3 md:hidden">
      {participants.map((participant, index) => (
        <article
          key={`${participant.id}-${participant.publicId}-${index}-card`}
          className="border-2 border-black bg-white p-4 shadow-bottom-right"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="break-words text-lg font-black">
                {participant.userFullName}
              </p>
              <p className="mt-1 text-sm font-semibold">
                {participant.publicId}
              </p>
            </div>
            <span className="shrink-0 border border-black bg-yellow-300 px-2 py-1 text-sm font-bold">
              {index + 1}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="font-bold">Gender</dt>
            <dd>{participant.userGender}</dd>
            <dt className="font-bold">Tiket</dt>
            <dd className="break-words">{participant.ticketName}</dd>
            <dt className="font-bold">Order</dt>
            <dd className="break-words">{participant.orderPublicId}</dd>
            <dt className="font-bold">Voucher</dt>
            <dd className="break-words">{participant.voucherName}</dd>
            <dt className="font-bold">Tanggal</dt>
            <dd>{formatDate(participant.createdAt)}</dd>
          </dl>
        </article>
      ))}
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
    <main className="min-h-screen bg-yellow-300 px-4 py-5 text-black sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <section className="mb-5 border-2 border-black bg-white p-5 shadow-bottom-right sm:p-6">
          <p className="mb-1 text-sm font-semibold uppercase">
            Data Peserta
          </p>
          <h1 className="text-2xl font-black sm:text-3xl">
            Teh Hijau - Ada Yang Hilang Dariku Belakangan
          </h1>
          <div className="mt-4 inline-flex border border-black bg-yellow-300 px-3 py-1 text-sm font-bold">
            {participants.length} peserta
          </div>
        </section>

        {errorMessage ? (
          <div className="border-2 border-black bg-white p-6 text-black shadow-bottom-right">
            <h2 className="mb-2 text-lg font-bold">Data belum tersedia</h2>
            <p className="text-sm leading-6">{errorMessage}</p>
          </div>
        ) : (
          <>
            <Table participants={participants} />
            <ParticipantCards participants={participants} />
          </>
        )}
      </div>
    </main>
  );
}
