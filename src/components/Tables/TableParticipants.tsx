"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventParticipants } from "@/redux/slices/eventSlice";
import { Ranger } from "@/types/ranger";
import { useEffect } from "react";

const TableParticipants: React.FC = () => {
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event.event);
  const isLoading = useAppSelector((state) => state.presences.loading);
  const participants = useAppSelector((state) => state.event.participants);

  useEffect(() => {
    if (participants == null && event != null) {
      dispatch(getEventParticipants(event!.id!));
    }
  }, []);
  return (
    <>
      <div className="rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-bottom border-2 border-black dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto mb-3">
            <thead className="border border-black">
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white xl:pl-11 text-center">
                  Tiket ID
                </th>
                <th className="min-w-[220px] py-3 px-2 font-medium text-black dark:text-white xl:pl-11 text-center">
                  Detail Tiket
                </th>
                <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white xl:pl-11 text-center">
                  Nama Pemesan
                </th>
                <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                  Gender
                </th>
                <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                  No Telp
                </th>
                <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                  Instagram
                </th>
                <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                  Aktifitas
                </th>
                <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                  Provinsi
                </th>
                <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                  Kab./Kota
                </th>
                <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                  Kecamatan
                </th>
              </tr>
            </thead>
            <tbody>
              {participants?.map((ticket, key) => {
                return (
                  <tr key={key}>
                    <td className="border-b border-black py-3 px-2 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {ticket?.public_id ?? ""}
                      </h5>
                    </td>
                    <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                      <div className="flex flex-col justify-center items-start">
                        <p className="text-black text-sm font-bold dark:text-white text-center">
                          {ticket?.ticket?.name ?? ""}
                        </p>
                        <p className="text-black text-sm dark:text-white text-center">
                          {ticket?.user_name?? ""}
                        </p>
                        <p className="text-black text-sm dark:text-white text-center">
                          {ticket?.user_gender?? ""}
                        </p>
                        <p className="text-black text-sm dark:text-white text-center">
                          {ticket?.user_email?? ""}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-black dark:text-white text-center">
                          {ticket?.user?.name ?? ""}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                      <div className="flex justify-center items-center">
                        <p className="text-black dark:text-white">
                          {ticket?.user?.gender == "male" ? "Ikhwan" : "Akhwat"}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                      <div className="flex justify-center items-center">
                        <p className="text-black dark:text-white">
                          {ticket?.user?.phone ?? ""}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                      <div className="flex justify-center items-center">
                        <p className="text-black dark:text-white">
                          {ticket?.user?.instagram ?? ""}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                      <div className="flex justify-center items-center">
                        <p className="text-black dark:text-white">
                          {ticket?.user?.activity ?? ""}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                      <div className="flex justify-center items-center">
                        <p className="text-black dark:text-white">
                          {ticket?.user?.province?.name ?? ""}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                      <div className="flex justify-center items-center">
                        <p className="text-black dark:text-white">
                          {ticket?.user?.district?.name ?? ""}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                      <div className="flex justify-center items-center">
                        <p className="text-black dark:text-white">
                          {ticket?.user?.sub_district?.name ?? ""}
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
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

export default TableParticipants;
