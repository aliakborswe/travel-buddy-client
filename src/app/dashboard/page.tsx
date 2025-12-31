"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAppSelector } from "@/lib/redux/hooks";
import type { TravelPlan, ApiResponse, User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Plus,
  Crown,
  Star,
} from "lucide-react";

interface MatchResult {
  travelPlan: TravelPlan;
  user: User;
  matchScore: number;
  commonInterests: string[];
}

interface ReviewablePlan {
  travelPlan: TravelPlan;
  reviewableUsers: User[];
  totalParticipants: number;
  reviewedCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [upcomingPlans, setUpcomingPlans] = useState<TravelPlan[]>([]);
  const [completedPlans, setCompletedPlans] = useState<TravelPlan[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [reviewablePlans, setReviewablePlans] = useState<ReviewablePlan[]>([]);
  const [suggestedMatches, setSuggestedMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        apiClient.get(
          `${API_ENDPOINTS.TRAVEL_PLANS.ALL}?userId=${currentUser?._id}&joinedUserId=${currentUser?._id}&status=planning,active`,
          accessToken || undefined
        ),
        apiClient.get(
          `${API_ENDPOINTS.TRAVEL_PLANS.ALL}?userId=${currentUser?._id}&joinedUserId=${currentUser?._id}&status=completed&limit=5`,
          accessToken || undefined
        ),
        apiClient.get(
          `${API_ENDPOINTS.TRAVEL_PLANS.ALL}?userId=${currentUser?._id}&joinedUserId=${currentUser?._id}&status=completed&limit=1000`,
          accessToken || undefined
        ),
        apiClient.get(
          API_ENDPOINTS.MATCHING.SUGGESTED,
          accessToken || undefined
        ),
        apiClient.get(
          API_ENDPOINTS.REVIEWS.REVIEWABLE,
          accessToken || undefined
        ),
      ]);

      // Extract data from successful responses
      const [plansResult, completedResult, completedCountResult, matchesResult, reviewableResult] =
        results;

      if (plansResult.status === "fulfilled") {
        setUpcomingPlans((plansResult.value as ApiResponse<TravelPlan[]>).data);
      }

      if (completedResult.status === "fulfilled") {
        setCompletedPlans(
          (completedResult.value as ApiResponse<TravelPlan[]>).data
        );
      }

      if (completedCountResult.status === "fulfilled") {
        setCompletedCount(
          (completedCountResult.value as ApiResponse<TravelPlan[]>).data.length
        );
      }

      if (matchesResult.status === "fulfilled") {
        setSuggestedMatches(
          (matchesResult.value as ApiResponse<MatchResult[]>).data.slice(0, 3)
        );
      }

