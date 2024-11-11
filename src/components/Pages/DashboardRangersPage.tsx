"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useRef, useState } from "react";
import CardDataStats from "../CardDataStats";
import TableRanger from "../Tables/TableRanger";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { getRangers, setEndAt, setStartAt } from "@/redux/slices/rangerSlice";
import FormRanger from "../Form/FormRanger";
import DashboardLoader from "../common/Loader/DashboardLoader";
import Dialog from "../common/Dialog/Dialog";
import DatePicker, {
  leftPopupTheme,
  rightPopupTheme,
} from "../common/DatePicker/DatePicker";
import { formatStrToDateTime } from "@/utils/convert";
import DropdownDivisi from "../Dropdowns/DropdownDivisi";

export default function DashboardRangersPage() {
  const dispatch = useAppDispatch();
  const rangers = useAppSelector((state) => state.ranger.rangers);
  const isLoading = useAppSelector((state) => state.ranger.loading);
  const error = useAppSelector((state) => state.ranger.error);
  const startAt = useAppSelector((state) => state.ranger.startAt);
  const endAt = useAppSelector((state) => state.ranger.endAt);
  const [divisi, setDivisiID] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      const start = formatStrToDateTime(startAt, "dd-MM-yyyy", false);
      const end = formatStrToDateTime(endAt, "dd-MM-yyyy", false);
      dispatch(getRangers({ start_at: start, end_at: end }));
    }
  }, []);

  const handleFilterDivisi = (newValue: string) => {
    if (newValue == "all") {
      setDivisiID(null);
    } else {
      setDivisiID(newValue);
    }
    const start = formatStrToDateTime(startAt, "dd-MM-yyyy", false);
    const end = formatStrToDateTime(endAt, "dd-MM-yyyy", false);
    dispatch(getRangers({ divisi_id: newValue, start_at: start, end_at: end })); // This is where you can call additional logic
  };

  let [dialogContent, setDialogContent] = useState<React.ReactNode>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  if (rangers == null && isLoading) {
    return <DashboardLoader />;
  }

  if (error != null) {
    return <h1>{error}</h1>;
  }

  if (rangers == null) {
    return <div></div>;
  }
  return (
    <>
      <Breadcrumb pageName="Rangers" />
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats
          title="Total Rangers"
          total={rangers!.length.toString()}
          rate=""
        >
          {iconRanger("fill-success")}
        </CardDataStats>
      </div>
      <div className="mb-3 w-full flex justify-end">
        <button
          onClick={() => {
            setDialogContent(
              <FormRanger ranger={null} toggleDialog={toggleDialog} />
            );
            toggleDialog();
          }}
          className="w-full sm:w-50 inline-flex items-center justify-center gap-2.5 rounded-lg bg-meta-3 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-3 border-2 border-black"
          style={{ boxShadow: "5px 5px 0px 0px #000000" }}
        >
          <span>{iconRanger("fill-white")}</span>
          Tambah Ranger
        </button>
      </div>

      <div className="flex items-center justify-between my-5">
        <DropdownDivisi onChange={handleFilterDivisi} />
        <div className="flex items-center">
          <DatePicker
            theme={rightPopupTheme}
            value={formatStrToDateTime(startAt, "dd MMMM yyyy", false)}
            onSelectedDateChanged={(date: Date) => {
              dispatch(setStartAt(date.toISOString()));
              const start = formatStrToDateTime(
                date.toISOString(),
                "dd-MM-yyyy",
                false
              );
              const end = formatStrToDateTime(endAt, "dd-MM-yyyy", false);
              dispatch(getRangers({ start_at: start, end_at: end }));
            }}
          />
          <span className="mx-4 text-gray-500">to</span>
          <DatePicker
            theme={leftPopupTheme}
            value={formatStrToDateTime(endAt, "dd MMMM yyyy", false)}
            onSelectedDateChanged={(date: Date) => {
              dispatch(setEndAt(date.toISOString()));
              const start = formatStrToDateTime(startAt, "dd-MM-yyyy", false);
              const end = formatStrToDateTime(
                date.toISOString(),
                "dd-MM-yyyy",
                false
              );
              dispatch(getRangers({ start_at: start, end_at: end }));
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <TableRanger />
      </div>
      <Dialog ref={dialogRef} toggleDialog={toggleDialog}>
        {dialogContent}
      </Dialog>
    </>
  );
}

function iconRanger(className: string) {
  return (
    <>
      <svg
        className={className}
        fill="none"
        width="28"
        height="28"
        viewBox="0 -0.3 47.6 47.6"
        id="Layer_2"
        data-name="Layer 2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M45.55,8.31a3.32,3.32,0,1,1,4.22,3.2v8.55H48V11.51A3.36,3.36,0,0,1,45.55,8.31Z"
          transform="translate(-4.57 -5)"
        />
        <path
          d="M35.31,7.47v8.68C41,18.62,45,23.86,45,30c0,8.43-7.6,13.25-16.88,13.25S11.2,38.38,11.2,30c0-6.09,4-11.33,9.64-13.8V7.47c-7.77,3-12,11-12,20.31,0,12,8.62,18.8,19.28,18.8s19.29-6.81,19.29-18.8C47.36,18.44,43.08,10.48,35.31,7.47Z"
          transform="translate(-4.57 -5)"
        />
        <path
          d="M34.1,15.67V7.05a21.51,21.51,0,0,0-6-.91,19.52,19.52,0,0,0-6,.91v8.62a18.14,18.14,0,0,1,12.05,0Z"
          transform="translate(-4.57 -5)"
        />
        <path
          d="M24.4,17.83a14.36,14.36,0,0,0-8.92,6.93.6.6,0,0,0,.36.85l2.65.84a.66.66,0,0,0,.73-.3,9.9,9.9,0,0,1,6.2-4.94.66.66,0,0,0,.43-.72l-.67-2.23A.59.59,0,0,0,24.4,17.83Z"
          transform="translate(-4.57 -5)"
        />
        <path
          d="M4.57,30.31v1.2a3,3,0,0,0,3,3h1a19.61,19.61,0,0,1-.84-4.22Z"
          transform="translate(-4.57 -5)"
        />
        <path
          d="M7.59,27.78a28.48,28.48,0,0,1,.72-6.51H7.59a3,3,0,0,0-3,3V29.1h3Z"
          transform="translate(-4.57 -5)"
        />
        <path
          d="M47.6,34.53h1a3,3,0,0,0,3-3v-1.2H48.44A19.61,19.61,0,0,1,47.6,34.53Z"
          transform="translate(-4.57 -5)"
        />
        <path
          d="M48.56,21.27h-.72a28.48,28.48,0,0,1,.72,6.51,10.17,10.17,0,0,1-.06,1.32h3V24.28A2.89,2.89,0,0,0,48.56,21.27Z"
          transform="translate(-4.57 -5)"
        />
        <path
          d="M42.42,43.44a21.89,21.89,0,0,1-14.35,4.94,21.89,21.89,0,0,1-14.34-4.94l-.84.85a.57.57,0,0,0-.06.78c3.56,4.52,9,6.93,15.24,6.93s11.69-2.41,15.25-6.93a.56.56,0,0,0-.06-.78Z"
          transform="translate(-4.57 -5)"
        />
      </svg>
    </>
  );
}
