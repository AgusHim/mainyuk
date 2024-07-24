"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect } from "react";
import CardDataStats from "../CardDataStats";
import TableRangerPresence from "../Tables/TableRangerPresence";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { getRangerPresence, getRangersPresence } from "@/redux/slices/rangerPresenceSlice";
import TableRangersPresence from "../Tables/TableRangersPresence";

export default function DashboardContributionsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const presence = useAppSelector((state) => state.rangerPresence.data);
  const rangersPresence = useAppSelector((state) => state.rangerPresence.rangers);
  const isLoading = useAppSelector((state) => state.rangerPresence.loading);
  const error = useAppSelector((state) => state.rangerPresence.error);

  useEffect(() => {
    if (!isLoading) {
      const isAdmin = user?.role == "admin" || user?.role == "pj";
      if(isAdmin){
        dispatch(getRangersPresence());
      }
      dispatch(getRangerPresence());
    }
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (error != null) {
    return <h1>{error}</h1>;
  }
  if (presence == null) {
    return <div></div>;
  }
  return (
    <>
      <Breadcrumb pageName="Riwayat Kontribusi" />
      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab tabs-lg text-black dark:text-white [--tab-bg:white]"
          aria-label="Kontribusiku"
          defaultChecked
        />
        <div
          role="tabpanel"
          className="tab-content border-base-300 rounded-box p-6 overflow-x-auto whitespace-nowrap"
        >
          <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats
              title="Total Kontribusi"
              total={presence!.length.toString()}
              rate=""
            >
              <svg
                className="fill-success"
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
            </CardDataStats>
          </div>
          <div className="flex flex-col gap-10">
            <TableRangerPresence />
          </div>
        </div>

        {user?.role == "pj" || user?.role == "admin" ? (
          <>
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab w-10 text-black dark:text-white [--tab-bg:white] text-sm md:text-lg"
              aria-label="Kontribusi Ranger"
            />
            <div
              role="tabpanel"
              className="tab-content border-base-300 rounded-box p-6 overflow-x-auto whitespace-nowrap"
            >
              <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
                <CardDataStats
                  title="Total Kontribusi Ranger"
                  total={rangersPresence!.length.toString()}
                  rate=""
                >
                  <svg
                    className="fill-success"
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
                </CardDataStats>
              </div>
              <div className="flex flex-col gap-10">
                <TableRangersPresence />
              </div>
            </div>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}
