import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Review, ApiResponse } from "@/lib/types";

interface ReviewsState {
  byUser: Record<string, { items: Review[]; averageRating?: number }>;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  byUser: {},
  loading: false,
  error: null,
};

export const fetchUserReviews = createAsyncThunk<
  { userId: string; items: Review[]; averageRating?: number },
  { userId: string },
  { rejectValue: string }
>("reviews/fetchUserReviews", async ({ userId }, { rejectWithValue }) => {
  try {
    const res: ApiResponse<Review[]> = await apiClient.get(
      API_ENDPOINTS.REVIEWS.BY_USER(userId)
    );
    return {
      userId,
      items: res.data,
      averageRating: res.meta?.averageRating,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch reviews";
    return rejectWithValue(msg);
  }
});

export const createReview = createAsyncThunk<
  Review,
  {
    travelPlanId: string;
    reviewerId: string;
    rating: number;
    comment?: string;
    token?: string;
  },
  { rejectValue: string }
>("reviews/createReview", async (payload, { rejectWithValue }) => {
  try {
    const res: ApiResponse<Review> = await apiClient.post(
      API_ENDPOINTS.REVIEWS.CREATE,
      payload,
      payload.token
    );
    return res.data as unknown as Review; // depending on API response shape
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to submit review";
    return rejectWithValue(msg);
  }
});

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserReviews.fulfilled,
        (
          state,
          action: PayloadAction<{
            userId: string;
            items: Review[];
            averageRating?: number;
          }>
        ) => {
          state.loading = false;
          state.byUser[action.payload.userId] = {
            items: action.payload.items,
            averageRating: action.payload.averageRating,
          };
        }
      )
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch reviews";
      })
      .addCase(createReview.fulfilled, () => {
        // no-op update; page usually refetches
      });
  },
});

export default reviewsSlice.reducer;
