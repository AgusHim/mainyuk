import { User } from "@/types/user";

const eventData: User[] = [
  {
    id:"asdada",
    username:"sadada",
    name: "Wahab",
    address: "Solo",
    phone:"0823123131",
    age: 23,
    gender: "Ikhwan",
    createdAt: "10/01/2021",
    event:{
      title: "Kajian Pekanan"
    }
  },
  {
    id:"asdada",
    username:"sadada",
    name: "Fulan",
    address: "Sukoharjo",
    phone:"0823123131",
    age: 20,
    gender: "Akhwat",
    createdAt: "10/01/2021",
    event:{
      title: "Fun Futsal"
    }
  },
];

const TableUser = () => {
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
            {eventData.map((data, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {data.name}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex justify-center items-center">
                    <p className="text-black dark:text-white">
                      {data.gender}
                    </p>
                    
                  </div>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{data.phone}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {data.address}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {data.age} th
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {data.event.title}
                  </p>
                  <p className="text-sm">{data.createdAt}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableUser;
