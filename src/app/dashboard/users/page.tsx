import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableUser from "@/components/Tables/TableUser";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Teman Hijrah - YukNgaji Solo",
  description: "Halaman daftar teman hijrah YukNgaji",
  // other metadata
};

// Tiga kartu ringkasan yang dulu ada di atas tabel ("Total Teman", "Ikhwan",
// "Akhwat") dihapus: angkanya tetap "3.456" untuk ketiganya dan tidak pernah
// berasal dari data mana pun. Jumlah per gender menuntut pengelompokan yang
// belum ada di endpoint daftar, jadi menampilkannya berarti mengarang lagi.
const UsersPage = () => {
  return (
    <>
      <Breadcrumb pageName="Teman Hijrah" />
      <div className="flex flex-col gap-10">
        <TableUser />
      </div>
    </>
  );
};

export default UsersPage;
