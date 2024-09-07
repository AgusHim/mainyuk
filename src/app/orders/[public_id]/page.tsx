import { BottomNavBar } from "@/components/BottomNavBar/BottomNavBar";
import GridOrders from "@/components/Grid/GridOrders";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { MainLayout } from "@/layout/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Transaksi| YukNgaji Solo",
  description: "Detail transaksi tiket event YukNgaji Solo",
};

export default function OrderDetail({ params }: { params: { slug: string } }) {
  return (
    <>
      <MainLayout>
        <CommonHeader title="Detail Transaksi" isShowBack={true} />
        <div className="max-w-layout xs:w-full h-full w-screen bg-yellow-400 p-4">
          <div className="mb-8 flex flex-col gap-4">
            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="size-5"
                  >
                    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z"></path>
                  </svg>
                  <h1 className="font-sans font-semibold text-sm text-black">
                    Tiket Event
                  </h1>
                </div>
                <button type="button" className="ml-auto flex items-center">
                  <p className="text-green-600 font-sans text-sm text-black">
                    Lihat tiket
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="size-5 text-green-600"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
              <div>
                <div className="flex w-full rounded-xl border-2 border-black bg-yellow-300 shadow-custom">
                  <div className="relative w-2/5">
                    <div className="absolute bottom-0 grid w-full">
                      <div className="p-1">
                        <div className="w-full rounded-md bg-black/40 py-1 backdrop-blur-md">
                          <p className="text-center font-sans text-xs text-white">
                            Draft
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="block overflow-hidden rounded-xl"></div>
                  </div>
                  <div className="flex w-3/5 justify-between p-4">
                    <div className="flex cursor-pointer flex-col text-left">
                      <div className="flex-1">
                        <div className="mb-1 line-clamp-2 w-full cursor-pointer">
                          <h1 className="font-sans font-semibold text-sm text-black">
                            (MALANG) Bagaimana Anak-Anak Gaza Tumbuh Menjadi
                            Pejuang
                          </h1>
                        </div>
                        <div>
                          <p className="font-sans text-xs text-slate-500">
                            Jumat, 06 Sep 2024
                          </p>
                        </div>
                        <div className="mt-3 flex w-full items-center">
                          <div className="mr-2">
                            <div className="size-6 overflow-hidden rounded-full object-cover"></div>
                          </div>
                          <div className="flex items-center">
                            <div className="line-clamp-1">
                              <p className="font-sans text-xs text-black">
                                Real Masjid
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
            <div>
              <div className="mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-5"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                </svg>
                <h1 className="font-sans font-semibold text-sm text-black">
                  Rincian Order
                </h1>
              </div>
              <div className="rounded-xl border-2 border-black bg-yellow-300 px-4 py-2 shadow-custom">
                <div className="flex w-full items-center justify-between gap-4 py-2">
                  <p className="font-sans text-xs text-black">Order ID</p>
                  <h1 className="font-sans font-semibold text-sm text-black">
                    #DTO0WNE79NJ
                  </h1>
                </div>
                <div className="border-b border-b-black"></div>
                <div className="flex w-full items-center justify-between gap-4 py-2">
                  <p className="font-sans text-xs text-black">Tanggal Order</p>
                  <h1 className="font-sans font-semibold text-sm text-black">
                    28 Agt 2024 19:59
                  </h1>
                </div>
                <div className="border-b border-b-black"></div>
                <div className="flex w-full items-center justify-between gap-4 py-2">
                  <p className="font-sans text-xs text-black">Status</p>
                  <button className="h-full whitespace-nowrap rounded-full font-medium px-2 py-0.5 text-xs tag-secondary border-theme-border text-theme-text border">
                    Sudah Bayar
                  </button>
                </div>
                <div className="border-b border-b-black"></div>
                <div className="flex w-full items-center justify-between gap-4 py-2">
                  <p className="font-sans text-xs text-black">
                    Bukti Pembayaran
                  </p>
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
                </div>
              </div>
            </div>
            <div>
              <div className="mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <h1 className="font-sans font-semibold text-sm text-black">
                  Rincian Harga
                </h1>
              </div>
              <div className="rounded-xl border-2 border-black bg-yellow-300 px-4 py-2 shadow-custom">
                <div className="flex w-full justify-between gap-4 py-2">
                  <p className="font-sans text-xs text-black">Tiket</p>
                  <h1 className="font-sans font-semibold text-sm text-black">
                    Rp 0
                  </h1>
                </div>
                <div className="border-b border-b-black"></div>
                <div className="flex w-full justify-between gap-4 py-2">
                  <p className="font-sans text-xs text-black">Donasi</p>
                  <h1 className="font-sans font-semibold text-sm text-black">
                    Rp 0
                  </h1>
                </div>
                <div className="border-b border-b-black"></div>
                <div className="flex w-full justify-between gap-4 py-2">
                  <p className="font-sans text-xs text-black">
                    Biaya Jasa Pembayaran
                  </p>
                  <h1 className="font-sans font-semibold text-sm text-black">
                    Rp 0
                  </h1>
                </div>
                <div className="border-b border-b-black"></div>
                <div className="flex w-full justify-between gap-4 py-2">
                  <p className="font-sans text-xs text-black">Total Harga</p>
                  <h1 className="font-sans font-semibold text-sm text-green-600">
                    Rp 0
                  </h1>
                </div>
              </div>
            </div>
            <div className="mb-4 grid gap-4">
              <a href="/events/cm0cly3q10012jr03copoul08/dashboard">
                <button
                  type="button"
                  className="text-white bg-[#080C16]  focus:outline-none transition ease-in-out duration-300 rounded-lg px-8 py-3 w-full hover:opacity-80 active:opacity-70 font-bold"
                >
                  <div className="flex items-center justify-center gap-x-2">
                    <span>Lihat Tiket</span>
                  </div>
                </button>
              </a>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
