"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDivisi } from "@/redux/slices/divisiSlice";
import { Agenda } from "@/types/agenda";
import { getAgenda, postAgenda } from "@/redux/slices/agendaSlice";

const FormAgenda = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const listDivisi = useAppSelector((state) => state.divisi.data);
  const isLoadingDivisi = useAppSelector((state) => state.divisi.loading);
  const isLoadingAgenda = useAppSelector((state) => state.agenda.loading);

  useEffect(() => {
    if (listDivisi == null && !isLoadingDivisi) {
      dispatch(getDivisi());
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    type: "meeting",
    location: "",
    divisi_id: "1",
    start_at: "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    dispatch(postAgenda(formData as Agenda))
      .unwrap()
      .then((res) => {
        if (res != null) {
          dispatch(getAgenda());
          router.replace("/dashboard/agenda");
        }
      })
      .catch((error) => {
        // Handle errors here if needed
        console.error("Error fetching data:", error);
      });
  };

  return (
    <>
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <div className="rounded-sm border-2 border-black bg-white shadow-bottom dark:bg-boxdark">
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Nama Agenda <span className="text-meta-1">*</span>
                </label>
                <input
                  value={formData["name"]}
                  onChange={handleChange}
                  name="name"
                  type="text"
                  placeholder="Masukan nama agenda"
                  className="w-full rounded border-[1.5px] border-black bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Kategori <span className="text-meta-1">*</span>
                </label>
                <div className="relative z-20 bg-transparent">
                  <select
                    value={formData["type"]}
                    onChange={handleChange}
                    name="type"
                    required
                    className="relative z-20 w-full appearance-none rounded border border-black bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:focus:border-primary"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="hangout">Hangout</option>
                    <option value="event">Event</option>
                  </select>
                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill=""
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Divisi
                </label>

                {isLoadingDivisi || listDivisi == null ? (
                  <div></div>
                ) : (
                  <div className="relative z-20 bg-transparent">
                    <select
                      value={formData["divisi_id"]}
                      onChange={handleChange}
                      name="divisi_id"
                      required
                      className="relative z-20 w-full appearance-none rounded border border-black bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:focus:border-primary"
                    >
                      {listDivisi?.map((divisi, key) => (
                        <option value={divisi.id}>{divisi.name}</option>
                      ))}
                    </select>
                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                )}
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Lokasi <span className="text-meta-1">*</span>
                </label>
                <input
                  value={formData["location"]}
                  onChange={handleChange}
                  name="location"
                  type="text"
                  placeholder="Masukan nama agenda"
                  className="w-full rounded border-[1.5px] border-black bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Pelaksanaan <span className="text-meta-1">*</span>
                </label>
                <input
                  value={formData["start_at"]}
                  onChange={handleChange}
                  name="start_at"
                  type="datetime-local"
                  placeholder="Masukan tanggal mulai agenda"
                  className="w-full rounded border-[1.5px] border-black bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
                />
              </div>
              {isLoadingAgenda ? (
                <div className="mt-10 mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
              ) : (
                <button
                  className="mt-10 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray border-2 border-black"
                  style={{ boxShadow: "0px 5px 0px 0px #000000" }}
                >
                  Simpan
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormAgenda;
