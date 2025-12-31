import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import type { TravelPlan, ApiResponse } from "@/lib/types";

interface PlansState {
  items: TravelPlan[];
  byId: Record<string, TravelPlan>;
  loading: boolean;
  error: string | null;
}

const initialState: PlansState = {
  items: [],
  byId: {},
  loading: false,
  error: null,
};

export const fetchUserPlans = createAsyncThunk<
  TravelPlan[],
  { userId: string; token?: string },
  { rejectValue: string }
>("plans/fetchUserPlans", async ({ userId, token }, { rejectWithValue }) => {
  try {
    const res: ApiResponse<TravelPlan[]> = await apiClient.get(
      `${API_ENDPOINTS.TRAVEL_PLANS.ALL}?userId=${userId}`,
      token
    );
    return res.data;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch plans";
    return rejectWithValue(msg);
  }
});

export const fetchPlan = createAsyncThunk<
  TravelPlan,
  { id: string; token?: string },
  { rejectValue: string }
>("plans/fetchPlan", async ({ id, token }, { rejectWithValue }) => {
  try {
    const res: ApiResponse<TravelPlan> = await apiClient.get(
      API_ENDPOINTS.TRAVEL_PLANS.GET(id),
      token
    );
    return res.data;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch plan";
    return rejectWithValue(msg);
  }
});

export const deletePlan = createAsyncThunk<
  string,
  { id: string; token?: string },
  { rejectValue: string }
>("plans/deletePlan", async ({ id, token }, { rejectWithValue }) => {
  try {
    await apiClient.delete(API_ENDPOINTS.TRAVEL_PLANS.DELETE(id), token);
    return id;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to delete plan";
    return rejectWithValue(msg);
  }
});

const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserPlans.fulfilled,
        (state, action: PayloadAction<TravelPlan[]>) => {
          state.loading = false;
          state.items = action.payload;
          action.payload.forEach((p) => {
            state.byId[p._id] = p;
          });
        }
      )
      .addCase(fetchUserPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch plans";
      })
      .addCase(fetchPlan.fulfilled, (state, action) => {
        const plan = action.payload;
        state.byId[plan._id] = plan;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((p) => p._id !== id);
        delete state.byId[id];
      });
  },
});

export default plansSlice.reducer;
