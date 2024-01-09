import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableEvent from "@/components/Tables/TableEvent";

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Daftar Event",
  description: "Halaman daftar event YukNgaji Solo"
};

const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Events" />
      <Link
        href="/dashboard/events/create"
        className="mb-3 inline-flex items-center justify-center gap-2.5 rounded-lg bg-meta-3 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-3 "
      >
        <span>
          <svg
          className="fill-current"
          fill=""
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Complete">
              <g data-name="add" id="add-2">
                <g>
                  <line
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    x1="12"
                    x2="12"
                    y1="19"
                    y2="5"
                  />
                  <line
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    x1="5"
                    x2="19"
                    y1="12"
                    y2="12"
                  />
                </g>
              </g>
            </g>
          </svg>
        </span>
        Buat Baru
      </Link>
      <div className="flex flex-col gap-10">
        <TableEvent />
      </div>
    </>
  );
};

export default TablesPage;
