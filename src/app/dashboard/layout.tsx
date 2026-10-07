"use client";

import "../globals.css";
import "../data-tables-css.css";
import "../satoshi.css";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getSessionUser } from "@/redux/slices/authSlice";
import Loader from "@/components/common/Loader/Loader";
import { canAccessDashboard } from "@/utils/dashboardAccess";

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

  // Peran diperiksa di sini, bukan di tiap halaman, supaya menu dan akses
  // memakai aturan yang sama (`utils/dashboardAccess.ts`). Server tetap penentu
  // akhir: setiap endpoint memeriksa izinnya sendiri.
  const allowed = canAccessDashboard(pathname, user.role);

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
              {allowed ? (
                children
              ) : (
                <div className="rounded-sm border-2 border-black bg-white p-6 shadow-bottom dark:bg-boxdark">
                  <h1 className="text-lg font-semibold text-black dark:text-white">
                    Tidak berizin
                  </h1>
                  <p className="mt-1 text-sm text-black dark:text-white">
                    Halaman ini tidak tersedia untuk peran akun Anda.
                  </p>
                </div>
              )}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
    </div>
  );
}
