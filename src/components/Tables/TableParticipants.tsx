"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventParticipants } from "@/redux/slices/eventSlice";
import { useEffect } from "react";

interface Props {
  filterTicketName?: string;
}

const TableParticipants: React.FC<Props> = ({ filterTicketName }) => {
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event.event);
  const isLoading = useAppSelector((state) => state.presences.loading);
  const participants = useAppSelector((state) => state.event.participants);

  useEffect(() => {
    if (participants == null && event != null) {
      dispatch(getEventParticipants(event!.id!));
    }
  }, []);

  const filteredParticipants = participants?.filter((ticket) => {
    if (!filterTicketName || filterTicketName === "All") return true;
    return ticket?.ticket?.name === filterTicketName;
  });

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
                  No Whatsapp
                </th>
                <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center capitalize">
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
              {filteredParticipants?.map((ticket, key) => {
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
                          {ticket?.user_name ?? ""}
                        </p>
                        <p className="text-black text-sm dark:text-white text-center">
                          {ticket?.user_gender ?? ""}
                        </p>
                        <p className="text-black text-sm dark:text-white text-center">
                          {ticket?.user_email ?? ""}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                      <div className="flex flex-col justify-start items-start">
                        <p className="text-black font-bold dark:text-white text-center">
                          {ticket?.user?.name ?? ""}
                        </p>
                        <p className="text-black text-sm dark:text-white text-center">
                          {ticket?.order?.public_id ?? ""}
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

export default TableParticipants;
