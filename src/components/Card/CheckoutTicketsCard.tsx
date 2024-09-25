"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

const CheckoutTicketsCard = () => {
  const dispatch = useAppDispatch();
  const checkout = useAppSelector((state) => state.order.checkout);
  const payment_method = useAppSelector((state) => state.order.payment_method);
  const admin_fee = useAppSelector((state) => state.order.admin_fee);
  const error = useAppSelector((state) => state.event.error);
  // Get Unique tickets by ticket_id
  const uniqueTicketIds = Array.from(
    new Set(checkout.map((ticket) => ticket.ticket_id))
  );

  const totalPayment = () => {
    let total = 0;
    for (let index in checkout) {
      const ticket = checkout[index];
      total = total + (ticket.ticket?.price ?? 0);
    }
    return total + admin_fee;
  };

  return (
    <div className="grid space-y-2">
      <div className="gap-y-1 font-normal"></div>
      <div>
        <h1 className="font-semibold text-xl text-black mb-2">
          Rincian Pembayaran
        </h1>
        <div className="mb-4 rounded-xl border-2 border-black bg-yellow-300 p-4 shadow-custom">
          <div className="grid gap-2 text-sm">
            {uniqueTicketIds.map((ticket_id, index) => {
              const filteredTickets = checkout.filter(
                (ticket) => ticket.ticket_id === ticket_id
              );
              return (
                <div
                  key={index}
                  className="grid grid-cols-3 items-center gap-4"
                >
                  <p className="col-span-2 text-lg text-black">
                    <span>{filteredTickets.length}</span>
                    <span className="mx-1">x</span>
                    {filteredTickets[0].ticket?.name ?? ""}
                  </p>
                  <p className="col-span-1 text-right text-lg text-black">
                    {(
                      filteredTickets.length * (filteredTickets[0].ticket?.price ?? 0)
                    ).toLocaleString("id-ID")}
                  </p>
                </div>
              );
            })}
            {payment_method != null && admin_fee != 0 ? (
              <div className="grid grid-cols-3 items-center gap-4">
                <p className="col-span-2 text-lg text-black">
                  {payment_method?.type === "BANK"
                    ? "Kode Unik"
                    : "Biaya Payment Gateway"}
                </p>
                <p className="col-span-1 text-right text-lg text-black">
                  {admin_fee.toLocaleString("id-ID")}
                </p>
              </div>
            ) : (
              <></>
            )}
            <hr className="border-b border-[0.5px] border-black" />
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-xl font-bold text-black">Total Bayar</h1>
              <p className="text-xl font-bold text-black">
                Rp {totalPayment().toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutTicketsCard;
