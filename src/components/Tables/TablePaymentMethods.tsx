"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  deleteFromPaymentMethods,
  deletePaymentMethod,
  getPaymentMethod,
  setPaymentMethod,
} from "@/redux/slices/PaymentMethodSlice";
import { useEffect, useRef, useState } from "react";
import Dialog from "../common/Dialog/Dialog";
import FormPaymentMethod from "../Form/FormPaymentMethod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PaymentMethod } from "@/types/PaymentMethod";
import { faEdit, faTrash, faWallet } from "@fortawesome/free-solid-svg-icons";

const TablePaymentMethods = () => {
  const dispatch = useAppDispatch();
  const paymentMethods = useAppSelector((state) => state.paymentMethod.data);
  const isLoading = useAppSelector((state) => state.paymentMethod.loading);
  const error = useAppSelector((state) => state.paymentMethod.error);

  useEffect(() => {
    if (paymentMethods == null && !isLoading) {
      dispatch(getPaymentMethod());
    }
  }, []);

  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    if (dialogRef.current.hasAttribute("open")) {
      dialogRef.current.close();
      setDialogContent(null);
    } else {
      dialogRef.current.showModal();
    }
  }

  function submitDeletePaymentMethod(id: string) {
    dispatch(deletePaymentMethod(id))
      .unwrap()
      .then((res: any) => {
        if (res != null) {
          dispatch(deleteFromPaymentMethods(id));
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
    <div className="flex flex-col gap-5">
      <button
        onClick={() => {
          dispatch(setPaymentMethod(null));
          setDialogContent(<FormPaymentMethod toggleDialog={toggleDialog} />);
          toggleDialog();
        }}
        className="w-full ml-auto mb-3 sm:w-50 inline-flex items-center justify-center gap-2.5 rounded-lg bg-meta-3 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-3 border-2 border-black"
        style={{ boxShadow: "5px 5px 0px 0px #000000" }}
      >
        <FontAwesomeIcon icon={faWallet} className="fill-black" />
        Tambah Payment Method
      </button>
      <div className="rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-bottom border-2 border-black dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto mb-3">
            <thead className="border border-black">
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 text-center">
                  Logo
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Nama Pembayaran
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Type
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Kode
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Nama Akun
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Nomor Akun
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentMethods?.map((data, key) => (
                <tr key={key}>
                   <td className="border-b border-black py-5 px-4 pl-9 xl:pl-11">
                    <img src={data.image_url??''} alt="logo payment"/>
                  </td>
                  <td className="border-b border-black py-5 px-4 pl-9 xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {data.name}
                    </h5>
                  </td>
                  <td className="border-b border-black py-5 px-4">
                    <p className="text-black dark:text-white">
                      {data.type.toUpperCase()}
                    </p>
                  </td>
                  <td className="border-b border-black py-5 px-4">
                    <p className="text-black dark:text-white">
                      {data.code.toUpperCase()}
                    </p>
                  </td>
                  <td className="border-b border-black py-5 px-4">
                    <p className="text-black dark:text-white">
                      {data.account_name}
                    </p>
                  </td>
                  <td className="border-b border-black py-5 px-4">
                    <p className="text-black dark:text-white">
                      {data.account_number}
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

                          dispatch(setPaymentMethod(data));
                          setDialogContent(
                            <FormPaymentMethod toggleDialog={toggleDialog} />
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
                              paymentMethod={data}
                              onConfirm={() => {
                                toggleDialog();
                                submitDeletePaymentMethod(data.id!);
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
        {dialogContent}
      </Dialog>
    </div>
  );
};

const ConfirmDialog: React.FC<ConfirmProps> = ({
  paymentMethod,
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
        <span className="font-bold text-lg text-primary">
          {paymentMethod?.name}
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

interface ConfirmProps {
  paymentMethod: PaymentMethod | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default TablePaymentMethods;
