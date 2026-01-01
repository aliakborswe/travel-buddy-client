"use client";

import { useEffect, useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { showDeleteConfirm } from "@/lib/sweetalert";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

export default function TravelPlansPage() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    fetchPlans();
  }, [currentUser, router]);

  const fetchPlans = async () => {
    try {
      const response: ApiResponse<TravelPlan[]> = await apiClient.get(
        `${API_ENDPOINTS.TRAVEL_PLANS.ALL}?userId=${currentUser?._id}&joinedUserId=${currentUser?._id}`,
        accessToken || undefined
      );
      setPlans(response.data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (id: string) => {
    const confirmed = await showDeleteConfirm("this travel plan");
    if (!confirmed) return;

    try {
      await apiClient.delete(
        API_ENDPOINTS.TRAVEL_PLANS.DELETE(id),
        accessToken || undefined
      );
      setPlans(plans.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Failed to delete plan:", error);
      toast("Failed to delete plan", "Please try again.", "error");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-blue-500";
      case "active":
        return "bg-green-500";
      case "completed":
        return "bg-gray-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
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
    <>
      <div className='min-h-screen bg-linear-to-b from-white to-gray-50 py-8'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl'>
          <div className='flex justify-between items-center mb-8'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                My Travel Plans
              </h1>
              <p className='text-gray-600 mt-1'>
                Manage your upcoming and past trips
              </p>
            </div>
            <Button onClick={() => router.push("/travel-plans/add")}>
              <Plus className='w-4 h-4 mr-2' />
              New Plan
            </Button>
          </div>

          {plans.length === 0 ? (
            <Card>
              <CardContent className='flex flex-col items-center justify-center py-16'>
                <MapPin className='w-16 h-16 text-gray-300 mb-4' />
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  No travel plans yet
                </h3>
                <p className='text-gray-600 mb-6 text-center max-w-md'>
                  Start planning your next adventure and find travel companions
                  along the way!
                </p>
                <Button onClick={() => router.push("/travel-plans/add")}>
                  <Plus className='w-4 h-4 mr-2' />
                  Create Your First Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {plans.map((plan) => {
                const user =
                  typeof plan.userId === "object" ? plan.userId : null;
                return (
                  <Card
                    key={plan._id}
                    className='hover:shadow-lg transition-shadow cursor-pointer'
                    onClick={() => router.push(`/travel-plans/${plan._id}`)}
                  >
                    <CardHeader>
                      <div className='flex justify-between items-start mb-2'>
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status}
                        </Badge>
                        <div className='flex gap-1'>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/travel-plans/${plan._id}/edit`);
                            }}
                          >
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePlan(plan._id);
                            }}
                          >
                            <Trash2 className='w-4 h-4 text-red-500' />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className='line-clamp-1'>
                        {plan.destination.city}, {plan.destination.country}
                      </CardTitle>
                      <CardDescription className='line-clamp-2'>
                        {plan.description || "No description"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-2 text-sm'>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <Calendar className='w-4 h-4' />
                          <span>
                            {new Date(plan.startDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}{" "}
                            -{" "}
                            {new Date(plan.endDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <DollarSign className='w-4 h-4' />
                          <span>
                            {plan.budgetRange.currency}{" "}
                            {plan.budgetRange.min.toLocaleString()} -{" "}
                            {plan.budgetRange.max.toLocaleString()}
                          </span>
                        </div>
                        <div className='flex items-center gap-2 text-gray-600'>
                          <Users className='w-4 h-4' />
                          <span className='capitalize'>{plan.travelType}</span>
                        </div>
                        {plan.interests && plan.interests.length > 0 && (
                          <div className='flex flex-wrap gap-1 mt-3'>
                            {plan.interests.slice(0, 3).map((interest) => (
                              <Badge
                                key={interest}
                                variant='outline'
                                className='text-xs'
                              >
                                {interest}
                              </Badge>
                            ))}
                            {plan.interests.length > 3 && (
                              <Badge variant='outline' className='text-xs'>
                                +{plan.interests.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
