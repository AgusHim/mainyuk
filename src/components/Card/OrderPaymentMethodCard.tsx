"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import QRCode from "qrcode.react";

const OrderPaymentMethodCard = () => {
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.order.order);

  const totalPayment = () => {
    const amount = order?.amount ?? 0;
    const donation = order?.donation ?? 0;
    const admin_fee = order?.admin_fee ?? 0;
    return amount + donation + admin_fee;
  };

  const handleCopy = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        toast.info("Berhasil copy");
      })
      .catch((err) => {
        toast.error("Gagal copy");
      });
  };

  const isQris = order?.payment_method?.type?.toLowerCase() === "qris";

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faMoneyBill}
            fill="black"
            width={25}
            height={25}
            style={{ fontSize: "20px", color: "black" }}
          />
          <h1 className="font-semibold text-lg text-black">
            Lakukan Transfer Ke Rekening Berikut
          </h1>
        </div>
      </div>
      <div>
        <div className="flex flex-col p-4 rounded-xl border-2 border-black bg-yellow-300 shadow-custom">
          <div className="flex w-full justify-between">
            <img
              src={order?.payment_method?.image_url ?? ""}
              alt="payment method logo"
              width={120}
              height={40}
              className="object-scale-down"
            ></img>
            <div className="flex flex-col w-3/5 ">
              <p className="text-black text-lg font-bold">
                {order?.payment_method?.name ?? ""}
              </p>
              <p className="text-black text-lg">
                {order?.payment_method?.account_name ?? ""}
              </p>
            </div>
          </div>
          {isQris ? (
            <div className="my-3 flex justify-center p-3 bg-white rounded-lg">
              <QRCode
                value={order?.payment_method?.account_number ?? ""}
                size={200}
              />
            </div>
          ) : (
            <div className="my-3 flex justify-between p-3 bg-yellow-200 rounded-lg">
              <p className="text-black text-xl font-bold">
                {order?.payment_method?.account_number}
              </p>
              <button
                onClick={() =>
                  handleCopy(order?.payment_method?.account_number ?? "")
                }
                className="bg-transparent hover:bg-primary text-sm text-primary font-semibold hover:text-white py-1 px-2 border border-primary hover:border-transparent rounded"
              >
                Salin
              </button>
            </div>
          )}

          <div>
            <p className="text-black text-md">Total Nominal Transfer</p>
            <div className="my-2 flex justify-between p-3 bg-yellow-200 rounded-lg">
              <p className="text-black text-xl font-bold">
                {totalPayment() === 1 ? (
                  "Pay As You Wish"
                ) : (
                  <HighlightDecimal value={totalPayment()} />
                )}
              </p>
              {totalPayment() !== 1 && (
                <button
                  onClick={() => handleCopy(`${totalPayment()}`)}
                  className="bg-transparent hover:bg-primary text-sm text-primary font-semibold hover:text-white py-1 px-2 border border-primary hover:border-transparent rounded"
                >
                  Salin
                </button>
              )}
            </div>
          </div>
          {totalPayment() !== 1 && (
            <div className="my-2 p-3 bg-primary bg-opacity-40 text-black text-sm">
              Pastikan total nominal transfer{" "}
              <span className="font-bold">
                TEPAT BERJUMLAH ANGKA DIATAS (hingga 3 angka terakhir).
              </span>
            </div>
          )}
          <div className="mt-4 border-t border-black pt-4">
            <p className="text-black text-sm mb-2 font-medium">
              Sudah melakukan pembayaran? Silahkan konfirmasi dan kirim bukti
              transfer ke Admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HighlightDecimalProps {
  value: number;
}
const HighlightDecimal: React.FC<HighlightDecimalProps> = ({ value }) => {
  const formattedValue = value.toLocaleString("id-ID");

  const [integerPart, decimalPart] = formattedValue.split(".");

  return (
    <span>
      Rp
      {integerPart}
      {decimalPart && (
        <>
          .<span className="bg-pink-500 bg-opacity-70 px-1">{decimalPart}</span>
        </>
      )}
    </span>
  );
};

export default OrderPaymentMethodCard;
