"use client";
import CheckoutPaymentMethodCard from "@/components/Card/CheckoutPaymentMethodCard";
import CheckoutTicketsCard from "@/components/Card/CheckoutTicketsCard";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  postOrder,
  setAuthToUserTicket,
  setUserTicket,
} from "@/redux/slices/orderSlice";
import { CreateOrder, Order } from "@/types/order";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const FormCheckoutTickets: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const event = useAppSelector((state) => state.event.event);
  const checkout = useAppSelector((state) => state.order.checkout);
  const payment_method = useAppSelector((state) => state.order.payment_method);
  const admin_fee = useAppSelector((state) => state.order.admin_fee);
  const isLoadingOrder = useAppSelector((state) => state.order.isLoadingOrder);

  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [formErrors, setFormErrors] = useState<{
    [key: string]: string | undefined;
  }>({});
  const hasErrors = Object.values(formErrors).some(
    (error) => error !== undefined && error !== ""
  );

  useEffect(() => {
    let form: { [key: string]: any } = {};
    for (let index in checkout) {
      form[`${index}_name`] = "";
      form[`${index}_email`] = "";
      form[`${index}_gender`] = "male";
      form[`${index}_isUseAuth`] = false;
    }
    setFormData(form);
  }, [setFormData]);

  const setAsOrder = (event: any) => {
    const { name, value } = event.target;
    var id = name as string;
    const index = parseFloat(id.split("_")[0]);
    const ticket = checkout[index].ticket;
    const gender_allowed = ticket?.gender_allowed.toLowerCase();
    const user_gender = user!.gender!.toLowerCase();
    if (user_gender != gender_allowed && gender_allowed != "both") {
      toast.info(
        `Tiket khusus untuk ${
          gender_allowed == "male" ? "Laki-laki" : "Perempuan"
        }`
      );
      return;
    }

    let isUseAuth = false;
    if (value == "on") {
      isUseAuth = true;
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [`${index}_name`]: undefined,
      [`${index}_email`]: undefined,
      [`${index}_gender`]: undefined,
    }));
    setFormData({
      ...formData,
      [name]: isUseAuth,
      [`${index}_name`]: user?.name,
      [`${index}_email`]: user?.email,
      [`${index}_gender`]: user?.gender,
    });

    dispatch(
      setAuthToUserTicket({
        index: index,
        auth: {
          name: user?.name,
          email: user?.email,
          gender: user?.gender,
        },
      })
    );
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    var id = name as string;
    const index = parseFloat(id.split("_")[0]);
    const type = id.split("_")[1];
    const ticket = checkout[index].ticket;
    const gender_allowed = ticket?.gender_allowed.toLowerCase();
   
    setFormData({ ...formData, [name]: value });

    // Validate the field dynamically
    const error = validateField(type, value, gender_allowed);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    dispatch(
      setUserTicket({
        index: index,
        type: type,
        value: value,
      })
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (hasErrors) {
      toast.info("Pastikan sudah isi data dengan benar");
      return;
    }
    var bodyData = {
      donation: 0,
      event_id: event?.slug,
      admin_fee: admin_fee,
      user_tickets: checkout,
      payment_method_id: payment_method?.id ?? "",
    };

    dispatch(postOrder(bodyData as CreateOrder))
      .unwrap()
      .then((res) => {
        const order = res as Order;
        router.replace(`/orders/${order.public_id}`);
      })
      .catch((error) => {
        // Handle errors here if needed
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div className="px-8">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal"></div>
          <div className="mb-5">
            <h1 className="font-semibold text-xl text-black">
              Detail Pemilik Tiket
            </h1>
            <p className="text-md text-black">
              Data diri untuk setiap pemilik tiket
            </p>
          </div>
          <div className="grid gap-4">
            {checkout.map((e, index) => (
              <div className="grid gap-4 mb-2 rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
                <div key={index} className="flex items-center gap-2 text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <h1 className="font-semibold text-lg text-black">
                    Pemesan {index + 1} ({e.ticket?.name ?? ""})
                  </h1>
                </div>
                <div>
                  <div className="flex items-center">
                    <button
                      name={`${index}_isUseAuth`}
                      type="button"
                      role="checkbox"
                      aria-checked={formData[`${index}_isUseAuth`]} // Reflect true/false state
                      value={
                        (formData[`${index}_isUseAuth`] as boolean) == false
                          ? "on"
                          : "off"
                      }
                      className={`hover:bg-violet3 flex size-[25px] appearance-none items-center justify-center rounded-[4px] border border-black bg-yellow-200 outline-none`}
                      id={`${index}_isUseAuth`}
                      onClick={setAsOrder} // Toggle the state correctly
                    >
                      {formData[`${index}_isUseAuth`] ? (
                        <span
                          data-state="checked"
                          className="flex items-center justify-center rounded-[4px] bg-black"
                          style={{ pointerEvents: "none" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="size-5 text-white"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      ) : (
                        <></>
                      )}
                    </button>

                    <input
                      className="absolute bg-yellow-200"
                      type="checkbox"
                      aria-hidden="true"
                      tabIndex={-1}
                      checked={formData[`${index}_isUseAuth`]}
                      style={{
                        transform: "translateX(-100%)",
                        pointerEvents: "none",
                        opacity: 0,
                        margin: "0px",
                        width: "25px",
                        height: "25px",
                      }}
                      readOnly // Make it readonly since the button controls it
                    />
                    <label
                      className="pl-[15px] text-md leading-none text-black"
                      htmlFor={`${index}_isUseAuth`}
                    >
                      Sama dengan pemesan
                    </label>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-lg text-black">Nama Lengkap</p>
                  <div className="flex flex-col">
                    <input
                      id={`${index}_name`}
                      placeholder="Nama Lengkap"
                      type="text"
                      className="py-3 px-4 w-full rounded-lg	border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg font-normal text-black placeholder-black flex items-center border-black bg-yellow-200"
                      name={`${index}_name`}
                      value={formData[`${index}_name`]}
                      onChange={handleChange}
                      readOnly={formData[`${index}_isUseAuth`]}
                    />
                    {formErrors[`${index}_name`] && (
                      <p className="mt-1 text-danger text-sm font-semibold">
                        {formErrors[`${index}_name`]}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-lg text-black">Email</p>
                  <div className="flex flex-col">
                    <input
                      id={`${index}_email`}
                      placeholder="Email"
                      type="text"
                      className="py-3 px-4 w-full rounded-lg	border border-solid h-[42px] focus-visible:border-primary-600 focus-visible:outline-none text-lg font-normal text-black placeholder-black flex items-center border-black bg-yellow-200"
                      name={`${index}_email`}
                      value={formData[`${index}_email`]}
                      onChange={handleChange}
                      readOnly={formData[`${index}_isUseAuth`]}
                    />
                    {formErrors[`${index}_email`] && (
                      <p className="mt-1 text-danger text-sm font-semibold">
                        {formErrors[`${index}_email`]}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-lg text-black">Jenis Kelamin</p>
                  <div
                    role="radiogroup"
                    aria-required="false"
                    dir="ltr"
                    className="focus-visible:border-primary-600 w-full items-center font-normal placeholder:text-black focus-visible:outline-none grid gap-4 rounded-lg border border-black px-2 py-3 text-sm bg-yellow-200"
                    aria-label="View density"
                    tabIndex={-1}
                    style={{ outline: "none" }}
                    data-disabled=""
                  >
                    <div className="flex cursor-pointer items-center">
                      <button
                        type="button"
                        role="radio"
                        aria-checked="true"
                        data-state="checked"
                        value="male"
                        className="hover:bg-violet3 size-[25px] rounded-full border border-black bg-yellow-300 outline-none focus:shadow-[0_0_0_2px]"
                        id={`${index}_gender`}
                        name={`${index}_gender`}
                        tabIndex={-1}
                        data-radix-collection-item=""
                        data-disabled=""
                        disabled={formData[`${index}_isUseAuth`]}
                        onClick={handleChange}
                      >
                        {formData[`${index}_gender`] == "male" ? (
                          <span
                            data-state="checked"
                            className="relative flex size-full items-center justify-center after:block after:size-[11px] after:rounded-[50%] after:bg-black after:content-['']"
                            data-disabled=""
                          ></span>
                        ) : (
                          <></>
                        )}
                      </button>
                      <input
                        type="radio"
                        aria-hidden="true"
                        tabIndex={-1}
                        value="male"
                        checked={formData[`${index}_gender`] == "male"}
                        style={{
                          transform: "translateX(-100%)",
                          position: "absolute",
                          pointerEvents: "none",
                          opacity: 0,
                          margin: "0px",
                          width: "25px",
                          height: "25px",
                        }}
                        disabled={formData[`${index}_isUseAuth`]}
                      />
                      <label
                        className="flex-1 cursor-pointer pl-2 text-sm leading-none text-black"
                        htmlFor={`${index}_male`}
                      >
                        Laki-laki
                      </label>
                    </div>
                    <div className="flex cursor-pointer items-center">
                      <button
                        type="button"
                        role="radio"
                        aria-checked="false"
                        data-state="unchecked"
                        value="female"
                        className="hover:bg-violet3 size-[25px] rounded-full border border-black bg-yellow-300 outline-none focus:shadow-[0_0_0_2px]"
                        id={`${index}_gender`}
                        name={`${index}_gender`}
                        tabIndex={-1}
                        data-radix-collection-item=""
                        disabled={formData[`${index}_isUseAuth`]}
                        onClick={handleChange}
                      >
                        {formData[`${index}_gender`] == "female" ? (
                          <span
                            data-state="checked"
                            className="relative flex size-full items-center justify-center after:block after:size-[11px] after:rounded-[50%] after:bg-black after:content-['']"
                            data-disabled=""
                          ></span>
                        ) : (
                          <></>
                        )}
                      </button>
                      <input
                        type="radio"
                        aria-hidden="true"
                        tabIndex={-1}
                        value="female"
                        checked={formData[`${index}_gender`] == "female"}
                        style={{
                          transform: "translateX(-100%)",
                          position: "absolute",
                          pointerEvents: "none",
                          opacity: 0,
                          margin: "0px",
                          width: "25px",
                          height: "25px",
                        }}
                        disabled={formData[`${index}_isUseAuth`]}
                      />
                      <label
                        className="flex-1 cursor-pointer pl-2 text-sm leading-none text-black"
                        htmlFor={`${index}_female`}
                      >
                        Perempuan
                      </label>
                    </div>
                  </div>
                  {formErrors[`${index}_gender`] && (
                    <p className="mt-1 text-danger text-sm font-semibold">
                      {formErrors[`${index}_gender`]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <CheckoutPaymentMethodCard />
        <CheckoutTicketsCard />
        <div className="grid space-y-2">
          <div className="gap-y-1 font-normal"></div>
          {isLoadingOrder ? (
            <div className="mt-10 mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          ) : (
            <button
              type="submit"
              className="grid w-full place-items-center rounded-lg border-2 border-black shadow-custom p-3 text-lg font-bold bg-primary text-white"
            >
              Konfirmasi Pembelian
            </button>
          )}
          <div className="mt-2"></div>
        </div>
      </form>
    </div>
  );
};

// Validation functions
const validateName = (name: string): string | undefined => {
  if (!name) {
    return "Nama tidak boleh kosong";
  }
  return "";
};

const validateGender = (
  gender: string,
  gender_allowed?: string
): string | undefined => {
  if (!gender) {
    return "Gender tidak boleh kosong";
  }
  if (gender != gender_allowed && gender_allowed != "both") {
    return `Tiket khusus untuk ${
      gender_allowed == "male" ? "Laki-laki" : "Perempuan"
    }`;
  }
  return "";
};

const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return "Email tidak boleh kosong";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Masukan email yang valid";
  }
  return "";
};

const validateField = (
  name: string,
  value: string,
  gender_allowed?: string
) => {
  switch (name) {
    case "name":
      return validateName(value);
    case "gender":
      return validateGender(value, gender_allowed);
    case "email":
      return validateEmail(value);
    default:
      return "";
  }
};
