"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { deleteFromTickets, deleteTicket, getTicketsByEventID, setTicket } from "@/redux/slices/ticketSlice";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import Dialog from "../common/Dialog/Dialog";
import { Ticket } from "@/types/ticket";
import { formatStrToDateTime } from "@/utils/convert";

type Props = {
  toggleDialog: () => void;
  setDialogContent: () => void;
};

const TableTickets: React.FC<Props> = ({ toggleDialog, setDialogContent }) => {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector((state) => state.ticket.tickets);
  const event = useAppSelector((state) => state.event.event);
  const isLoading = useAppSelector((state) => state.ticket.loading);
  const error = useAppSelector((state) => state.ticket.error);

  useEffect(() => {
    if (tickets == null && !isLoading) {
      dispatch(getTicketsByEventID(event?.id ?? ""));
    }
  }, []);

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

  function submitDeleteTicket(id: string) {
    dispatch(deleteTicket(id))
      .unwrap()
      .then((res: any) => {
        if (res != null) {
          dispatch(deleteFromTickets(id));
        }
      })
      .catch((error) => {
        // Handle errors here if needed
        console.error("Error delete data:", error);
      });
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (error != null) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-bottom border-2 border-black dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto mb-3">
          <thead className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Nama Tiket
              </th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Description
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                Visibility
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                Gender
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white text-center">
                Harga
              </th>
              <th className="min-w-[10px] py-4 px-4 font-medium text-black dark:text-white text-center">
                Min Pax
              </th>
              <th className="min-w-[10px] py-4 px-4 font-medium text-black dark:text-white text-center">
                Max Pax
              </th>
              <th className="min-w-[10px] py-4 px-4 font-medium text-black dark:text-white text-center">
                Pax Multipier
              </th>
              <th className="min-w-[300px] py-4 px-4 font-medium text-black dark:text-white text-center">
                Pelaksanaan
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets?.map((data, key) => (
              <tr key={key}>
                <td className="border-b border-black py-5 px-4 pl-9 xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {data.name}
                  </h5>
                </td>
                <td className="border-b border-black py-5 px-4">
                  <p className="text-black dark:text-white">
                    {data.description}
                  </p>
                </td>
                <td className="border-b border-black py-5 px-4">
                  <p className="text-black dark:text-white">
                    {data.visibility.toLocaleUpperCase()}
                  </p>
                </td>
                <td className="border-b border-black py-5 px-4">
                  <p className="text-black dark:text-white">
                    {data.gender_allowed.toLocaleUpperCase()}
                  </p>
                </td>
                <td className="border-b border-black py-5 px-4">
                  <p className="text-black dark:text-white">
                    {data.price == 0?'GRATIS':`Rp ${data.price.toLocaleString("id-ID")}`}
                  </p>
                </td>
                <td className="border-b border-black py-5 px-4">
                  <p className="text-black dark:text-white">
                    {data.min_order_pax}
                  </p>
                </td>
                <td className="border-b border-black py-5 px-4">
                  <p className="text-black dark:text-white">
                    {data.max_order_pax}
                  </p>
                </td>
                <td className="border-b border-black py-5 px-4">
                  <p className="text-black dark:text-white">
                    {data.pax_multiplier}
                  </p>
                </td>
                <td className="border-b border-black py-5 px-4">
                  <p className="text-black dark:text-white">
                    {`${formatStrToDateTime(
                      data.start_at!,
                      "dd MMM yy HH:mm"
                    )} - ${formatStrToDateTime(
                      data.end_at!,
                      "dd MMM yy HH:mm"
                    )}`}
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

                        dispatch(setTicket(data));
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
                            ticket={data}
                            onConfirm={() => {
                              toggleConfirmDialog();
                              submitDeleteTicket(data.id!);
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
  ticket,
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <h3 className="font-bold text-lg text-black dark:text-white">
        Konfirmasi hapus tiket
      </h3>
      <p className="py-4 text-black dark:text-white">
        Kamu yakin ingin menghapus tiket{" "}
        <span className="font-bold text-lg text-primary">{ticket?.name}</span>
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
  ticket: Ticket | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default TableTickets;
