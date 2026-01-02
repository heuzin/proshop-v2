import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice.ts";
import cartSliceReducer from "./slices/cartSlice.ts";
import authSliceReducer from "./slices/authSlice.ts";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
