import { BottomNavBar } from "@/components/BottomNavBar/BottomNavBar";
import GridOrders from "@/components/Grid/GridOrders";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pembelian Tiket | YukNgaji Solo",
  description: "Pembelian tiket event YukNgaji Solo",
  // other metadata
};

export default function OrderDetail({ params }: { params: { slug: string } }) {
  return (
    <>
      <CommonHeader title="Pembelian Tiket" isShowBack={true} />
      <div className="grid gap-4 bg-yellow-400 py-4">
        <div className="grid gap-2 px-8">
          <h1 className="font-sans font-semibold text-lg text-black">
            Informasi Event
          </h1>
          <div className="grid gap-2 rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
            <div className="flex w-full gap-4 px-0 -mb-0">
              <div className="relative w-2/5">
                <div className="block overflow-hidden rounded-xl border-2 border-black">
                    <img className="lazy max-w-full entered loaded w-30" src="https://res.cloudinary.com/dwkrjw1vd/image/upload/q_auto:best,f_auto,w_400,h_500,c_fill,ar_400:500/darisini/vqosujnfd1iylrfgrece"/>
                </div>
              </div>
              <div className="flex w-3/5 justify-between">
                <div className="flex flex-col pb-3 text-left">
                  <div className="flex justify-between">
                    <div className="mb-3 line-clamp-2 w-full cursor-pointer text-base font-semibold text-neutral-700">
                      MTKJ - Sholeh Bareng itu Hebat
                    </div>
                  </div>
                  <div className="cursor-pointer">
                    <div className="mb-2 text-sm font-normal text-black">
                      Kamis, 05 Sep 2024
                    </div>
                    <div className="flex w-full items-center">
                      <div className="mr-2">
                        <div className="size-6 overflow-hidden rounded-full object-cover"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <p className="line-clamp-1 text-sm font-normal text-black">
                            MT Khoirotunnisa &amp; Taklim Remaja &amp; Taklim
                            Anakku
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-8">
          <div>
            <h1 className="font-sans font-semibold text-lg text-black mb-2">
              Data Pemesan
            </h1>
          </div>
          <div>
            <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
              <h1 className="font-sans font-semibold text-lg text-black">
                Agus Himawan
              </h1>
              <p className="font-sans text-lg text-black">
                himawan.ags@gmail.com
              </p>
            </div>
          </div>
        </div>
        <div className="px-8">
          <form className="grid gap-4">
            <div className="grid space-y-2">
              <div className="gap-y-1 font-normal"></div>
              <div className="mb-2">
                <h1 className="font-sans font-semibold text-lg text-black">
                  Detail Pemilik Tiket
                </h1>
                <p className="font-sans text-md text-black">
                  Data diri untuk setiap pemilik tiket
                </p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-4 rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                  <div className="flex items-center gap-2 text-black">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="size-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <h1 className="font-sans font-semibold text-lg text-black">
                      Pemesan 1 (Reguler)
                    </h1>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked="false"
                        data-state="unchecked"
                        value="on"
                        className="hover:bg-violet3 flex size-[25px] appearance-none items-center justify-center rounded-[4px] border border-black bg-yellow-200 outline-none"
                        id="cm0jmr5lz00003n7cj30ygm9t_AS_ORDER"
                      ></button>
                      <input
                        className="absolute bg-yellow-200"
                        type="checkbox"
                        aria-hidden="true"
                        tabIndex={-1}
                        value="on"
                        style={{
                          transform: "translateX(-100%)",
                          pointerEvents: "none",
                          opacity: 0,
                          margin: "0px",
                          width: "25px",
                          height: "25px",
                        }}
                      />
                      <label
                        className="pl-[15px] text-md leading-none text-black"
                        htmlFor="cm0jmr5lz00003n7cj30ygm9t_AS_ORDER"
                      >
                        Sama dengan pemesan
                      </label>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-sans text-lg text-black">
                      Nama Lengkap
                    </p>
                    <div className="flex flex-col">
                      <input
                        id="cm0jmr5lz00003n7cj30ygm9t_fullName"
                        placeholder="Nama Lengkap"
                        type="text"
                        className="py-3 px-4 w-full rounded-lg	border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg font-normal placeholder-black flex items-center border-black bg-yellow-200"
                        name="cm0jmr5lz00003n7cj30ygm9t_fullName"
                        value=""
                      />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-sans text-lg text-black">Email</p>
                    <div className="flex flex-col">
                      <input
                        id="cm0jmr5lz00003n7cj30ygm9t_fullName"
                        placeholder="Nama Lengkap"
                        type="text"
                        className="py-3 px-4 w-full rounded-lg	border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg font-normal placeholder-black flex items-center border-black bg-yellow-200"
                        name="cm0jmr5lz00003n7cj30ygm9t_fullName"
                        value=""
                      />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-sans text-lg text-black">
                      Jenis Kelamin
                    </p>
                    <div className="flex flex-col">
                      <input
                        id="cm0jmr5lz00003n7cj30ygm9t_fullName"
                        placeholder="Jenis Kelamin"
                        type="text"
                        className="py-3 px-4 w-full rounded-lg	border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg font-normal placeholder-black flex items-center border-black bg-yellow-200"
                        name="cm0jmr5lz00003n7cj30ygm9t_fullName"
                        value=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid space-y-2">
              <div className="gap-y-1 font-normal"></div>
              <div>
                <h1 className="font-sans font-semibold text-lg text-black mb-2">
                  Rincian Pembayaran
                </h1>
                <div className="mb-4 rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                  <div className="grid gap-2 text-sm">
                    <div className="grid grid-cols-2 items-center gap-4">
                      <p className="font-sans text-lg text-black">
                        <span>1</span>
                        <span className="mx-1">x</span>Reguler
                      </p>
                      <p className="text-right font-sans text-lg text-black">
                        Rp 0
                      </p>
                    </div>
                    <hr className="border-b border-[0.5px] border-black" />
                    <div className="flex items-center justify-between gap-4">
                      <h1 className="font-sans font-semibold text-xl text-black">
                        Total Bayar
                      </h1>
                      <p className="text-xl text-black">Rp 0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid space-y-2">
              <div className="gap-y-1 font-normal"></div>
              <button
                type="submit"
                className="grid w-full place-items-center rounded-lg border-2 border-black shadow-custom p-3 text-lg font-bold bg-primary text-white"
              >
                Konfirmasi Pembelian
              </button>
              <div className="mt-2"></div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
