
import Image from "next/image";

const DashboardLoader = () => {
  return (
    <div className="w-full h-90 flex flex-col items-center justify-center content-center">
        <Image
            className="ml-4"
            width={100}
            height={100}
            src={"/images/logo/yn_logo.png"}
            alt="Logo"
          />
        <span className="ml-5 mt-3 loading loading-spinner loading-2xl text-primary"></span>
      </div>
  );
};

export default DashboardLoader;

