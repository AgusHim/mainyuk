"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormRanger from "../Form/FormRanger";
import { ReactNode, Dispatch, SetStateAction, useState, useRef } from "react";
import Dialog from "../common/Dialog/Dialog";
import { Ranger } from "@/types/ranger";
import { deleteFromListRanger, deleteRanger } from "@/redux/slices/rangerSlice";
import { toast } from "react-toastify";



const TableRanger: React.FC = () => {
  const dispatch = useAppDispatch();
  const rangers = useAppSelector((state) => state.ranger.rangers);

  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    if(dialogRef.current.hasAttribute("open")){
      dialogRef.current.close();
      setDialogContent(null);
    }else{
      dialogRef.current.showModal();
    }
  }

  function submitDeleteRanger(id: string) {
    dispatch(deleteRanger(id))
      .unwrap()
      .then((res: any) => {
        console.log(res);
        if (res != null) {
          dispatch(deleteFromListRanger(id));
        }
      })
      .catch((error) => {
        toast.error(`Gagal hapus ranger`, {
          className: "toast",
        });
      });
  }

  return (
    <div className="rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-bottom border-2 border-black dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto mb-3">
          <thead className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-3 px-2 font-medium text-black dark:text-white xl:pl-11 text-center">
                Nama
              </th>
              <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                Tim
              </th>
              <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                No WhatsApp
              </th>
              <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                Alamat
              </th>
              <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                Aktifitas
              </th>
              <th className="py-3 px-2 font-medium text-black dark:text-white text-center">
                Total Hadir
              </th>
              <th className="py-3 px-2 font-medium text-black dark:text-white text-center">
                Tidak Hadir
              </th>
              <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                Completeness
              </th>
              <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rangers?.map((ranger, key) => {
              const present = (ranger.present! >= 2 ? 2 : ranger.present) ?? 0;
              return (
                <tr key={key}>
                  <td className="border-b border-black py-3 px-2 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {ranger.user?.name}
                    </h5>
                  </td>
                  <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-black dark:text-white text-center">
                        {ranger.divisi?.name}
                      </p>
                    </div>
                  </td>
                  <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                    <div className="flex justify-center items-center">
                      <p className="text-black dark:text-white">
                        {ranger.user?.phone}
                      </p>
                    </div>
                  </td>
                  <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                    <div className="flex justify-center items-center">
                      <p className="text-black dark:text-white">
                        {ranger.user?.address}
                      </p>
                    </div>
                  </td>
                  <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                    <div className="flex justify-center items-center">
                      <p className="text-black dark:text-white">
                        {ranger.user?.activity}
                      </p>
                    </div>
                  </td>
                  <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                    <div className="flex justify-center items-center">
                      <p className="badge badge-outline badge-success font-extrabold text-black dark:text-white">
                        {ranger?.present}
                      </p>
                    </div>
                  </td>
                  <td className="text-center border-b border-black py-3 px-2 dark:border-strokedark">
                    <div className="flex justify-center items-center">
                      <p className="badge badge-outline badge-error font-extrabold text-black dark:text-white">
                        {ranger?.absent}
                      </p>
                    </div>
                  </td>
                  <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                    <div className="flex justify-center items-center">
                      <p className="text-primary font-bold text-xl">
                        {((present / 2) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </td>
                  <td
                    className="disable border-b border-black py-3 px-2"
                    data-no-click={true}
                  >
                    <div className="flex items-center space-x-3.5 justify-center">
                      <button
                        className="text-success"
                        onClick={(e) => {
                          e.stopPropagation();

                          setDialogContent(
                            <FormRanger
                              ranger={ranger}
                              toggleDialog={toggleDialog}
                            />
                          );
                          toggleDialog();
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="fill-black" />
                      </button>
                      <button
                        className="text-danger"
                        onClick={(e) => {
                          e.stopPropagation();

                          setDialogContent(
                            <ConfirmDialog
                              ranger={ranger}
                              onConfirm={() => {
                                toggleDialog();
                                submitDeleteRanger(ranger.id!);
                              }}
                              onCancel={toggleDialog}
                            />
                          );

                          toggleDialog();
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="fill-black"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
        {dialogContent}
      </Dialog>
    </div>
  );
};

interface ConfirmProps {
  ranger: Ranger | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmProps> = ({
  ranger,
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <h3 className="font-bold text-lg text-black dark:text-white">
        Konfirmasi Hapus Ranger
      </h3>
      <p className="py-4 text-black dark:text-white">
        Kamu yakin ingin menghapus ranger{" "}
        <span className="font-bold text-lg text-primary">
          {ranger?.user?.name}
        </span>
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

export default TableRanger;
