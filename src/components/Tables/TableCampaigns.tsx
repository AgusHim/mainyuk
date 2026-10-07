"use client";
import DashboardLoader from "../common/Loader/DashboardLoader";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  deleteCampaign,
  getAdminCampaigns,
  setCampaignStatus,
  setAdminCampaign,
} from "@/redux/slices/campaignAdminSlice";
import { campaignStatusLabel, fundTypeLabel } from "@/types/fundraising";
import { formatRupiah } from "@/utils/currency";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Dialog from "../common/Dialog/Dialog";

type Props = {
  toggleDialog: () => void;
  setDialogContent: () => void;
};

const TableCampaigns: React.FC<Props> = ({
  toggleDialog,
  setDialogContent,
}) => {
  const dispatch = useAppDispatch();
  const campaigns = useAppSelector((state) => state.campaignAdmin.campaigns);
  const isLoading = useAppSelector((state) => state.campaignAdmin.loading);
  const error = useAppSelector((state) => state.campaignAdmin.error);

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

  const submitDelete = (id: string) => {
    dispatch(deleteCampaign(id))
      .unwrap()
      .then(() => dispatch(getAdminCampaigns()))
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Gagal menghapus campaign");
      });
  };

  // Terbitkan dan tutup memakai endpoint status yang sama, sehingga transisi
  // tetap divalidasi state machine di server.
  const changeStatus = (id: string, status: "published" | "closed") => {
    dispatch(setCampaignStatus({ id, status }))
      .unwrap()
      .then(() => toast.success("Status campaign diperbarui"))
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Gagal mengubah status");
      });
  };

  if (campaigns == null && isLoading) {
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
    <div className="rounded-sm border-2 border-black bg-white px-5 pt-6 pb-2.5 shadow-bottom dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="mb-3 w-full table-auto">
          <thead className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Campaign
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Jenis
              </th>
              <th className="min-w-[160px] py-4 px-4 font-medium text-black dark:text-white">
                Terkumpul
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
            {isLoading && campaigns == null ? (
              <tr>
                <td
                  colSpan={5}
                  className="border-b border-black py-6 px-2 text-center text-black dark:text-white"
                >
                  Memuat…
                </td>
              </tr>
            ) : null}
            {!isLoading && campaigns != null && campaigns.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="border-b border-black py-6 px-2 text-center text-black dark:text-white"
                >
                  Belum ada campaign.
                </td>
              </tr>
            ) : null}
            {campaigns?.map((campaign) => (
              <tr key={campaign.id}>
                <td className="border-b border-black py-3 px-2 pl-9 xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {campaign.title}
                  </h5>
                  <p className="text-xs text-bodydark">{campaign.slug}</p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p className="badge badge-outline badge-primary font-bold">
                    {fundTypeLabel(campaign.fund_type).toUpperCase()}
                  </p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p className="text-black dark:text-white">
                    {formatRupiah(campaign.raised_amount)}
                  </p>
                  <p className="text-xs text-bodydark">
                    {campaign.target_amount > 0
                      ? `target ${formatRupiah(campaign.target_amount)}`
                      : "tanpa target"}{" "}
                    · {campaign.donor_count} donatur
                  </p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p
                    className={`font-bold ${
                      campaign.status === "published"
                        ? "text-meta-3"
                        : campaign.status === "closed"
                          ? "text-danger"
                          : "text-bodydark"
                    }`}
                  >
                    {campaignStatusLabel(campaign.status)}
                  </p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <div className="flex items-center space-x-3.5">
                    <Link
                      href={`/dashboard/campaigns/${campaign.id}/report`}
                      className="text-sm font-semibold text-primary underline"
                    >
                      Laporan
                    </Link>
                    {campaign.status === "draft" ? (
                      <button
                        className="text-sm font-semibold text-meta-3"
                        onClick={() => changeStatus(campaign.id, "published")}
                      >
                        Terbitkan
                      </button>
                    ) : null}
                    {campaign.status === "published" ? (
                      <button
                        className="text-sm font-semibold text-danger"
                        onClick={() => changeStatus(campaign.id, "closed")}
                      >
                        Tutup
                      </button>
                    ) : null}
                    <button
                      className="text-success"
                      onClick={() => {
                        dispatch(setAdminCampaign(campaign));
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
                            title={campaign.title}
                            onConfirm={() => {
                              toggleConfirmDialog();
                              submitDelete(campaign.id);
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
      <h3 className="text-lg font-bold text-black dark:text-white">
        Konfirmasi hapus campaign
      </h3>
      <p className="py-4 text-black dark:text-white">
        Kamu yakin ingin menghapus campaign{" "}
        <span className="text-lg font-bold text-primary">{title}</span>?
        Campaign yang sudah punya donasi tidak dapat dihapus — tutup saja.
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

export default TableCampaigns;
