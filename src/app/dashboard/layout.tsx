"use client";

import "../globals.css";
import "../data-tables-css.css";
import "../satoshi.css";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/Common/Loader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getSessionUser } from "@/redux/slices/authSlice";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router =useRouter();
  const pathname = usePathname() ?? "/";
  
  const auth = useAppSelector((state) => state.auth);
  const user = useAppSelector((state) => state.auth.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    dispatch(getSessionUser())
      .unwrap()
      .then((value) => {
        if(value == null){
          router.replace(`/signin?redirectTo=${pathname}`);
        }
      })
      .catch((error) => {
        // Handle errors here if needed
        console.error('Error fetching data:', error);
      });
  }, [dispatch]);
  
  if(user == null){
    return <Loader></Loader>
  }

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <HeaderDashboard
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          {/* <!-- ===== Header End ===== --> */}
          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
    </div>
  );
}
