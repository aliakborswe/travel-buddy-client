import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import plansReducer from "./slices/plansSlice";
import reviewsReducer from "./slices/reviewsSlice";
import paymentReducer from "./slices/paymentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    plans: plansReducer,
    reviews: reviewsReducer,
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
