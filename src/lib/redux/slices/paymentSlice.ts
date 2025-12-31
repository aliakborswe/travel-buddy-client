import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import type { ApiResponse } from "@/lib/types";

interface PaymentState {
  clientSecret: string | null;
  loading: boolean;
  error: string | null;
  lastStatus: "idle" | "intent-created" | "confirmed";
}

const initialState: PaymentState = {
  clientSecret: null,
  loading: false,
  error: null,
  lastStatus: "idle",
};

export const createPaymentIntent = createAsyncThunk<
  string,
  { subscriptionType: "monthly" | "yearly"; token?: string },
  { rejectValue: string }
>(
  "payment/createIntent",
  async ({ subscriptionType, token }, { rejectWithValue }) => {
    try {
      const res: ApiResponse<{ clientSecret: string }> = await apiClient.post(
        API_ENDPOINTS.PAYMENTS.CREATE_INTENT,
        { subscriptionType },
        token
      );
      return res.data.clientSecret;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to create intent";
      return rejectWithValue(msg);
    }
  }
);

export const confirmPayment = createAsyncThunk<
  void,
  { subscriptionType: "monthly" | "yearly"; token?: string },
  { rejectValue: string }
>(
  "payment/confirm",
  async ({ subscriptionType, token }, { rejectWithValue }) => {
    try {
      await apiClient.post(
        API_ENDPOINTS.PAYMENTS.CONFIRM,
        { subscriptionType },
        token
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to confirm payment";
      return rejectWithValue(msg);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPayment: (state) => {
      state.clientSecret = null;
      state.lastStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createPaymentIntent.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.clientSecret = action.payload;
          state.lastStatus = "intent-created";
        }
      )
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create intent";
      })
      .addCase(confirmPayment.fulfilled, (state) => {
        state.lastStatus = "confirmed";
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to confirm payment";
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
