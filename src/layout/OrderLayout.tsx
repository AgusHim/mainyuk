"use client";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { MainLayout } from "@/layout/MainLayout";
import {
  faCartShopping,
  faComment,
  faReceipt,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { formatStrToDateTime } from "@/utils/convert";
import { useEffect } from "react";
import Loader from "@/components/common/Loader/Loader";
import { getOrderByPublicID } from "@/redux/slices/orderSlice";
import OrderPaymentMethodCard from "@/components/Card/OrderPaymentMethodCard";
import Link from "next/link";
import { Order } from "@/types/order";

export default function OrderLayout({
  params,
}: {
  params: { public_id: string };
}) {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.order.order);
  const isLoading = useAppSelector((state) => state.order.loading);
  const error = useAppSelector((state) => state.order.error);

  useEffect(() => {
    if (order == null || order.public_id != params.public_id) {
      dispatch(getOrderByPublicID(params.public_id));
    }
  }, []);

  if (order == null || isLoading) {
    return (
      <MainLayout>
        <CommonHeader title="Detail Transaksi" isShowBack={true} />
        <Loader></Loader>
      </MainLayout>
    );
  }

  const totalPayment = () => {
    const amount = order?.amount ?? 0;
    const donation = order?.donation ?? 0;
    const admin_fee = order?.admin_fee ?? 0;
    return amount + donation + admin_fee;
  };

  const event = order?.event;

  return (
    <>
      <MainLayout>
        <CommonHeader title="Detail Transaksi" isShowBack={true} />
        <div className="max-w-layout xs:w-full h-full w-screen bg-yellow-400 p-4">
          <div className="mb-8 flex flex-col gap-4">
            {order.status == "paid" ? (
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faTicket}
                      fill="black"
                      width={25}
                      height={25}
                      style={{ fontSize: "20px", color: "black" }}
                    />
                    <h1 className="font-semibold text-lg text-black">
                      Tiket Event
                    </h1>
                  </div>
                  <button type="button" className="ml-auto flex items-center">
                    <p className="text-primary text-lg font-bold">
                      Lihat tiket
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="size-5 text-primary"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div>
                  <div className="flex w-full rounded-xl border-2 border-black bg-yellow-300 shadow-custom">
                    <div className="relative w-2/5">
                      <div className="absolute bottom-0 grid w-full">
                        {/* <div className="p-1">
                          <div className="w-full rounded-md bg-black/40 py-1 backdrop-blur-md">
                            <p className="text-center text-xs text-white">
                              Draft
                            </p>
                          </div>
                        </div> */}
                      </div>
                      <div className="block overflow-hidden rounded-xl object-cover">
                        <img
                          src={event?.image_url ?? ""}
                          alt="Poster event"
                          className="lazy max-w-full entered loaded"
                          width={200}
                          height={350}
                        />
                      </div>
                    </div>
                    <div className="flex w-3/5 justify-between p-4">
                      <div className="flex cursor-pointer flex-col text-left">
                        <div className="flex-1">
                          <div className="mb-1 line-clamp-2 w-full cursor-pointer">
                            <h1 className="font-semibold text-md text-black">
                              {event?.title ?? ""}
                            </h1>
                          </div>
                          <div>
                            <p className="text-sm text-black">
                              {event == null
                                ? ""
                                : formatStrToDateTime(
                                  event?.start_at ?? "",
                                  "EEEE, dd MMM yyyy HH:mm"
                                )}
                            </p>
                          </div>
                          <div className="mt-3 flex w-full items-center">
                            <div className="mr-2">
                              <div className="size-6">
                                <img
                                  className="lazy max-w-full entered loaded"
                                  src="/images/logo/yn_logo.png"
                                  width={24}
                                  height={24}
                                />
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="line-clamp-1">
                                <p className="text-md text-black">
                                  YukNgaji Solo
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <OrderPaymentMethodCard />
            )}

            <div className="mt-4">
              <div className="mb-4 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faCartShopping}
                  fill="black"
                  width={25}
                  height={25}
                  style={{ fontSize: "20px", color: "black" }}
                />
                <h1 className="font-semibold text-lg text-black">
                  Rincian Order
                </h1>
              </div>
              <div className="rounded-xl border-2 border-black bg-yellow-300 px-4 py-2 shadow-custom">
                <div className="flex w-full items-center justify-between gap-4 py-2">
                  <p className="text-md text-black">Order ID</p>
                  <h1 className="font-semibold text-md text-black">
                    #{order?.public_id?.toUpperCase()}
                  </h1>
                </div>
                <div className="border-b border-b-black"></div>
                <div className="flex w-full items-center justify-between gap-4 py-2">
                  <p className="text-md text-black">Tanggal Order</p>
                  <h1 className="font-semibold text-md text-black">
                    {formatStrToDateTime(
                      order?.created_at ?? "",
                      "EEEE, dd MMM yyyy HH:mm"
                    )}
                  </h1>
                </div>
                <div className="border-b border-b-black"></div>
                <div className="flex w-full items-center justify-between gap-4 py-2">
                  <p className="text-md text-black">Status</p>
                  <OrderStatus status={order.status ?? "pending"} />
                </div>
                {/* <div className="border-b border-b-black"></div>
                <div className="flex w-full items-center justify-between gap-4 py-2">
                  <p className="text-md text-black">Bukti Pembayaran</p>
                  <button
                    type="button"
                    className="text-white bg-[#080C16]  focus:outline-none transition ease-in-out duration-300 rounded-lg px-2 py-1 text-xs hover:opacity-80 active:opacity-70 font-bold"
                  >
                    <div className="flex items-center justify-center gap-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="size-3 text-neutral-400"
                      >
                        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z"></path>
                      </svg>
                      <span>Download</span>
                    </div>
                  </button>
                </div> */}
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-4 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faReceipt}
                  fill="black"
                  width={25}
                  height={25}
                  style={{ fontSize: "20px", color: "black" }}
                />
                <h1 className="font-semibold text-lg text-black">
                  Rincian Harga
                </h1>
              </div>
              <div className="rounded-xl border-2 border-black bg-yellow-300 px-4 py-2 shadow-custom">
                <div className="flex w-full justify-between gap-4 py-2">
                  <p className="text-md text-black">Tiket</p>
                  <h1 className="font-semibold text-md text-black">
                    {order.user_tickets?.[0]?.ticket?.price === 1
                      ? "Pay As You Wish"
                      : `Rp ${order.amount?.toLocaleString("id-ID")}`}
                  </h1>
                </div>
                <div className="border-b border-b-black"></div>
                {
                  order.admin_fee! > 0 ? (
                    <div className="flex w-full justify-between gap-4 py-2">
                      <p className="text-md text-black">Biaya Jasa Pembayaran</p>
                      <h1 className="font-semibold text-md text-black">
                        Rp {order.admin_fee?.toLocaleString("id-ID")}
                      </h1>
                    </div>
                  ) : (
                    <></>
                  )
                }
                <div className="border-b border-b-black"></div>
                <div className="flex w-full justify-between gap-4 py-2">
                  <p className="text-md text-black">Total Harga</p>
                  <h1 className="font-semibold text-md text-green-600">
                    {order.user_tickets?.[0]?.ticket?.price === 1
                      ? "Pay As You Wish"
                      : `Rp ${totalPayment().toLocaleString("id-ID")}`}
                  </h1>
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-4">
              {order.status == "paid" ? (
                <Link href={`/orders/${params.public_id}/tickets`}>
                  <button
                    type="button"
                    className="text-white bg-primary focus:outline-none transition ease-in-out duration-300 rounded-lg px-8 py-3 w-full hover:opacity-80 active:opacity-70 font-bold shadow-custom"
                  >
                    <div className="flex items-center justify-center gap-x-2">
                      <span>Lihat Tiket</span>
                    </div>
                  </button>
                </Link>
              ) : (
                <Link href={getWhatsAppUrl(order, totalPayment())}>
                  <button
                    type="button"
                    className="text-white bg-primary focus:outline-none transition ease-in-out duration-300 rounded-lg px-8 py-3 w-full hover:opacity-80 active:opacity-70 font-bold shadow-custom"
                  >
                    <div className="flex items-center justify-center gap-x-2">
                      <FontAwesomeIcon
                        icon={faComment}
                        width={25}
                        height={25}
                        style={{ fontSize: "20px", color: "white" }}
                      />
                      <span>Konfirmasi Pembayaran</span>
                    </div>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}

const OrderStatus: React.FC<{ status: string }> = ({ status }) => {
  if (status == "paid") {
    return (
      <button className="h-full whitespace-nowrap rounded-full font-medium px-2 py-0.5 text-sm tag-secondary border-theme-border text-success border border-success">
        Sudah Bayar
      </button>
    );
  }
  if (status == "expired") {
    return (
      <button className="h-full whitespace-nowrap rounded-full font-medium px-2 py-0.5 text-sm tag-secondary border-theme-border text-danger border border-danger">
        Expired
      </button>
    );
  }
  return (
    <button className="h-full whitespace-nowrap rounded-full font-medium px-2 py-0.5 text-sm tag-secondary border-theme-border text-black border border-black">
      Menunggu Pembayaran
    </button>
  );
};

const phoneNumber = "+6282262448523";
const phoneKey = "+6285642555555";

const getWhatsAppUrl = (order: Order, total: number) => {
  const message = `Konfirmasi Pembayaran%0A%0A*${order?.event?.title}*%0A%0AOrder ID:${order?.public_id}%0AMetode Pembayaran:${order.payment_method?.name}%0ATotal Transfer:${total}%0ANama Pemesan:${order.user?.name}%0A`;

  const isMobile = /Android/i.test(navigator.userAgent);
  let phone = phoneNumber;
  if (order.event?.divisi?.name == "KEY") {
    phone = phoneKey;
  }
  if (isMobile) {
    // Use intent for Android
    return `intent://send/?phone=${phone}&text=${message}#Intent;scheme=whatsapp;package=com.whatsapp;end;`;
  } else {
    // Use wa.me for web and desktop
    return `https://wa.me/${phone}?text=${message}`;
  }
};
