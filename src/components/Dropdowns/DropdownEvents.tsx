"use client";

import { useAppDispatch } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import { getEvents } from "@/redux/slices/eventSlice";
import { Event } from "@/types/event";

interface DropdownProps {
  className?: string;
  onChange: (value: string) => void;
}

const DropdownEvents: React.FC<DropdownProps> = ({ onChange, className }) => {
  const dispatch = useAppDispatch();
  const [events, setEvents] = useState<Event[] | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>("Semua");

  useEffect(() => {
    if (events == null) {
      dispatch(getEvents()).then((res) => {
        setEvents(res.payload as Event[]);
      });
    }
  }, []);

  if (events == null) {
    return <></>;
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEvent(event.target.value);
    const newValue = event.target.value;
    onChange(newValue); // Call the parent function when an option is selected
  };

  return (
    <select
      value={selectedEvent}
      onChange={handleSelectChange}
      name="event_id"
      className={
        className == null
          ? "select select-bordered bg-white border-2 border-black text-black font-bold dark:bg-boxdark focus:border-primary"
          : className
      }
    >
      <option value={"all"}>Semua Event</option>
      {events?.map((event, key) => (
        <option key={key} value={event.id}>
          {event.title}
        </option>
      ))}
    </select>
  );
};

export default DropdownEvents;
