// API base URL
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh-token",
  },
  USERS: {
    ME: "/users/me",
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    ALL: "/users",
  },
  TRAVEL_PLANS: {
    CREATE: "/travel-plans",
    ALL: "/travel-plans",
    SEARCH: "/travel-plans/search",
    GET: (id: string) => `/travel-plans/${id}`,
    UPDATE: (id: string) => `/travel-plans/${id}`,
    DELETE: (id: string) => `/travel-plans/${id}`,
    JOIN: (id: string) => `/travel-plans/${id}/join`,
  },
  REVIEWS: {
    CREATE: "/reviews",
    BY_USER: (userId: string) => `/reviews/user/${userId}`,
    BY_TRAVEL_PLAN: (travelPlanId: string) =>
      `/reviews/travel-plan/${travelPlanId}`,
    UPDATE: (id: string) => `/reviews/${id}`,
    DELETE: (id: string) => `/reviews/${id}`,
    REVIEWABLE: "/reviews/reviewable",
  },
  PAYMENTS: {
    CREATE_INTENT: "/payments/create-intent",
    CONFIRM: "/payments/confirm",
    HISTORY: "/payments/history",
    WEBHOOK: "/payments/webhook",
  },
  MATCHING: {
    FIND: "/matching",
    SUGGESTED: "/matching/suggested",
  },
};

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    name: "Monthly Premium",
    price: 9.99,
    duration: "month",
    features: [
      "Unlimited travel plans",
      "Verified badge",
      "Priority matching",
      "Advanced search filters",
      "Message other travelers",
    ],
  },
  YEARLY: {
    name: "Yearly Premium",
    price: 99.99,
    duration: "year",
    features: [
      "All monthly features",
      "2 months free",
      "Early access to new features",
      "Premium support",
      "Custom profile badge",
    ],
  },
};
