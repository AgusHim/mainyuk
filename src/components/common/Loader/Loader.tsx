
import Image from "next/image";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      {/* <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div> */}
      <Image
            className="ml-4"
            width={100}
            height={100}
            src={"/images/logo/yn_logo.png"}
            alt="Logo"
          />
    </div>
  );
};

export default Loader;