      if (reviewableResult.status === "fulfilled") {
        setReviewablePlans(
          (reviewableResult.value as ApiResponse<ReviewablePlan[]>).data.slice(
            0,
            3
          )
        );
      } else {
        console.error(
          "Failed to fetch reviewable plans:",
          reviewableResult.reason
        );
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?._id, accessToken]);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    fetchDashboardData();
  }, [currentUser, router, fetchDashboardData]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 py-8'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Welcome back, {currentUser?.fullName}!
          </h1>
          <p className='text-gray-600'>
            Here&apos;s what&apos;s happening with your travel plans
          </p>
        </div>

        {/* Premium Status */}
        {!currentUser?.isPremium && (
          <Card className='mb-6 bg-linear-to-r from-yellow-50 to-orange-50 border-yellow-200'>
            <CardContent className='flex items-center justify-between py-4'>
              <div className='flex items-center gap-3'>
                <Crown className='w-8 h-8 text-yellow-600' />
                <div>
                  <p className='font-semibold text-gray-900'>
                    Upgrade to Premium
                  </p>
                  <p className='text-sm text-gray-600'>
                    Get verified badge and unlock premium features
                  </p>
                </div>
              </div>
              <Button onClick={() => router.push("/premium")}>
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}

        <div className='grid lg:grid-cols-4 gap-6 mb-8'>
          {/* Stats Cards */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Active Plans
              </CardTitle>
              <MapPin className='w-4 h-4 text-blue-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {upcomingPlans.filter((p) => p.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Planning
              </CardTitle>
              <Calendar className='w-4 h-4 text-purple-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {upcomingPlans.filter((p) => p.status === "planning").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Completed
              </CardTitle>
              <CheckCircle className='w-4 h-4 text-green-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {completedCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                New Matches
              </CardTitle>
              <Users className='w-4 h-4 text-orange-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {suggestedMatches.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='grid lg:grid-cols-2 gap-6'>
          {/* Upcoming Plans */}
          <Card>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <CardTitle>Upcoming Travel Plans</CardTitle>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => router.push("/travel-plans/add")}
                >
                  <Plus className='w-4 h-4 mr-1' />
                  New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingPlans.length === 0 ? (
                <div className='text-center py-8'>
                  <Calendar className='w-12 h-12 text-gray-300 mx-auto mb-3' />
                  <p className='text-gray-500 text-sm mb-4'>
                    No upcoming travel plans
                  </p>
                  <Button
                    size='sm'
                    onClick={() => router.push("/travel-plans/add")}
                  >
                    Create Your First Plan
                  </Button>
                </div>
              ) : (
                <div className='space-y-3'>
                  {upcomingPlans.slice(0, 5).map((plan) => (
                    <div
                      key={plan._id}
                      className='flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
                      onClick={() => router.push(`/travel-plans/${plan._id}`)}
                    >
                      <div className='flex-1 min-w-0'>
                        <p className='font-semibold text-gray-900 truncate'>
                          {plan.destination.city}, {plan.destination.country}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {new Date(plan.startDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </p>
                      </div>
                      <Badge
                        variant={
                          plan.status === "active" ? "default" : "secondary"
                        }
                      >
                        {plan.status}
                      </Badge>
                    </div>
                  ))}
                  {upcomingPlans.length > 5 && (
                    <Button
                      variant='ghost'
                      className='w-full'
                      onClick={() => router.push("/travel-plans")}
                    >
                      View All Plans
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Suggested Matches */}
          <Card>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <CardTitle>Suggested Travel Buddies</CardTitle>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => router.push("/matching")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {suggestedMatches.length === 0 ? (
                <div className='text-center py-8'>
                  <Users className='w-12 h-12 text-gray-300 mx-auto mb-3' />
                  <p className='text-gray-500 text-sm mb-4'>
                    No matches yet. Add interests and create plans!
                  </p>
                  <Button
                    size='sm'
                    onClick={() => router.push("/profile/edit")}
                  >
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className='space-y-3'>
                  {suggestedMatches.map((match) => (
                    <div
                      key={match.travelPlan._id}
                      className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
                      onClick={() =>
                        router.push(`/travel-plans/${match.travelPlan._id}`)
                      }
                    >
                      <div className='shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold'>
                        {match.user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='font-semibold text-gray-900 text-sm truncate'>
                          {match.travelPlan.destination.city},{" "}
                          {match.travelPlan.destination.country}
                        </p>
                        <p className='text-xs text-gray-500'>
                          by {match.user.fullName}
                        </p>
                        {match.matchScore > 0 && (
                          <div className='flex items-center gap-1 mt-1'>
                            <TrendingUp className='w-3 h-3 text-green-600' />
                            <span className='text-xs text-green-600 font-semibold'>
                              {match.matchScore}% match
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Completed Plans with Reviews */}
        {(completedPlans.length > 0 || reviewablePlans.length > 0) && (
          <div className='grid lg:grid-cols-2 gap-6 mt-6'>
            {/* Completed Plans */}
            {completedPlans.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <CheckCircle className='w-5 h-5 text-green-600' />
                    Completed Travels
                  </CardTitle>
                  <CardDescription>
                    Your past travel experiences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {completedPlans.slice(0, 3).map((plan) => (
                      <div
                        key={plan._id}
                        className='flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
                        onClick={() => router.push(`/travel-plans/${plan._id}`)}
                      >
                        <div className='flex-1 min-w-0'>
                          <p className='font-semibold text-gray-900 truncate'>
                            {plan.destination.city}, {plan.destination.country}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {new Date(plan.endDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <Badge
                          variant='outline'
                          className='bg-green-50 text-green-700 border-green-200'
                        >
                          Completed
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviewable Plans */}
            {reviewablePlans.length > 0 && (
              <Card className='border-orange-200 bg-orange-50/30'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Star className='w-5 h-5 text-orange-600' />
                    Pending Reviews
                  </CardTitle>
                  <CardDescription>
                    Share your experience with travel buddies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {reviewablePlans.map((reviewable) => (
                      <div
                        key={reviewable.travelPlan._id}
                        className='p-3 rounded-lg bg-white border border-orange-200'
                      >
                        <div className='flex items-start justify-between mb-2'>
                          <div className='flex-1 min-w-0'>
                            <p className='font-semibold text-gray-900 truncate'>
                              {reviewable.travelPlan.destination.city},{" "}
                              {reviewable.travelPlan.destination.country}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {reviewable.reviewableUsers.length} traveler
                              {reviewable.reviewableUsers.length !== 1
                                ? "s"
                                : ""}{" "}
                              to review
                            </p>
                          </div>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          {reviewable.reviewableUsers
                            .slice(0, 2)
                            .map((user) => (
                              <Button
                                key={user._id}
                                size='sm'
                                variant='outline'
                                className='text-xs'
                                onClick={() =>
                                  router.push(
                                    `/travel-plans/${reviewable.travelPlan._id}?reviewUser=${user._id}`
                                  )
                                }
                              >
                                <Star className='w-3 h-3 mr-1' />
                                Review {user.fullName?.split(" ")[0]}
                              </Button>
                            ))}
                          {reviewable.reviewableUsers.length > 2 && (
                            <Button
                              size='sm'
                              variant='outline'
                              className='text-xs'
                              onClick={() =>
                                router.push(
                                  `/travel-plans/${reviewable.travelPlan._id}`
                                )
                              }
                            >
                              +{reviewable.reviewableUsers.length - 2} more
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
