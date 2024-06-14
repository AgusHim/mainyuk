"use client";
import { useAppSelector } from "@/hooks/hooks";

const TableRanger = () => {
  const rangers = useAppSelector((state) => state.ranger.rangers);

  return (
    <div className="rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-bottom border-2 border-black dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto mb-3">
          <thead className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-3 px-2 font-medium text-black dark:text-white xl:pl-11 text-center">
                Nama
              </th>
              <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                Tim
              </th>
              <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                Alamat
              </th>
              <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                Aktifitas
              </th>
              <th className="py-3 px-2 font-medium text-black dark:text-white text-center">
                Total Hadir
              </th>
              <th className="py-3 px-2 font-medium text-black dark:text-white text-center">
                Tidak Hadir
              </th>
              <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                Completeness
              </th>
            </tr>
          </thead>
          <tbody>
            {rangers?.map((ranger, key) => (
              <tr key={key}>
                <td className="border-b border-black py-3 px-2 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {ranger.user?.name}
                  </h5>
                </td>
                <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-black dark:text-white">
                      {ranger.divisi?.name}
                    </p>
                    <p className="text-black dark:text-white">{ranger.divisi?.regional}</p>
                  </div>
                </td>
                <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                  <div className="flex justify-center items-center">
                    <p className="text-black dark:text-white">{ranger.user?.address}</p>
                  </div>
                </td>
                <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                  <div className="flex justify-center items-center">
                    <p className="text-black dark:text-white">{ranger.user?.activity}</p>
                  </div>
                </td>
                <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                  <div className="flex justify-center items-center">
                    <p className="text-black dark:text-white">{ranger.present}</p>
                  </div>
                </td>
                <td className="text-center border-b border-black py-3 px-2 dark:border-strokedark">
                <div className="flex justify-center items-center">
                    <p className="text-black dark:text-white">{ranger.absent}</p>
                  </div>
                </td>
                <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                <div className="flex justify-center items-center">
                    <p className="text-primary font-bold text-xl">{(ranger.present!/(ranger.present! + ranger.absent!))*100}%</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableRanger;
