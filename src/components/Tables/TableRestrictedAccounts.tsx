"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  getRestrictedAccounts,
  removeRestrictedAccount,
  restrictAccount,
} from "@/redux/slices/moderationSlice";
import { PublicProfile } from "@/types/community";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Dialog from "../common/Dialog/Dialog";

/**
 * Daftar akun yang sedang dibatasi.
 *
 * Akun dikenali lewat `public_id` profilnya, bukan id akun — id akun memang
 * tidak pernah melintasi kabel. Membatasi akun dilakukan dari antrean laporan
 * (tombol "Batasi akun"); di sini yang tersedia adalah mencabut pembatasannya.
 */
const TableRestrictedAccounts = () => {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(
    (state) => state.moderation.restrictedAccounts
  );
  const isLoading = useAppSelector((state) => state.moderation.loading);
  const error = useAppSelector((state) => state.moderation.error);

  const [target, setTarget] = useState<PublicProfile | null>(null);
  const [reason, setReason] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = (account: PublicProfile) => {
    setTarget(account);
    setReason("");
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    setTarget(null);
    setReason("");
    dialogRef.current?.close();
  };

  const submit = () => {
    if (!target) {
      return;
    }
    dispatch(
      restrictAccount({
        publicId: target.public_id,
        data: { blocked: false, reason },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Pembatasan dicabut");
        dispatch(removeRestrictedAccount(target.public_id));
        closeDialog();
      })
      .catch(() => {
        // Pesan kesalahan sudah ditampilkan interceptor API.
      });
  };

  if (error != null) {
    return (
      <div
        role="alert"
        className="flex h-auto w-full items-center gap-3 rounded-lg border-2 border-black bg-danger/10 px-4 py-3 text-danger shadow-bottom"
      >
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="rounded-sm border-2 border-black bg-white px-5 pt-6 pb-2.5 shadow-bottom dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Akun dibatasi
        </h2>
        <Button
          type="button"
          onClick={() => dispatch(getRestrictedAccounts(1))}
          className="h-11 border-2 border-black bg-meta-3 text-white hover:bg-opacity-90"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Muat ulang
        </Button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="mb-3 w-full table-auto">
          <thead className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Alias
              </th>
              <th className="min-w-[240px] py-4 px-4 font-medium text-black dark:text-white">
                Bio
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="border-b border-black py-6 px-2 text-center text-black dark:text-white"
                >
                  {isLoading ? "Memuat…" : "Tidak ada akun yang dibatasi."}
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr key={account.public_id}>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white xl:pl-11">
                    {account.alias}
                  </td>
                  <td className="border-b border-black py-4 px-4 text-black dark:text-white">
                    {account.bio ?? "-"}
                  </td>
                  <td className="border-b border-black py-4 px-4">
                    <Button
                      type="button"
                      onClick={() => openDialog(account)}
                      className="h-9 border-2 border-black bg-success text-white hover:bg-opacity-90"
                      style={{ boxShadow: "5px 5px 0px #000000" }}
                    >
                      Cabut pembatasan
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Dialog
          toggleDialog={closeDialog}
          ref={dialogRef}
          title="Cabut pembatasan akun"
        >
          <h3 className="text-lg font-bold text-black dark:text-white">
            Cabut pembatasan akun
          </h3>
          <p className="py-2 text-sm text-black dark:text-white">
            Alasan wajib diisi. Kiriman akun ini akan tampil kembali di feed
            setelah pembatasannya dicabut.
          </p>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Alasan pencabutan"
            className="h-11 rounded-lg border-2 border-black bg-white px-4 font-medium dark:border-strokedark dark:bg-boxdark"
          />
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              disabled={reason.trim() === ""}
              onClick={submit}
              className="h-10 border-2 border-black bg-success text-white hover:bg-opacity-90 disabled:opacity-50"
              style={{ boxShadow: "5px 5px 0px #000000" }}
            >
              Cabut pembatasan
            </Button>
            <Button
              type="button"
              onClick={closeDialog}
              className="h-10 border-2 border-black bg-meta-1 text-white hover:bg-opacity-90"
              style={{ boxShadow: "5px 5px 0px #000000" }}
            >
              Batal
            </Button>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default TableRestrictedAccounts;
