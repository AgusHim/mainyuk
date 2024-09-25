import { configureStore } from "@reduxjs/toolkit";

import counterSlice from "./slices/counterSlice";
import eventSlice from "./slices/eventSlice";
import presenceSlice from "./slices/presenceSlice";
import authSlice from "./slices/authSlice";
import eventRegisterSlice from "./slices/eventRegisterSlice";
import qnaSlice from "./slices/qnaSlice";
import likeSlice from "./slices/likeSlice";
import feedbackSlice from "./slices/feedbackSlice";
import agendaSlice from "./slices/agendaSlice";
import rangerSlice from "./slices/rangerSlice";
import divisiSlice from "./slices/divisiSlice";
import rangerPresenceSlice from "./slices/rangerPresenceSlice";
import orderSlice from "./slices/orderSlice";
import ticketSlice from "./slices/ticketSlice";
import paymentMethodSlice from "./slices/PaymentMethodSlice";
import regionSlice from "./slices/RegionSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      divisi: divisiSlice,
      counter: counterSlice,
      event: eventSlice,
      eventRegister: eventRegisterSlice,
      presences: presenceSlice,
      qna: qnaSlice,
      like: likeSlice,
      feedback: feedbackSlice,
      agenda: agendaSlice,
      ranger: rangerSlice,
      rangerPresence: rangerPresenceSlice,
      order: orderSlice,
      ticket: ticketSlice,
      paymentMethod: paymentMethodSlice,
      region: regionSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
