"use client";
import DashboardLoader from "../common/Loader/DashboardLoader";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  deleteMission,
  getAdminMissions,
  setAdminMission,
} from "@/redux/slices/missionSlice";
import { missionTypeLabel, verificationModeLabel } from "@/types/mission";
import { formatStrToDateTime } from "@/utils/convert";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import Dialog from "../common/Dialog/Dialog";

type Props = {
  toggleDialog: () => void;
  setDialogContent: () => void;
};

const TableMissions: React.FC<Props> = ({ toggleDialog, setDialogContent }) => {
  const dispatch = useAppDispatch();
  const missions = useAppSelector((state) => state.mission.adminMissions);
  const isLoading = useAppSelector((state) => state.mission.loading);
  const error = useAppSelector((state) => state.mission.error);

  const [dialogContent, setConfirmDialog] = useState<React.ReactNode>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleConfirmDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  const submitDeleteMission = (id: string) => {
    dispatch(deleteMission(id))
      .unwrap()
      .then(() => dispatch(getAdminMissions()))
      .catch(() => {
        // Pesan kesalahan sudah ditampilkan interceptor API.
      });
  };

  if (missions == null && isLoading) {
    return <DashboardLoader />;
  }

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
    <div className="rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-bottom border-2 border-black dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto mb-3">
          <thead className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Judul
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Jenis
              </th>
              <th className="min-w-[160px] py-4 px-4 font-medium text-black dark:text-white">
                Verifikasi
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Reward
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                Periode
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && missions == null ? (
              <tr>
                <td
                  colSpan={7}
                  className="border-b border-black py-6 px-2 text-center text-black dark:text-white"
                >
                  Memuat…
                </td>
              </tr>
            ) : null}
            {!isLoading && missions != null && missions.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="border-b border-black py-6 px-2 text-center text-black dark:text-white"
                >
                  Belum ada misi.
                </td>
              </tr>
            ) : null}
            {missions?.map((mission) => (
              <tr key={mission.id}>
                <td className="border-b border-black py-3 px-2 pl-9 xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {mission.title}
                  </h5>
                  <p className="text-xs text-bodydark">{mission.code}</p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p className="badge badge-outline badge-primary font-bold">
                    {missionTypeLabel(mission.type).toUpperCase()}
                  </p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p className="text-black dark:text-white">
                    {verificationModeLabel(mission.verification_mode)}
                  </p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p className="text-black dark:text-white">
                    {mission.reward_xp} XP
                  </p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p className="text-black dark:text-white">
                    {formatStrToDateTime(
                      mission.starts_at,
                      "dd MMM yyyy HH:mm"
                    )}
                  </p>
                  <p className="text-xs text-bodydark">
                    s/d{" "}
                    {formatStrToDateTime(mission.ends_at, "dd MMM yyyy HH:mm")}
                  </p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p
                    className={`font-bold ${
                      mission.is_published ? "text-meta-3" : "text-bodydark"
                    }`}
                  >
                    {mission.is_published ? "Terbit" : "Draf"}
                  </p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <div className="flex items-center space-x-3.5">
                    <button
                      className="text-success"
                      onClick={() => {
                        dispatch(setAdminMission(mission));
                        setDialogContent();
                        toggleDialog();
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} className="fill-black" />
                    </button>
                    <button
                      className="text-danger"
                      onClick={() => {
                        setConfirmDialog(
                          <ConfirmDialog
                            title={mission.title}
                            onConfirm={() => {
                              toggleConfirmDialog();
                              submitDeleteMission(mission.id);
                            }}
                            onCancel={toggleConfirmDialog}
                          />
                        );
                        toggleConfirmDialog();
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} className="fill-black" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Dialog toggleDialog={toggleConfirmDialog} ref={dialogRef}>
          {dialogContent}
        </Dialog>
      </div>
    </div>
  );
};

interface ConfirmProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmProps> = ({
  title,
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <h3 className="font-bold text-lg text-black dark:text-white">
        Konfirmasi hapus misi
      </h3>
      <p className="py-4 text-black dark:text-white">
        Kamu yakin ingin menghapus misi{" "}
        <span className="font-bold text-lg text-primary">{title}</span>? Riwayat
        klaim anggota tetap tersimpan.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          onClick={onConfirm}
          className="h-10 border-2 border-black bg-danger text-white hover:bg-danger/80"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Hapus
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="h-10 border-2 border-black bg-success text-white hover:bg-success/80"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Batal
        </Button>
      </div>
    </>
  );
};

export default TableMissions;
