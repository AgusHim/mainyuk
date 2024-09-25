import Image from "next/image";
import { forwardRef } from "react";

type Props = {
  children: React.ReactNode;
  toggleDialog: () => void;
};

const DialogTicketQR = forwardRef<HTMLDialogElement, Props>(
  ({ children, toggleDialog }, ref) => {
    return (
      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            toggleDialog();
          }
        }}
        className="modal max-w-layout bottom-0 z-20 mx-auto grid w-full bg-yellow-400 bg-opacity-80"
      >
        <div
          className="modal-box bg-yellow-300 border-2 border-black w-11/12 max-w-5xl p-5"
          style={{ boxShadow: "8px 8px 0px #000000" }}
        >
          {children}
        </div>
      </dialog>
    );
  }
);
export default DialogTicketQR;
