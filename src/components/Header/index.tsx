import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getSessionUser } from "@/redux/slices/authSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  
  useEffect(()=>{
    if (!auth.loading && auth.user == null) {
      dispatch(getSessionUser());
    }
  })

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center  ">
          <Link className="block flex-shrink-0 " href="/">
            <Image
              width={60}
              height={60}
              src={"/images/logo/yn_logo.png"}
              alt="Logo"
            />
          </Link>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Dark Mode Toggler --> */}
            <DarkModeSwitcher />
            {/* <!-- Dark Mode Toggler --> */}
          </ul>
          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
