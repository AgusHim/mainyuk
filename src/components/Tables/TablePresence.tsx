"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getPresences } from "@/redux/slices/presenceSlice";
import { formatStrToDateTime } from "@/utils/convert";
import { useEffect } from "react";
import DashboardLoader from "../Common/Loader/DashboardLoader";

const TablePresence = () => {
  const dispatch = useAppDispatch();

  const event = useAppSelector((state) => state.event.event);
  const presenceData = useAppSelector((state) => state.presences.data);
  const isLoading = useAppSelector((state) => state.presences.loading);
  const error = useAppSelector((state) => state.presences.error);

  useEffect(() => {
    if (!isLoading) {
      dispatch(getPresences(event!.id!));
    }
  }, []);

  if (isLoading) {
    return <DashboardLoader />;
  }
  if (error != null) {
    return <h1>{error}</h1>;
  }
  return (
    <div className="rounded-sm border border-black bg-white px-5 pt-6 pb-2.5 shadow-bottom dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto mb-3">
          <thead className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Nama
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white text-center">
                Gender
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white text-center">
                No HP
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Asal
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Umur
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Aktifitas
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Tgl Dibuat
              </th>
            </tr>
          </thead>
          <tbody>
            {presenceData?.map((data, key) => (
              <tr key={key}>
                <td className="border-b border-black py-5 px-4 pl-9 xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {data.user.name}
                  </h5>
                </td>
                <td className="border-b border-black py-5 px-4">
                  <div className="flex justify-center items-center">
                    <p className="text-black dark:text-white">
                      {data.user.gender == "male" ? "Ikhwan" : "Akhwat"}
                    </p>
                  </div>
                </td>
                <td className="border-b border-black py-5 px-4">
                  <p className="text-black dark:text-white">
                    {data.user.phone}
                  </p>
                </td>
                <td className="border-b border-black py-5 px-4">
                  <p className="text-black dark:text-white">
                    {data.user.address}
                  </p>
                </td>
                <td className="border-b border-black py-5 px-4">
                  <p className="text-black dark:text-white">
                    {data.user.age} th
                  </p>
                </td>
                <td className="border-b border-black py-5 px-4">
                  <p className="text-black dark:text-white">
                    {data.user.activity}
                  </p>
                </td>
                <td className="border-b border-black py-5 px-4">
                  <p className="text-black dark:text-white">
                    {formatStrToDateTime(data.created_at!, "dd MMM yyyy HH:mm")}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePresence;
