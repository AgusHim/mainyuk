import { configureStore } from '@reduxjs/toolkit'
import divisiSlice from './slices/divisiSlice'
import counterSlice from './slices/counterSlice'
import eventSlice from './slices/eventSlice'
import presenceSlice from './slices/presenceSlice'
import authSlice from './slices/authSlice'
import eventRegisterSlice from './slices/eventRegisterSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth:authSlice,
      divisi:divisiSlice,
      counter:counterSlice,
      event:eventSlice,
      eventRegister:eventRegisterSlice,
      presence:presenceSlice
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']