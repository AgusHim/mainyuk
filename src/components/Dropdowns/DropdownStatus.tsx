"use client";

import { useState } from "react";

interface DropdownProps {
  className?: string;
  onChange: (value:string) => void;
}

const DropdownStatus: React.FC<DropdownProps> = ({ onChange, className }) => {
  const [status] = useState<string[]>([
    'PAID',
    'PENDING',
    'EXPIRED'
  ]);
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setSelectedStatus(newValue);
    onChange(newValue); // Call the parent function when an option is selected
  };

  return (
    <select
      value={selectedStatus}
      onChange={handleSelectChange}
      name="status"
      className={
        className == null
          ? "select select-bordered bg-white border-2 border-black text-black font-bold dark:bg-boxdark focus:border-primary"
          : className
      }
    >
      <option value={"all"}>Semua Status</option>
      {status?.map((status, key) => (
        <option key={key} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

export default DropdownStatus;
