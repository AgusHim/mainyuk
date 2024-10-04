"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventsHome } from "@/redux/slices/eventSlice";
import { useEffect } from "react";

export default function GridEventsHome() {
  const dispatch = useAppDispatch();
  const eventData = useAppSelector((state) => state.event.data);
  const isLoading = useAppSelector((state) => state.event.loading);
  const rectangles = Array(6).fill(null);
  const error = useAppSelector((state) => state.event.error);

  useEffect(() => {
    if (eventData == null) {
      dispatch(getEventsHome());
    }
  }, []);

  const events = eventData?.filter(event => event.isPublished);
  return (
    <section id="events">
      <div className="mb-10 py-2 bg-yellow-300 border border-black rounded-full shadow-custom">
        <h1 className="flex-1 text-black text-center font-extrabold text-3xl">
          Event Terbaru
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {events == null
          ? rectangles.map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 h-40 rounded-xl md:rounded-3xl"
              ></div>
            ))
          : events?.map((event, index) => {
              const baseURL = process.env.BASE_URL;
              const link = `https://${baseURL}/events/${event?.slug ?? ""}`;
              const now = new Date();
              const end = new Date(event?.end_at!.replace("Z", ""));
              const isEnded = now > end;
              return (
                <a href={link} key={index} target="_blank">
                  <div className="w-full h-40 relative rounded-xl md:rounded-3xl shadow-custom hover:shadow-none transition-all hover:translate-x-1 hover:translate-y-1">
                    <img
                      src={event?.image_url}
                      alt={event?.title}
                      className="w-full h-full object-cover rounded-xl md:rounded-3xl"
                    />
                    <div
                      className={`absolute inset-0 flex items-center justify-center rounded-xl md:rounded-3xl ${
                        isEnded
                          ? "bg-black opacity-60"
                          : "opacity-0 hover:opacity-50 transition-opacity duration-300"
                      }`}
                    ></div>
                    <div
                      className={`absolute inset-0 flex items-center justify-center ${
                        isEnded
                          ? ""
                          : "opacity-0 hover:opacity-50 transition-opacity duration-300"
                      }`}
                    >
                      <p className="text-white  text-xl font-bold">
                        Event Selesai
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
      </div>
    </section>
  );
}
