/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAppSelector } from "@/lib/redux/hooks";
import type { User, ApiResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Calendar, Globe, Edit, CheckCircle } from "lucide-react";
import Image from "next/image";
import ReviewsList from "@/components/reviews/ReviewsList";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?._id === params.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes] = (await Promise.all([
          apiClient.get(API_ENDPOINTS.USERS.GET(params.id as string)),
          apiClient.get(API_ENDPOINTS.REVIEWS.BY_USER(params.id as string)),
        ])) as [ApiResponse<User>, ApiResponse<any>];

        setUser(userRes.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.id]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500'>User not found</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 py-8'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl'>
        {/* Profile Header */}
        <Card className='mb-8'>
          <CardContent className='pt-6'>
            <div className='flex flex-col md:flex-row gap-6'>
              {/* Avatar */}
              <div className='shrink-0'>
                <div className='relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100'>
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={user.fullName}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='w-full h-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold'>
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className='flex-1'>
                <div className='flex items-start justify-between flex-wrap gap-4'>
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <h1 className='text-3xl font-bold text-gray-900'>
                        {user.fullName}
                      </h1>
                      {user.isPremium && (
                        <Badge className='bg-linear-to-r from-yellow-400 to-orange-500 text-white'>
                          <CheckCircle className='w-3 h-3 mr-1' />
                          Premium
                        </Badge>
                      )}
                      {user.isVerified && (
                        <Badge variant='secondary'>
                          <CheckCircle className='w-3 h-3 mr-1' />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className='flex items-center gap-2 text-gray-600 mb-2'>
                      <Mail className='w-4 h-4' />
                      <span>{user.email}</span>
                    </div>

                    {user.currentLocation && (
                      <div className='flex items-center gap-2 text-gray-600 mb-2'>
                        <MapPin className='w-4 h-4' />
                        <span>{user.currentLocation}</span>
                      </div>
                    )}
                  </div>

                  {isOwnProfile && (
                    <Button onClick={() => router.push("/profile/edit")}>
                      <Edit className='w-4 h-4 mr-2' />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {user.bio && (
                  <p className='mt-4 text-gray-700 leading-relaxed'>
                    {user.bio}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Travel Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Travel Interests</CardTitle>
              <CardDescription>
                What {isOwnProfile ? "you" : user.fullName} loves to do while
                traveling
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.travelInterests.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {user.travelInterests.map((interest) => (
                    <Badge key={interest} variant='outline'>
                      {interest}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className='text-gray-500 text-sm'>No interests added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Visited Countries */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Globe className='w-5 h-5' />
                Visited Countries
              </CardTitle>
              <CardDescription>
                {user.visitedCountries.length} countries explored
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.visitedCountries.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {user.visitedCountries.map((country) => (
                    <Badge key={country} variant='secondary'>
                      {country}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className='text-gray-500 text-sm'>No countries added yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <div className='mt-8'>
          <ReviewsList userId={params.id as string} />
        </div>

        {/* Member Since */}
        <div className='mt-8 text-center text-gray-500 text-sm flex items-center justify-center gap-2'>
          <Calendar className='w-4 h-4' />
          Member since{" "}
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
