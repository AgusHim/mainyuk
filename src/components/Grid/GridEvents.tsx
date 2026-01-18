"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventsHome } from "@/redux/slices/eventSlice";
import { Event } from "@/types/event";
import { formatStrToDateTime } from "@/utils/convert";
import Link from "next/link";
import { useEffect } from "react";
import Loader from "../common/Loader/Loader";

export default function GridEvents() {
  const dispatch = useAppDispatch();
  const eventsData = useAppSelector((state) => state.event.data);
  const isLoading = useAppSelector((state) => state.event.loading);
  const rectangles = Array(6).fill(null);
  const error = useAppSelector((state) => state.event.error);

  useEffect(() => {
    if (eventsData == null) {
      dispatch(getEventsHome());
    }
  }, []);

  if (eventsData == null || isLoading) {
    return <Loader></Loader>
  }
  const events = eventsData?.filter(event => event.isPublished);
  return (
    <div className="max-w-layout xs:w-full h-full w-screen bg-yellow-400 p-4">
      <div className="grid gap-4">
        {events?.map((event) => (
          <Link key={event.id} href={`/events/${event.slug}`}>
            <div className="flex w-full rounded-xl border-2 border-black bg-yellow-300 shadow-custom hover:shadow-none transition-all hover:translate-x-1 hover:translate-y-1">
              <div className="relative w-2/5">
                <div className="block overflow-hidden rounded-xl m-2">
                  <img
                    className="lazy max-w-full entered loaded object-cover"
                    width={400}
                    height={500}
                    src={event.image_url}
                  />
                </div>
              </div>
              <div className="flex w-3/5 justify-between p-2">
                <div className="flex cursor-pointer flex-col text-left">
                  <div className="flex-1">
                    <div className="mb-1 line-clamp-2 w-full cursor-pointer">
                      <h1 className="font-satoshi font-semibold text-md text-black">
                        {event.title}
                      </h1>
                    </div>
                    <div>
                      <p className="font-satoshi text-sm text-black">
                        {formatStrToDateTime(
                          event.start_at!.replace("Z", ""),
                          "EEEE, dd MMMM yyyy"
                        )}
                      </p>
                    </div>
                    <div className="mt-4 flex w-full items-center">
                      <div className="mr-2">
                        <div className="size-6">
                          <img
                            className="lazy max-w-full entered loaded"
                            src="/images/logo/yn_logo.png"
                            width={24}
                            height={24}
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="line-clamp-1">
                          <p className="font-satoshi font-semibold text-sm text-black">
                            YukNgaji Solo
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <AllowedGender event={event} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const AllowedGender: React.FC<{ event: Event }> = ({ event }) => {
  if (event.allowed_gender == "FEMALE") {
    return (
      <div className="mb-2 flex items-center gap-1 rounded-xl bg-meta-7 p-2">
        <div className="flex-1">
          <h1 className="font-satoshi font-medium text-xs text-black">
            Female Only
          </h1>
        </div>
      </div>
    );
  }
  if (event.allowed_gender == "MALE") {
    return (
      <div className="mb-2 flex items-center gap-1 rounded-xl bg-meta-5 p-2">
        <div className="flex-1">
          <h1 className="font-satoshi font-medium text-xs text-black">
            Male Only
          </h1>
        </div>
      </div>
    );
  }
  return <></>;
};
