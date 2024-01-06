"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getPresence } from "@/redux/slices/presenceSlice";
import { useEffect } from "react";

const TablePresence = () => {
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event.event);
  const presenceData = useAppSelector((state) => state.presence.data);
  const isLoading = useAppSelector((state) => state.presence.loading);
  const error = useAppSelector((state) => state.presence.error);

  useEffect(() => {
    if (presenceData == null && event != null && !isLoading) {
        console.log("RUN GET PRESENCE")
      dispatch(getPresence(event!.id!));
    }
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (error != null) {
    return <h1>{error}</h1>;
  }
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
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
                Tgl Dibuat
              </th>
            </tr>
          </thead>
          <tbody>
            {presenceData?.map((data, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {data.user.name}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex justify-center items-center">
                    <p className="text-black dark:text-white">
                      {data.user.gender == 'male'?'Ikhwan':'Akhwat'}
                    </p>
                  </div>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {data.user.phone}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {data.user.address}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {data.user.age} th
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {data.event.title}
                  </p>
                  <p className="text-sm">{data.create_at}</p>
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
