"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getPaymentMethod } from "@/redux/slices/PaymentMethodSlice";
import { setPaymentMethod } from "@/redux/slices/orderSlice";
import { PaymentMethod } from "@/types/PaymentMethod";
import { useEffect, useState } from "react";

const CheckoutPaymentMethodCard = () => {
  const dispatch = useAppDispatch();
  const paymentMethods = useAppSelector((state) => state.paymentMethod.data);
  const selectedMethod = useAppSelector((state) => state.order.payment_method);
  const [selectedType, setSelectedType] = useState<PaymentMethod | null>(null);
  const error = useAppSelector((state) => state.event.error);
  // Get Unique tickets by ticket_id
  const uniqueMethodType = Array.from(
    new Set(paymentMethods.map((pm) => pm.type))
  ).map((type) => paymentMethods.find((pm) => pm.type === type)!);

  useEffect(() => {
    if (paymentMethods.length === 0) {
      dispatch(getPaymentMethod());
    }
  }, [paymentMethods]);

  if (paymentMethods.length === 0) {
    return <></>;
  }
  return (
    <div className="grid space-y-2">
      <div className="gap-y-1 font-normal"></div>
      <div>
        <div className="mb-2 flex items-center gap-2">
          <h1 className="font-sans font-semibold text-xl text-black">
            Metode Pembayaran
          </h1>
          <button type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              aria-hidden="true"
              className="size-4 text-slate-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </button>
        </div>
        <div className="grid gap-4 rounded-lg border-2 border-black bg-yellow-300 p-4 shadow-custom">
          <div className="grid gap-2" data-orientation="vertical">
            {uniqueMethodType.map((e, index) => {
              return (
                <div
                  data-state="closed"
                  data-orientation="vertical"
                  className="rounded-lg border border-black bg-yellow-200 shadow-custom2"
                >
                  <h3 data-orientation="vertical" data-state="closed">
                    <button
                      type="button"
                      aria-controls="radix-2"
                      aria-expanded="false"
                      data-state="closed"
                      data-orientation="vertical"
                      id="radix-3"
                      className={`w-full ${
                        e.type === selectedType?.type
                          ? "border-b border-b-black"
                          : ""
                      }`}
                      data-radix-collection-item=""
                      onClick={() => {
                        if (selectedType == e) {
                          setSelectedType(null);
                        } else {
                          setSelectedType(e);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2 p-4">
                        <svg
                          viewBox="0 0 512 512"
                          className="size-6 fill-black"
                          fill="currentColor"
                        >
                          <path d="M95.5 104h320a87.73 87.73 0 0111.18.71 66 66 0 00-77.51-55.56L86 94.08h-.3a66 66 0 00-41.07 26.13A87.57 87.57 0 0195.5 104zM415.5 128h-320a64.07 64.07 0 00-64 64v192a64.07 64.07 0 0064 64h320a64.07 64.07 0 0064-64V192a64.07 64.07 0 00-64-64zM368 320a32 32 0 1132-32 32 32 0 01-32 32z"></path>
                          <path d="M32 259.5V160c0-21.67 12-58 53.65-65.87C121 87.5 156 87.5 156 87.5s23 16 4 16-18.5 24.5 0 24.5 0 23.5 0 23.5L85.5 236z"></path>
                        </svg>
                        <p className="font-semibold font-sans text-md text-black">
                          {e.type == "BANK"
                            ? "Bank Transfer"
                            : e.type == "E-WALLET"
                            ? "E-Wallet"
                            : "QR Code"}
                        </p>
                        {e.type === selectedType?.type ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="ml-auto size-6 fill-primary"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        ) : (
                          <></>
                        )}
                      </div>
                    </button>
                    {selectedType?.type == e.type ? (
                      <div
                        data-state="open"
                        id="radix-2"
                        role="region"
                        aria-labelledby="radix-3"
                        data-orientation="vertical"
                        style={styles}
                      >
                        {paymentMethods
                          .filter((pm) => pm.type == e.type)
                          .map((c) => (
                            <div>
                              <button
                                type="button"
                                className={`flex w-full items-center gap-4 p-4 pl-6 border-b border-b-black ${
                                  selectedMethod?.id == c.id
                                    ? "bg-primary bg-opacity-50"
                                    : ""
                                }`}
                                onClick={() => {
                                  dispatch(setPaymentMethod(c));
                                }}
                              >
                                <div className="flex size-8 items-center"></div>
                                <p className="font-sans text-sm text-black">
                                  {c.name}
                                </p>
                              </button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <></>
                    )}
                  </h3>
                  <div
                    data-state="closed"
                    id="radix-2"
                    role="region"
                    aria-labelledby="radix-3"
                    data-orientation="vertical"
                    style={styles}
                    hidden={false}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentMethodCard;

const styles: React.CSSProperties = {
  "--radix-accordion-content-height": "var(--radix-collapsible-content-height)",
  "--radix-accordion-content-width": "var(--radix-collapsible-content-width)",
  "--radix-collapsible-content-height": "324px",
  "--radix-collapsible-content-width": "362px",
} as React.CSSProperties & { [key: string]: string };
