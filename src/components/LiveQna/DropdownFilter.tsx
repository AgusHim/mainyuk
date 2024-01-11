"use client"
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { sortComment } from "@/redux/slices/qnaSlice";
import { useState } from "react";

const DropdownFilter = () => {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector((state)=> state.qna.sortBy);

  const [open, setOpen] = useState<boolean>(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleSelected = (sortBy:string)=>{
    setOpen(!open);
    dispatch(sortComment(sortBy));
  };

  return (
    <>
      <div className="relative inline-block text-left">
        <button
          onClick={handleClick}
          type="button"
          className="inline-flex justify-center items-center px-4 py-2 border rounded-md text-sm font-medium text-white dark:text-white"
        >
          {sortBy}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l6 6a1 1 0 01-1.414 1.414L10 5.414 4.707 10.707a1 1 0 01-1.414-1.414l6-6A1 1 0 0110 3z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div
          className={`absolute z-10 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
            open === true ? "block" : "hidden"
          }`}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <a
             onClick={()=>handleSelected("Pupuler")}
              href="#"
              className="block px-4 py-2 text-sm text-black hover:text-primary hover:font-bold"
              role="menuitem"
            >
              Populer
            </a>
            <a
            onClick={()=>handleSelected("Terbaru")}
              href="#"
              className="block px-4 py-2 text-sm text-black hover:text-primary hover:font-bold"
              role="menuitem"
            >
              Terbaru
            </a>
            <a
            onClick={()=>handleSelected("Pertama")}
              href="#"
              className="block px-4 py-2 text-sm text-black hover:text-primary hover:font-bold"
              role="menuitem"
            >
              Pertama
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default DropdownFilter;
