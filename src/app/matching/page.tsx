"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAppSelector } from "@/lib/redux/hooks";
import type { TravelPlan, User, ApiResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Heart, TrendingUp, Star } from "lucide-react";
import Image from "next/image";

interface MatchResult {
  travelPlan: TravelPlan;
  user: User;
  matchScore: number;
  commonInterests: string[];
}

export default function MatchingPage() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [suggestedMatches, setSuggestedMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    fetchSuggestedMatches();
  }, [currentUser, router]);

  const fetchSuggestedMatches = async () => {
    try {
      const response: ApiResponse<MatchResult[]> = await apiClient.get(
        API_ENDPOINTS.MATCHING.SUGGESTED,
        accessToken || undefined
      );
      setSuggestedMatches(response.data);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 py-8'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Find Your Travel Buddy
          </h1>
          <p className='text-gray-600'>
            Discover compatible travelers based on your interests and upcoming
            trips
          </p>
        </div>

        {/* Suggested Matches */}
        {suggestedMatches.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-16'>
              <Heart className='w-16 h-16 text-gray-300 mb-4' />
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                No matches yet
              </h3>
              <p className='text-gray-600 mb-6 text-center max-w-md'>
                Create travel plans and add interests to your profile to get
                personalized match suggestions!
              </p>
              <div className='flex gap-3'>
                <Button onClick={() => router.push("/travel-plans/add")}>
                  Create Travel Plan
                </Button>
                <Button
                  variant='outline'
                  onClick={() => router.push("/profile/edit")}
                >
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {suggestedMatches.map((match) => (
              <Card
                key={match.travelPlan._id}
                className='hover:shadow-lg transition-shadow cursor-pointer'
                onClick={() =>
                  router.push(`/travel-plans/${match.travelPlan._id}`)
                }
              >
                <CardContent className='p-6'>
                  <div className='flex gap-6 flex-wrap md:flex-nowrap'>
                    {/* User Avatar */}
                    <div className='flex-shrink-0'>
                      <div className='relative w-20 h-20 rounded-full overflow-hidden border-4 border-blue-100'>
                        {match.user.profileImage ? (
                          <Image
                            src={match.user.profileImage}
                            alt={match.user.fullName}
                            fill
                            className='object-cover'
                          />
                        ) : (
                          <div className='w-full h-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold'>
                            {match.user.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-2'>
                            <Badge
                              className={
                                match.travelPlan.status === "active"
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }
                            >
                              {match.travelPlan.status}
                            </Badge>
                            <Badge variant='outline' className='capitalize'>
                              {match.travelPlan.travelType}
                            </Badge>
                          </div>
                          <h3 className='text-xl font-semibold text-gray-900 mb-1'>
                            {match.travelPlan.destination.city},{" "}
                            {match.travelPlan.destination.country}
                          </h3>
                          <p className='text-gray-600 mb-2'>
                            by {match.user.fullName}
                          </p>
                        </div>

                        {match.matchScore > 0 && (
                          <div className='flex items-center gap-2 bg-linear-to-r from-green-50 to-blue-50 px-4 py-2 rounded-full'>
                            <TrendingUp className='w-5 h-5 text-green-600' />
                            <span className='font-bold text-green-600'>
                              {match.matchScore}% Match
                            </span>
                          </div>
                        )}
                      </div>

                      <div className='grid md:grid-cols-2 gap-3 mb-3'>
                        <div className='flex items-center gap-2 text-gray-600 text-sm'>
                          <Calendar className='w-4 h-4' />
                          <span>
                            {new Date(
                              match.travelPlan.startDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(
                              match.travelPlan.endDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <div className='flex items-center gap-2 text-gray-600 text-sm'>
                          <Users className='w-4 h-4' />
                          <span className='capitalize'>
                            {match.travelPlan.travelType} trip
                          </span>
                        </div>

                        {match.user.currentLocation && (
                          <div className='flex items-center gap-2 text-gray-600 text-sm'>
                            <MapPin className='w-4 h-4' />
                            <span>{match.user.currentLocation}</span>
                          </div>
                        )}
                      </div>

                      {match.travelPlan.description && (
                        <p className='text-gray-700 text-sm mb-3 line-clamp-2'>
                          {match.travelPlan.description}
                        </p>
                      )}

                      {match.commonInterests.length > 0 && (
                        <div>
                          <p className='text-xs text-gray-500 mb-2'>
                            Common interests:
                          </p>
                          <div className='flex flex-wrap gap-2'>
                            {match.commonInterests.map((interest) => (
                              <Badge
                                key={interest}
                                variant='secondary'
                                className='bg-green-100 text-green-700'
                              >
                                <Star className='w-3 h-3 mr-1' />
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className='flex items-center'>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/travel-plans/${match.travelPlan._id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Explore More */}
        <div className='mt-8 text-center'>
          <p className='text-gray-600 mb-4'>
            Want to discover more travel opportunities?
          </p>
          <Button variant='outline' onClick={() => router.push("/explore")}>
            Explore All Travel Plans
          </Button>
        </div>
      </div>
    </div>
  );
}
