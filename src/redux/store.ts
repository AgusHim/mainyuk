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
import pollSlice from "./slices/pollSlice";
import communitySlice from "./slices/communitySlice";
import gamificationSlice from "./slices/gamificationSlice";
import missionSlice from "./slices/missionSlice";
import fundraisingSlice from "./slices/fundraisingSlice";
import campaignAdminSlice from "./slices/campaignAdminSlice";
import threadSlice from "./slices/threadSlice";
import moderationSlice from "./slices/moderationSlice";
import shopSlice from "./slices/shopSlice";
import shopAdminSlice from "./slices/shopAdminSlice";
import metricsSlice from "./slices/metricsSlice";
import userAdminSlice from "./slices/userAdminSlice";

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
      poll: pollSlice,
      community: communitySlice,
      gamification: gamificationSlice,
      mission: missionSlice,
      fundraising: fundraisingSlice,
      campaignAdmin: campaignAdminSlice,
      thread: threadSlice,
      moderation: moderationSlice,
      shop: shopSlice,
      shopAdmin: shopAdminSlice,
      metrics: metricsSlice,
      userAdmin: userAdminSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
