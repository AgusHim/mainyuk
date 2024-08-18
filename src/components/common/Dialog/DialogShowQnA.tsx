import Image from "next/image";
import { forwardRef } from "react";

type Props = {
  children: React.ReactNode;
  toggleDialog: () => void;
};

const DialogShowQnA = forwardRef<HTMLDialogElement, Props>(
  ({ children, toggleDialog }, ref) => {
    return (
      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            toggleDialog();
          }
        }}
        className="modal bg-meta-7"
      >
        <div className="flex flex-col items-center">
          <div
            className="modal-box bg-boxdark-2 border-2 border-black w-11/12 max-w-5xl p-10"
            style={{ boxShadow: "8px 8px 0px #000000" }}
          >
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={toggleDialog}
            >
              ✕
            </button>
            {children}
          </div>

          <div className="flex flex-row mt-15 items-center">
            <Image
              width={70}
              height={70}
              src={"/images/logo/yn_logo.png"}
              alt="Logo"
            />
            <h1 className="ml-3 text-[#3C4DDC] font-medium text-3xl">YukNgaji Solo</h1>
          </div>
        </div>
      </dialog>
    );
  }
);
export default DialogShowQnA;
