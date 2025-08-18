import React from "react";
import * as XLSX from "xlsx";
import FileSaver, { saveAs } from "file-saver";
import { Presence } from "@/types/presence";
import { formatStrToDateTime } from "@/utils/convert";

interface Props {
  data: Presence[]; // Assuming your data is an array of objects
  fileName: string;
}

const filterData = (data: Presence[]): any[] => {
  var load: any[] = [];
  data.forEach((e: Presence) => {
    load.push({
      Nama: e.user.name,
      Gender: e.user.gender,
      Usia: `${e.user.age} Th`,
      Kecamatan: `${e.user.sub_district?.name}`,
      Kabupaten: `${e.user.district?.name}`,
      Provinsi: `${e.user?.province?.name}`,
      "No HP": `${e.user.phone ?? "-"}`,
      Aktifitas: e.user.activity,
      "Info Kajian": e.user.source,
      Event: `${e.event.title}`,
      "Tgl Absen": `${formatStrToDateTime(e.created_at!, "dd MMM yyyy HH:mm")}`,
    });
  });
  return load;
};
const ExportPresenceButton: React.FC<Props> = ({ data, fileName }) => {
  const filtered = filterData(data);
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const exportData = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(exportData, fileName + fileExtension);
  };

  return (
    <button
      onClick={exportToExcel}
      className="mt-5 ml-0 xsm:mt-0 xsm:ml-5 w-40 sm:w-60 inline-flex items-center justify-center gap-2.5 rounded-md bg-success py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 border-2 border-black"
      style={{boxShadow: '5px 5px 0px 0px #000000'}}
    >
      <span>
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 20C7.58172 20 4 16.4183 4 12M20 12C20 14.5264 18.8289 16.7792 17 18.2454"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 14L12 4M12 4L15 7M12 4L9 7"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      Export
    </button>
  );
};

export default ExportPresenceButton;
