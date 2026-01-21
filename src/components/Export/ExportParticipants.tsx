import React from "react";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { UserTicket } from "@/types/user_ticket";
import { formatStrToDateTime } from "@/utils/convert";

interface Props {
    data: UserTicket[];
    fileName: string;
}

const filterData = (data: UserTicket[]): any[] => {
    var load: any[] = [];
    data.forEach((e: UserTicket) => {
        load.push({
            "Ticket ID": e.public_id,
            "Detail Tiket": e.ticket?.name,
            "Nama Pemesan": e.user_name,
            Gender: e.user_gender === "male" ? "Ikhwan" : e.user_gender === "female" ? "Akhwat" : e.user_gender,
            Email: e.user_email,
            "Nama User": e.user?.name,
            "No HP": e.user?.phone ?? "-",
            Aktifitas: e.user?.activity,
            Provinsi: e.user?.province?.name,
            "Kab./Kota": e.user?.district?.name,
            Kecamatan: e.user?.sub_district?.name,
            "Order ID": e.order?.public_id,
            "Tanggal Daftar": e.created_at ? formatStrToDateTime(e.created_at, "dd MMM yyyy HH:mm") : "-",
        });
    });
    return load;
};

const ExportParticipantsButton: React.FC<Props> = ({ data, fileName }) => {
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const exportToExcel = () => {
        const filtered = filterData(data);
        const ws = XLSX.utils.json_to_sheet(filtered);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const exportData = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(exportData, fileName + fileExtension);
    };

    return (
        <button
            onClick={exportToExcel}
            className="w-40 sm:w-50 inline-flex items-center justify-center gap-2.5 rounded-lg bg-success py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-3 border-2 border-black"
            style={{ boxShadow: "5px 5px 0px 0px #000000" }}
        >
            <span>
                <svg
                    width="20"
                    height="20"
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

export default ExportParticipantsButton;
