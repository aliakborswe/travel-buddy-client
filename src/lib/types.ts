export interface User {
  _id: string;
  email: string;
  fullName: string;
  profileImage?: string;
  bio?: string;
  travelInterests: string[];
  visitedCountries: string[];
  currentLocation?: string;
  role: "user" | "admin";
  isPremium: boolean;
  isVerified: boolean;
  subscriptionEndDate?: string;
  completedTripsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TravelPlan {
  _id: string;
  userId: string | User;
  destination: {
    country: string;
    city: string;
  };
  startDate: string;
  endDate: string;
  budgetRange: {
    min: number;
    max: number;
    currency: string;
  };
  travelType: "solo" | "family" | "friends" | "couple";
  description?: string;
  itinerary?: string;
  maxTravelers?: number;
  currentTravelers: string[];
  joinedUser: string[];
  interests: string[];
  status: "planning" | "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  travelPlanId: string;
  reviewerId: string | User;
  reviewedUserId: string | User;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  userId: string;
  amount: number;
  currency: string;
  subscriptionType: "monthly" | "yearly";
  status: "pending" | "completed" | "failed" | "refunded";
  stripePaymentIntentId?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    averageRating?: number;
  };
}
