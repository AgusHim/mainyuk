"use client";
import Loader from "@/components/Common/Loader/Loader";

import { FormCheckoutTickets } from "@/components/Form/FormCheckoutTickets";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEventDetail } from "@/redux/slices/eventSlice";
import { formatStrToDateTime } from "@/utils/convert";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const CheckoutLayout: React.FC<{ slug: string }> = ({ slug }) => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth.user);
  const eventData = useAppSelector((state) => state.event.event);
  const checkout = useAppSelector((state) => state.order.checkout);
  const isLoading = useAppSelector((state) => state.event.loading);
  const error = useAppSelector((state) => state.event.error);

  useEffect(() => {
    if (eventData == null || eventData.slug != slug) {
      dispatch(getEventDetail(slug));
    }
  }, [eventData]);

  if (eventData == null || isLoading || checkout.length == 0) {
    route.replace(`/events/${slug}`);
    return <Loader></Loader>;
  }

  return (
    <>
      <div className="grid gap-4 bg-yellow-400 py-4">
        <div className="grid gap-2 px-8">
          <h1 className="font-semibold text-lg text-black">Informasi Event</h1>
          <div className="grid gap-2 rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
            <div className="flex w-full gap-4 px-0 -mb-0">
              <div className="relative w-2/5">
                <div className="block overflow-hidden rounded-xl border-2 border-black">
                  <img
                    className="lazy max-w-full entered loaded w-30"
                    src={eventData.image_url}
                  />
                </div>
              </div>
              <div className="flex w-3/5 justify-between">
                <div className="flex flex-col pb-3 text-left">
                  <div className="flex justify-between">
                    <div className="mb-3 line-clamp-2 w-full cursor-pointer text-base font-semibold text-neutral-700">
                      {eventData.title ?? ""}
                    </div>
                  </div>
                  <div className="cursor-pointer">
                    <div className="mb-2 text-sm font-normal text-black">
                      {formatStrToDateTime(
                        eventData.start_at!.replace("Z", ""),
                        "EEEE, dd MMM yyyy HH:mm"
                      )}
                    </div>
                    <div className="flex w-full items-center">
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
                        <div className="flex items-center">
                          <p className="line-clamp-1 text-sm font-normal text-black">
                            YukNgaji Solo
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-8">
          <div>
            <h1 className="font-semibold text-xl text-black mb-2">
              Data Pemesan
            </h1>
          </div>
          <div>
            <div className="rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
              <h1 className="font-semibold text-lg text-black">
                {auth?.name ?? "name"}
              </h1>
              <p className="text-lg text-black">{auth?.email ?? "email"}</p>
            </div>
          </div>
        </div>
        <FormCheckoutTickets />
      </div>
    </>
  );
};
