"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { CustomFlowbiteTheme, Dropdown } from "flowbite-react";
import { getDivisi } from "@/redux/slices/divisiSlice";
import { useEffect } from "react";

interface DropdownProps {
  label: string;
  className?: string;
  onClick: () => void;
}

const dropdownTheme: CustomFlowbiteTheme["dropdown"] = {
  arrowIcon: "ml-2 h-4 w-4",
  content: "py-1 focus:outline-none",
  floating: {
    animation: "transition-opacity",
    arrow: {
      base: "absolute z-10 h-2 w-2 rotate-45",
      style: {
        dark: "bg-gray-900 dark:bg-gray-700",
        light: "bg-white",
        auto: "bg-white dark:bg-gray-700",
      },
      placement: "-4px",
    },
    base: "z-10 w-fit divide-y divide-gray-100 rounded shadow focus:outline-none",
    content: "py-1 text-sm text-gray-700 dark:text-gray-200",
    divider: "my-1 h-px bg-gray-100 dark:bg-gray-600",
    header: "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200",
    hidden: "invisible opacity-0",
    item: {
      container: "",
      base: "flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white",
      icon: "mr-2 h-4 w-4",
    },
    style: {
      dark: "bg-gray-900 text-white dark:bg-gray-700",
      light: "border border-gray-200 bg-white text-gray-900",
      auto: "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white",
    },
    target: "w-fit",
  },
  inlineWrapper: "flex items-center",
};

const DropdownDivisi: React.FC<DropdownProps> = ({ onClick, className }) => {
  const dispatch = useAppDispatch();
  const listDivisi = useAppSelector((state) => state.divisi.data);
  const isLoadingDivisi = useAppSelector((state) => state.divisi.loading);

  useEffect(() => {
    if (listDivisi == null && !isLoadingDivisi) {
      dispatch(getDivisi());
    }
  }, []);

  if (listDivisi == null) {
    return <></>;
  }

  return (
    <select
      value={"Semua Tim"}
      onChange={() => {}}
      name="divisi_id"
      className={
        className == null
          ? "select select-bordered bg-white dark:bg-boxdark focus:border-primary"
          : className
      }
    >
      <option disabled>Pilih Tim</option>
      {listDivisi?.map((divisi, key) => (
        <option key={key} value={divisi.id} onClick={onClick}>
          {divisi.name}
        </option>
      ))}
    </select>
  );
};

export default DropdownDivisi;
