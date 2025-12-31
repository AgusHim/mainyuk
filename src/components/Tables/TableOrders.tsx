"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getAdminOrders, putOrderVerify } from "@/redux/slices/orderSlice";
import { Order, VerifyOrder } from "@/types/order";
import { formatStrToDateTime } from "@/utils/convert";
import { useEffect, useRef, useState } from "react";
import Dialog from "../common/Dialog/Dialog";
import DropdownEvents from "../Dropdowns/DropdownEvents";
import DropdownStatus from "../Dropdowns/DropdownStatus";

const TableOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.order.orders);
  const isLoading = useAppSelector((state) => state.order.loading);
  const error = useAppSelector((state) => state.divisi.error);
  const [status, setStatus] = useState<string | null>(null);
  const [event_id, setEventID] = useState<string | null>(null);

  useEffect(() => {
    if (orders == null) {
      dispatch(getAdminOrders({ status: status ?? "", event_id: event_id }));
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

  function handleVerify(order: Order, status: string) {
    var bodyData = {
      order_id: order.id,
      status: status,
    } as VerifyOrder;
    dispatch(putOrderVerify(bodyData))
      .unwrap()
      .then((res: any) => {
        if (res != null) {
          dispatch(getAdminOrders({ status: "", event_id: event_id }));
        }
        toggleDialog();
      })
      .catch((error) => {
        // Handle errors here if needed
        console.error("Error delete data:", error);
      });
  }

  const handleFilterStatus = (newValue: string) => {
    if (newValue == "all") {
      setStatus(null);
    } else {
      setStatus(newValue);
    }
    dispatch(getAdminOrders({ status: newValue, event_id: event_id })); // This is where you can call additional logic
  };

  const handleFilterEvent = (newValue: string) => {
    if (newValue == "all") {
      setEventID(null);
    } else {
      setEventID(newValue);
    }
    dispatch(getAdminOrders({ status: status, event_id: newValue })); // This is where you can call additional logic
  };

  function handleClickTableRow(order: Order) {
    setDialogContent(
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-black dark:text-white text-2xl m-4">
          Validasi Pesanan
        </h1>
        <div className="my-2 w-full flex justify-between">
          <p className="text-black dark:text-white text-lg">No Invoice</p>
          <p className="font-bold text-black dark:text-white text-lg">
            {order.public_id}
          </p>
        </div>
        <div className="my-2 w-full flex justify-between">
          <p className="text-black dark:text-white text-lg">Status</p>
          <p
            className={`font-bold text-black dark:text-white text-md p-2 rounded-md ${bgStatus(
              order.status ?? ""
            )}`}
          >
            {order.status?.toLocaleUpperCase()}
          </p>
        </div>
        <div className="my-2 w-full flex justify-between">
          <p className="text-black dark:text-white text-lg">Nama Pemesan</p>
          <p className="font-bold text-black dark:text-white text-lg">
            {order.user?.name ?? ""}
          </p>
        </div>
        <div className="my-2 w-full flex justify-between">
          <p className="text-black dark:text-white text-lg">Jumlah Tiket</p>
          <p className="font-bold text-black dark:text-white text-lg">
            {order.user_tickets?.length} tiket
          </p>
        </div>
        <div className="my-2 w-full flex justify-between">
          <p className="text-black dark:text-white text-lg">Total Tiket</p>
          <p className="font-bold text-black dark:text-white text-lg">
            {order.amount == 0
              ? "GRATIS"
              : order.amount == 1
                ? "Pay As You Wish"
                : `Rp ${order?.amount?.toLocaleString("id-ID")}`}
          </p>
        </div>
        <div className="my-2 w-full flex justify-between">
          <p className="text-black dark:text-white text-lg">Donasi</p>
          <p className="font-bold text-black dark:text-white text-lg">
            Rp {order?.donation?.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="my-2 w-full flex justify-between">
          <p className="text-black dark:text-white text-lg">Payment Gateway</p>
          <p className="font-bold text-black dark:text-white text-lg">
            Rp {order?.admin_fee?.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="my-2 w-full flex justify-between">
          <p className="font-bold text-black dark:text-white text-xl">
            TOTAL BAYAR
          </p>
          <p className="font-bold text-primary text-xl">
            {total(order) == 0
              ? "GRATIS"
              : total(order) == 1
                ? "Pay As You Wish"
                : `Rp ${total(order).toLocaleString("id-ID")}`}
          </p>
        </div>
        <div>
          <p className="my-4 text-black dark:text-white text-md text-center">
            Pilih salah satu dibawah ini untuk update status pembayaran
          </p>
          <div className="w-full flex justify-evenly">
            <button
              onClick={() => handleVerify(order, "paid")}
              className="btn min-w-30 text-white text-lg hover:bg-primary bg-success shadow-custom2 hover:shadow-none transition-all hover:translate-x-1 hover:translate-y-1"
            >
              PAID
            </button>
            <button
              onClick={() => handleVerify(order, "pending")}
              className="btn min-w-30 text-white text-lg hover:bg-primary bg-yellow-400 shadow-custom2 hover:shadow-none transition-all hover:translate-x-1 hover:translate-y-1"
            >
              PENDING
            </button>
            <button
              onClick={() => handleVerify(order, "expired")}
              className="btn min-w-30 text-white text-lg hover:bg-primary bg-danger shadow-custom2 hover:shadow-none transition-all hover:translate-x-1 hover:translate-y-1"
            >
              EXPIRED
            </button>
          </div>
        </div>
      </div>
    );
    toggleDialog();
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (error != null) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <div className="flex flex-row items-center justify-start gap-3 mb-5">
        <DropdownEvents onChange={handleFilterEvent} />
        <DropdownStatus onChange={handleFilterStatus} />
      </div>
      <div className="rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-bottom border-2 border-black dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto mb-3">
            <thead className="border border-black">
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11 text-center">
                  ID Pemesan
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11 text-center">
                  Status
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Total Bayar
                </th>
                <th className="min-w-[140px] py-4 px-4 font-medium text-black dark:text-white">
                  Metode Bayar
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11 text-center">
                  Nama Pemesan
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Total Tiket
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Donation
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Fee Gateway
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white text-center">
                  Kadaluarsa
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white text-center">
                  Dibuat
                </th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((data, key) => (
                <tr onClick={() => handleClickTableRow(data)} key={key}>
                  <td className="border-b border-black py-5 px-4 pl-9 xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {data.public_id}
                    </h5>
                  </td>
                  <td className="border-b border-black py-5 px-4">
                    <p
                      className={`text-sm font-bold text-black dark:text-white m-auto p-2 rounded-md text-center ${bgStatus(
                        data.status ?? ""
                      )}`}
                    >
                      {data.status?.toUpperCase()}
                    </p>
                  </td>
                  <td className="border-b border-black py-3 px-2">
                    <p className="text-black dark:text-white">
                      {total(data) == 0
                        ? "GRATIS"
                        : total(data) == 1
                          ? "Pay As You Wish"
                          : `Rp ${total(data).toLocaleString("id-ID")}`}
                    </p>
                  </td>
                  <td className="border-b border-black py-3 px-2">
                    {data.payment_method != null ? (
                      <img
                        src={data.payment_method?.image_url ?? ""}
                        alt="logo payment"
                      />
                    ) : (
                      <div className="text-sm text-black dark:text-white text-center">
                        -
                      </div>
                    )}
                  </td>
                  <td className="border-b border-black py-5 px-4 pl-9 xl:pl-11">
                    <h5 className="font-bold text-black dark:text-white">
                      {data.user?.name ?? ""}
                    </h5>
                    <p className="text-sm text-black dark:text-white">
                      {data.user?.phone ?? ""}
                    </p>
                  </td>

                  <td className="border-b border-black py-5 px-4">
                    <p className="text-black dark:text-white">
                      {data.amount == 0
                        ? "GRATIS"
                        : data.amount == 1
                          ? "Pay As You Wish"
                          : `Rp ${data?.amount?.toLocaleString("id-ID")}`}
                    </p>
                  </td>
                  <td className="border-b border-black py-5 px-4">
                    <p className="text-black dark:text-white">
                      Rp {data?.donation?.toLocaleString("id-ID")}
                    </p>
                  </td>
                  <td className="border-b border-black py-5 px-4">
                    <p className="text-black dark:text-white">
                      Rp {data?.admin_fee?.toLocaleString("id-ID")}
                    </p>
                  </td>
                  <td className="border-b border-black py-3 px-2">
                    <p className="text-black dark:text-white">
                      {data.expired_at == null
                        ? ""
                        : formatStrToDateTime(
                          data.expired_at!,
                          "dd-MM-yyyy HH:mm"
                        )}
                    </p>
                  </td>
                  <td className="border-b border-black py-3 px-2">
                    <p className="text-black dark:text-white">
                      {formatStrToDateTime(
                        data.created_at!,
                        "dd-MM-yyyy HH:mm"
                      )}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
          {dialogContent}
        </Dialog>
      </div>
    </div>
  );
};

function total(o: Order): number {
  return (o.amount ?? 0) + (o.admin_fee ?? 0) + (o.donation ?? 0);
}

function bgStatus(status: string): string {
  if (status == "paid") {
    return "bg-success";
  }
  if (status == "pending") {
    return "bg-yellow-400";
  } else {
    return "bg-danger";
  }
}

export default TableOrders;
