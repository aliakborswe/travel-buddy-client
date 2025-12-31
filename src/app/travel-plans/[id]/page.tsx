/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  DollarSign,
  Users,
  Edit,
  UserPlus,
  Mail,
  CheckCircle,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { useToast } from "@/components/ui/use-toast";

export default function TravelPlanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { toast } = useToast();
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [participants, setParticipants] = useState<User[]>([]);
  const [existingReviews, setExistingReviews] = useState<any[]>([]);

  console.log(existingReviews)

  useEffect(() => {
    fetchPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchPlan = async () => {
    try {
      const response: ApiResponse<TravelPlan> = await apiClient.get(
        API_ENDPOINTS.TRAVEL_PLANS.GET(params.id as string)
      );
      setPlan(response.data);

      // If plan is completed, fetch all participants
      if (response.data.status === "completed") {
        const allParticipants: User[] = [];

        // Add host
        if (typeof response.data.userId === "object") {
          allParticipants.push(response.data.userId);
        }

        // Add travelers
        if (
          response.data.currentTravelers &&
          response.data.currentTravelers.length > 0
        ) {
          // Fetch traveler details if they're just IDs
          const travelerIds = response.data.currentTravelers.filter(
            (id) => typeof id === "string"
          );

          if (travelerIds.length > 0) {
            try {
              const travelerPromises = travelerIds.map((id) =>
                apiClient.get(API_ENDPOINTS.USERS.GET(id as string))
              );
              const travelerResponses = (await Promise.all(
                travelerPromises
              )) as ApiResponse<User>[];
              travelerResponses.forEach((res) => {
                if (res.data) allParticipants.push(res.data);
              });
            } catch (err) {
              console.error("Failed to fetch travelers:", err);
            }
          }

          // Add travelers who are already objects
          response.data.currentTravelers.forEach((traveler) => {
            if (typeof traveler === "object" && "_id" in traveler) {
              allParticipants.push(traveler as User);
            }
          });
        }

        setParticipants(allParticipants);

        // Fetch existing reviews for this travel plan
        try {
          const reviewsRes = (await apiClient.get(
            API_ENDPOINTS.REVIEWS.BY_TRAVEL_PLAN(response.data._id)
          )) as ApiResponse<any[]>;
          const reviewsData = reviewsRes.data || [];
          setExistingReviews(Array.isArray(reviewsData) ? reviewsData : []);
        } catch (err) {
          console.error("Failed to fetch reviews:", err);
          setExistingReviews([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    setJoining(true);
    try {
      await apiClient.post(
        API_ENDPOINTS.TRAVEL_PLANS.JOIN(params.id as string),
        {},
        accessToken || undefined
      );
      toast("Join request sent", "The host has been notified.", "success");
      fetchPlan(); // Refresh plan data
    } catch (error) {
      console.error("Failed to send join request:", error);
      toast("Failed to send join request", "Please try again.", "error");
    } finally {
      setJoining(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await apiClient.delete(
        API_ENDPOINTS.REVIEWS.DELETE(reviewId),
        accessToken || undefined
      );
      toast("Review deleted successfully", undefined, "success");
      fetchPlan(); // Refresh plan data
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast("Failed to delete review", "Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500'>Travel plan not found</p>
      </div>
    );
  }

  const host = typeof plan.userId === "object" ? plan.userId : null;
  const isOwner =
    currentUser?._id ===
    (typeof plan.userId === "string" ? plan.userId : plan.userId._id);
  const hasJoined = plan.currentTravelers.includes(currentUser?._id || "");

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 py-8'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl'>
        {/* Header */}
        <Card className='mb-6'>
          <CardHeader>
            <div className='flex justify-between items-start flex-wrap gap-4'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <Badge
                    className={
                      plan.status === "active"
                        ? "bg-green-500"
                        : plan.status === "planning"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }
                  >
                    {plan.status}
                  </Badge>
                  <Badge variant='outline' className='capitalize'>
                    {plan.travelType}
                  </Badge>
                </div>
                <CardTitle className='text-3xl mb-2'>
                  {plan.destination.city}, {plan.destination.country}
                </CardTitle>
                <CardDescription className='text-base'>
                  {plan.description || "No description provided"}
                </CardDescription>
              </div>

              {isOwner ? (
                <Button
                  onClick={() => router.push(`/travel-plans/${plan._id}/edit`)}
                >
                  <Edit className='w-4 h-4 mr-2' />
                  Edit
                </Button>
              ) : (
                <Button
                  onClick={handleJoinRequest}
                  disabled={joining || hasJoined}
                >
                  {hasJoined ? (
                    <>
                      <CheckCircle className='w-4 h-4 mr-2' />
                      Joined
                    </>
                  ) : (
                    <>
                      <UserPlus className='w-4 h-4 mr-2' />
                      {joining ? "Sending..." : "Request to Join"}
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='flex items-center gap-3 text-gray-700'>
                <Calendar className='w-5 h-5 text-blue-500' />
                <div>
                  <p className='text-sm text-gray-500'>Travel Dates</p>
                  <p className='font-medium'>
                    {new Date(plan.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(plan.endDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 text-gray-700'>
                <DollarSign className='w-5 h-5 text-green-500' />
                <div>
                  <p className='text-sm text-gray-500'>Budget Range</p>
                  <p className='font-medium'>
                    {plan.budgetRange.currency}{" "}
                    {plan.budgetRange.min.toLocaleString()} -{" "}
                    {plan.budgetRange.max.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 text-gray-700'>
                <Users className='w-5 h-5 text-purple-500' />
                <div>
                  <p className='text-sm text-gray-500'>Travelers</p>
                  <p className='font-medium'>
                    {plan.currentTravelers.length}
                    {plan.maxTravelers ? ` / ${plan.maxTravelers}` : ""} joined
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='grid md:grid-cols-3 gap-6'>
          <div className='md:col-span-2 space-y-6'>
            {/* Itinerary */}
            {plan.itinerary && (
              <Card>
                <CardHeader>
                  <CardTitle>Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className='whitespace-pre-wrap text-gray-700 font-sans'>
                    {plan.itinerary}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Interests */}
            {plan.interests && plan.interests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Trip Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {plan.interests.map((interest) => (
                      <Badge key={interest} variant='outline'>
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completed Plan - All Participants Reviews */}
            {plan.status === "completed" &&
              participants.length > 0 &&
              currentUser &&
              participants.some((p) => p._id === currentUser._id) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Travel Buddy Reviews</CardTitle>
                    <CardDescription>
                      Review your travel companions from this completed trip
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    {participants
                      .filter(
                        (participant) => participant._id !== currentUser?._id
                      )
                      .map((participant) => {
                        // Find existing review for this participant
                        const existingReview = existingReviews.find(
                          (r) =>
                            (typeof r.reviewerId === "string"
                              ? r.reviewerId
                              : r.reviewerId?._id) === currentUser._id &&
                            (typeof r.reviewedUserId === "string"
                              ? r.reviewedUserId
                              : r.reviewedUserId?._id) === participant._id
                        );

                        return (
                          <div
                            key={participant._id}
                            className='border-b last:border-0 pb-6 last:pb-0'
                          >
                            <div className='flex items-center gap-3 mb-4'>
                              <div className='relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200'>
                                {participant.profileImage ? (
                                  <Image
                                    src={participant.profileImage}
                                    alt={participant.fullName}
                                    fill
                                    className='object-cover'
                                  />
                                ) : (
                                  <div className='w-full h-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold'>
                                    {participant.fullName
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className='flex-1'>
                                <p className='font-semibold text-gray-900'>
                                  {participant.fullName}
                                </p>
                                {participant.currentLocation && (
                                  <p className='text-sm text-gray-500'>
                                    {participant.currentLocation}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Show existing review or form to create one */}
                            {existingReview ? (
                              <div className='bg-gray-50 p-4 rounded-lg'>
                                <div className='flex items-start justify-between mb-2'>
                                  <div className='flex items-center gap-1'>
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < existingReview.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <div className='flex gap-2'>
                                    <ReviewForm
                                      travelPlanId={plan._id}
                                      reviewedUserId={participant._id}
                                      reviewedUserName={participant.fullName}
                                      existingReviewId={existingReview._id}
                                      existingRating={existingReview.rating}
                                      existingComment={existingReview.comment}
                                      onSuccess={() => {
                                        fetchPlan();
                                      }}
                                    />
                                    <Button
                                      size='sm'
                                      variant='ghost'
                                      onClick={() =>
                                        handleDeleteReview(existingReview._id)
                                      }
                                    >
                                      <Trash2 className='w-4 h-4 text-red-500' />
                                    </Button>
                                  </div>
                                </div>
                                {existingReview.comment && (
                                  <p className='text-gray-700 text-sm mt-2'>
                                    {existingReview.comment}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className='mt-4'>
                                <ReviewForm
                                  travelPlanId={plan._id}
                                  reviewedUserId={participant._id}
                                  reviewedUserName={participant.fullName}
                                  onSuccess={() => {
                                    fetchPlan();
                                  }}
                                />
                              </div>
                            )}

                            {existingReviews
                              .filter(
                                (review: any) =>
                                  // Access ._id because reviewerId is an object in your data
                                  review.reviewerId._id !== currentUser._id
                              )
                              .map(({ _id, rating, comment }: any) => (
                                <div
                                  key={_id}
                                  className='bg-gray-50 p-4 rounded-lg mt-4'
                                >
                                  <div className='flex items-start justify-between mb-2'>
                                    <div className='flex items-center gap-1'>
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < rating
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className='text-gray-700 text-sm mt-2'>
                                    {comment}
                                  </p>
                                </div>
                              ))}
                          </div>
                        );
                      })}
                  </CardContent>
                </Card>
              )}
          </div>

          {/* Host Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Hosted by</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className='cursor-pointer hover:bg-gray-50 p-3 rounded-lg -m-3 transition-colors'
                  onClick={() =>
                    router.push(`/profile/${host?._id || plan.userId}`)
                  }
                >
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200'>
                      {host?.profileImage ? (
                        <Image
                          src={host.profileImage}
                          alt={host.fullName}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='w-full h-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold'>
                          {host?.fullName?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className='font-semibold text-gray-900 flex items-center gap-1'>
                        {host?.fullName || "User"}
                        {host?.isPremium && (
                          <CheckCircle className='w-4 h-4 text-yellow-500' />
                        )}
                      </p>
                      {host?.currentLocation && (
                        <p className='text-sm text-gray-500 flex items-center gap-1'>
                          <MapPin className='w-3 h-3' />
                          {host.currentLocation}
                        </p>
                      )}
                    </div>
                  </div>

                  {host?.bio && (
                    <p className='text-sm text-gray-600 mb-3'>{host.bio}</p>
                  )}

                  {host?.travelInterests && host.travelInterests.length > 0 && (
                    <div>
                      <p className='text-xs text-gray-500 mb-2'>Interests</p>
                      <div className='flex flex-wrap gap-1'>
                        {host.travelInterests.slice(0, 5).map((interest) => (
                          <Badge
                            key={interest}
                            variant='secondary'
                            className='text-xs'
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!isOwner && host?.email && (
                  <Button
                    variant='outline'
                    className='w-full mt-4'
                    onClick={() =>
                      (window.location.href = `mailto:${host.email}`)
                    }
                  >
                    <Mail className='w-4 h-4 mr-2' />
                    Contact Host
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
