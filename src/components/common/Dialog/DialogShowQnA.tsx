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
        className="modal"
      >
        <div
          className="modal-box bg-white dark:bg-boxdark-2 border-2 border-black w-full"
          style={{ boxShadow: "8px 8px 0px #000000" }}
        >
           <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={toggleDialog}>✕</button>
          {children}
        </div>
      </dialog>
    );
  }
);
export default DialogShowQnA;
