import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  type ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import { User, ApiResponse } from "@/lib/types";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/constants";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Load initial state from localStorage
const loadAuthState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }

  try {
    const savedState = localStorage.getItem("authState");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      return {
        ...parsed,
        loading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error("Failed to load auth state:", error);
  }

  return {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

const initialState: AuthState = loadAuthState();

// Async thunks
export const register = createAsyncThunk<
  { user: User; accessToken: string },
  { email: string; password: string; fullName: string },
  { rejectValue: string }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    const result: ApiResponse<{ user: User; accessToken: string }> =
      await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || "Registration failed");
    }

    return result.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return rejectWithValue(message);
  }
});

export const login = createAsyncThunk<
  { user: User; accessToken: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result: ApiResponse<{ user: User; accessToken: string }> =
      await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || "Login failed");
    }

    return result.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return rejectWithValue(message);
  }
});

export const logout = createAsyncThunk<null, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
        method: "POST",
        credentials: "include",
      });
      return null;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Logout failed";
      return rejectWithValue(message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.ME}`, {
      credentials: "include",
    });

    const result: ApiResponse<User> = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message);
    }

    return result.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state: AuthState) => {
      state.error = null;
    },
    setUser: (state: AuthState, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "authState",
          JSON.stringify({
            user: state.user,
            accessToken: state.accessToken,
            isAuthenticated: state.isAuthenticated,
          })
        );
      }
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
    // Register
    builder.addCase(register.pending, (state: AuthState) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      register.fulfilled,
      (
        state: AuthState,
        action: PayloadAction<{ user: User; accessToken: string }>
      ) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        // Persist to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "authState",
            JSON.stringify({
              user: state.user,
              accessToken: state.accessToken,
              isAuthenticated: state.isAuthenticated,
            })
          );
        }
      }
    );
    builder.addCase(
      register.rejected,
      (state: AuthState, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload as string;
      }
    );

    // Login
    builder.addCase(login.pending, (state: AuthState) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      login.fulfilled,
      (
        state: AuthState,
        action: PayloadAction<{ user: User; accessToken: string }>
      ) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        // Persist to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "authState",
            JSON.stringify({
              user: state.user,
              accessToken: state.accessToken,
              isAuthenticated: state.isAuthenticated,
            })
          );
        }
      }
    );
    builder.addCase(
      login.rejected,
      (state: AuthState, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload as string;
      }
    );

    // Logout
    builder.addCase(logout.fulfilled, (state: AuthState) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      // Clear from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("authState");
      }
    });

    // Fetch Current User
    builder.addCase(
      fetchCurrentUser.fulfilled,
      (state: AuthState, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        // Persist to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "authState",
            JSON.stringify({
              user: state.user,
              accessToken: state.accessToken,
              isAuthenticated: state.isAuthenticated,
            })
          );
        }
      }
    );
    builder.addCase(fetchCurrentUser.rejected, (state: AuthState) => {
      state.user = null;
      state.isAuthenticated = false;
      // Clear from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("authState");
      }
    });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
