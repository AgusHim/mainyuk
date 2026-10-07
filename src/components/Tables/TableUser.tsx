"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getUsers } from "@/redux/slices/userAdminSlice";
import { formatStrToDateTime } from "@/utils/convert";
import { useEffect, useState } from "react";

// Label peran untuk tampilan. Nilai yang tidak dikenal ditampilkan apa adanya
// supaya penambahan peran baru di server tidak membuat barisnya hilang.
const roleLabel = (role: string): string => {
  switch (role) {
    case "admin":
      return "Admin";
    case "pj":
      return "PJ";
    case "ranger":
      return "Ranger";
    case "user":
    case "member":
      return "Anggota";
    case "jamaah":
      return "Jamaah";
    default:
      return role;
  }
};

/**
 * Daftar akun.
 *
 * Seluruh isinya berasal dari `GET /admin_api/users`; tidak ada baris contoh di
 * berkas ini. Endpoint itu memeriksa izin `users:view` (admin dan pj), dan
 * halaman ini pun hanya dapat dibuka oleh peran yang sama.
 */
const TableUser = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.userAdmin.users);
  const page = useAppSelector((state) => state.userAdmin.page);
  const hasMore = useAppSelector((state) => state.userAdmin.hasMore);
  const activeSearch = useAppSelector((state) => state.userAdmin.search);
  const activeRole = useAppSelector((state) => state.userAdmin.role);
  const isLoading = useAppSelector((state) => state.userAdmin.loading);
  const error = useAppSelector((state) => state.userAdmin.error);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    dispatch(getUsers({ page: 1 }));
  }, [dispatch]);

  const load = (nextPage: number, nextSearch = search, nextRole = role) => {
    dispatch(
      getUsers({
        page: nextPage,
        search: nextSearch.trim() === "" ? undefined : nextSearch.trim(),
        role: nextRole === "" ? undefined : nextRole,
      })
    );
  };

  return (
    <div className="rounded-sm border-2 border-black bg-white px-5 pt-6 pb-2.5 shadow-bottom dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Daftar akun
      </h2>

      <form
        className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          load(1);
        }}
      >
        <div className="w-full sm:w-64">
          <Label htmlFor="user-search" className="mb-1 block">
            Cari
          </Label>
          <Input
            id="user-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nama, username, atau email"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
          />
        </div>

        <div className="w-full sm:w-48">
          <Label htmlFor="user-role" className="mb-1 block">
            Peran
          </Label>
          <Select
            value={role === "" ? "all" : role}
            onValueChange={(value) => {
              const next = value === "all" ? "" : value;
              setRole(next);
              load(1, search, next);
            }}
          >
            <SelectTrigger
              id="user-role"
              className="h-11 w-full rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
            >
              <SelectValue placeholder="Semua peran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="pj">PJ</SelectItem>
              <SelectItem value="ranger">Ranger</SelectItem>
              <SelectItem value="user">Anggota</SelectItem>
              <SelectItem value="jamaah">Jamaah</SelectItem>
              <SelectItem value="all">Semua</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="h-11 border-2 border-black bg-meta-3 text-white hover:bg-opacity-90"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Cari
        </Button>
      </form>

      {error != null ? (
        <div
          role="alert"
          className="mb-4 flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger"
        >
          <span>{error}</span>
        </div>
      ) : null}

      <div className="max-w-full overflow-x-auto">
        <table className="mb-3 w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Nama
              </th>
              <th className="min-w-[110px] py-4 px-4 font-medium text-black dark:text-white">
                Peran
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Gender
              </th>
              <th className="min-w-[140px] py-4 px-4 font-medium text-black dark:text-white">
                No Whatsapp
              </th>
              <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                Alamat
              </th>
              <th className="min-w-[80px] py-4 px-4 font-medium text-black dark:text-white">
                Umur
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Tgl Dibuat
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="border-b border-black py-6 px-2 text-center text-black dark:text-white"
                >
                  {isLoading
                    ? "Memuat…"
                    : activeSearch !== "" || activeRole !== ""
                      ? "Tidak ada akun yang cocok dengan filter ini."
                      : "Belum ada akun."}
                </td>
              </tr>
            ) : (
              users.map((data) => (
                <tr key={data.id}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {data.name || "tanpa nama"}
                    </h5>
                    {data.username ? (
                      <p className="mt-1 text-xs text-black dark:text-white">
                        @{data.username}
                      </p>
                    ) : null}
                    {data.email ? (
                      <p className="mt-1 text-xs text-black dark:text-white">
                        {data.email}
                      </p>
                    ) : null}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {roleLabel(data.role)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {data.gender || "-"}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {data.phone || "-"}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {data.address || "-"}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {data.age ? `${data.age} th` : "-"}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {data.created_at
                        ? formatStrToDateTime(data.created_at, "dd MMM yyyy")
                        : "-"}
                    </p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={page <= 1 || isLoading}
          onClick={() => load(page - 1)}
          className="h-10 border-2 border-black bg-white px-4 text-black dark:bg-boxdark dark:text-white"
        >
          Sebelumnya
        </Button>
        <span className="text-sm text-black dark:text-white">
          Halaman {page}
        </span>
        <Button
          type="button"
          variant="outline"
          disabled={!hasMore || isLoading}
          onClick={() => load(page + 1)}
          className="h-10 border-2 border-black bg-white px-4 text-black dark:bg-boxdark dark:text-white"
        >
          Berikutnya
        </Button>
      </div>
    </div>
  );
};

export default TableUser;
