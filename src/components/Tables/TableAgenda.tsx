"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  deleteAgenda,
  deleteFromListAgenda,
  getAgenda,
  setAgenda,
} from "@/redux/slices/agendaSlice";
import { Agenda } from "@/types/agenda";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import Dialog from "../Common/Dialog/Dialog";
import { formatStrToDateTime } from "@/utils/convert";

type Props = {
  toggleDialog: () => void;
  setDialogContent: () => void;
};

const TableAgenda: React.FC<Props> = ({ toggleDialog, setDialogContent }) => {
  const dispatch = useAppDispatch();
  const listAgenda = useAppSelector((state) => state.agenda.data);
  const isLoading = useAppSelector((state) => state.agenda.loading);
  const error = useAppSelector((state) => state.agenda.error);

  // useEffect(() => {
  //   if (listAgenda == null && !isLoading) {
  //     dispatch(getAgenda({}));
  //   }
  // }, []);

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

  function submitDeleteAgenda(id: string) {
    dispatch(deleteAgenda(id))
      .unwrap()
      .then((res: any) => {
        if (res != null) {
          dispatch(deleteFromListAgenda(id));
        }
      })
      .catch((error) => {
        // Handle errors here if needed
        console.error("Error delete data:", error);
      });
  }

  if (listAgenda == null && isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error != null) {
    return <h1>{error}</h1>;
  }

  const router = useRouter();

  const clickDetailAgenda = (agenda: Agenda) => {
    router.push(`/dashboard/agenda/${agenda.id}`);
  };

  return (
    <div className="rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-bottom border-2 border-black dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto mb-3">
          <thead className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Nama Agenda
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Tipe
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Tim
              </th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                Lokasi
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Pelaksanaan
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {listAgenda?.map((data, key) => (
              <tr
                key={key}
                onClick={() => clickDetailAgenda(data)}
                className="hover:bg-primary hover:bg-opacity-40"
              >
                <td className="border-b border-black py-3 px-2 pl-9 xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {data.name}
                  </h5>
                </td>
                <td className="min-w-[120px] border-b border-black py-3 px-2">
                  <p
                    className={`badge badge-outline text-primary font-bold ${
                      data.type == "meeting"
                        ? "badge-primary"
                        : data.type == "event"
                        ? "badge-error"
                        : "badge-secondary"
                    }`}
                  >
                    {data.type.toUpperCase()}
                  </p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p className="text-black dark:text-white">{data.divisi?.name}</p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p className="text-black dark:text-white">{data.location}</p>
                </td>
                <td className="border-b border-black py-3 px-2">
                  <p className="text-black dark:text-white">
                    {formatStrToDateTime(data.start_at!, "dd MMMM yyyy HH:mm")}
                  </p>
                </td>
                <td
                  className="disable border-b border-black py-3 px-2"
                  data-no-click={true}
                >
                  <div className="flex items-center space-x-3.5">
                    <button
                      className="text-success"
                      onClick={(e) => {
                        e.stopPropagation();

                        dispatch(setAgenda(data));
                        setDialogContent();
                        toggleDialog();
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} className="fill-black" />
                    </button>
                    <button
                      className="text-danger"
                      onClick={(e) => {
                        e.stopPropagation();

                        setConfirmDialog(
                          <ConfirmDialog
                            agenda={data}
                            onConfirm={() => {
                              toggleConfirmDialog();
                              submitDeleteAgenda(data.id!);
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

const ConfirmDialog: React.FC<ConfirmProps> = ({
  agenda,
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <h3 className="font-bold text-lg text-black dark:text-white">
        Konfirmasi hapus agenda
      </h3>
      <p className="py-4 text-black dark:text-white">
        Kamu yakin ingin menghapus agenda{" "}
        <span className="font-bold text-lg text-primary">{agenda?.name}</span>
      </p>
      <div className="modal-action">
        <label
          htmlFor="confirmation-modal"
          onClick={onConfirm}
          className="btn bg-danger hover:bg-danger hover:bg-opacity-70 text-white"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Hapus
        </label>
        <label
          htmlFor="confirmation-modal"
          onClick={onCancel}
          className="btn bg-success hover:bg-success hover:bg-opacity-70 text-white"
          style={{ boxShadow: "5px 5px 0px #000000" }}
        >
          Batal
        </label>
      </div>
    </>
  );
};

interface ConfirmProps {
  agenda: Agenda | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default TableAgenda;
