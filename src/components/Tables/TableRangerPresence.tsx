"use client";
import { useAppSelector } from "@/hooks/hooks";
import { formatStrToDateTime } from "@/utils/convert";

const TableRangerPresence = () => {
  
  const presence = useAppSelector((state) => state.rangerPresence.data);

  return (
    <div className="rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-bottom border-2 border-black dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto mb-3">
          <th className="border border-black">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-3 px-2 font-medium text-black dark:text-white xl:pl-11 text-center">
                Nama
              </th>
              <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                Divisi / Regional
              </th>
              <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                Nama Agenda
              </th>
              <th className="min-w-[120px] py-3 px-2 font-medium text-black dark:text-white text-center">
                Lokasi
              </th>
              <th className="py-3 px-2 font-medium text-black dark:text-white text-center">
                Tanggal Absen
              </th> 
            </tr>
          </th>
          <tbody>
            {presence?.map((presence, key) => (
              <tr key={key}>
                <td className="border-b border-black py-3 px-2 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {presence.ranger?.user?.name}
                  </h5>
                </td>
                <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-black dark:text-white">
                      {presence.divisi?.name}
                    </p>
                    <p className="text-black dark:text-white">{presence.divisi?.regional}</p>
                  </div>
                </td>
                <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-black dark:text-white">{presence.agenda?.name}</p>
                    <p className="text-meta-7">{presence.agenda?.type.toLocaleUpperCase()}</p>
                  </div>
                </td>
                <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                  <div className="flex justify-center items-center">
                    <p className="text-black dark:text-white">{presence.agenda?.location}</p>
                  </div>
                </td>
                <td className="border-b border-black py-3 px-2 dark:border-strokedark">
                  <div className="flex justify-center items-center">
                    <p className="text-black dark:text-white">{formatStrToDateTime(presence.created_at!, "dd-MM-yyyy HH:mm")}</p>
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

export default TableRangerPresence;
