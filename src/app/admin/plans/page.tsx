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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { showDeleteConfirm } from "@/lib/sweetalert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Search, MapPin } from "lucide-react";

export default function AdminPlansPage() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<TravelPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/");
      return;
    }

    fetchPlans();
  }, [currentUser, router]);

  const fetchPlans = async () => {
    try {
      const response: ApiResponse<TravelPlan[]> = await apiClient.get(
        API_ENDPOINTS.TRAVEL_PLANS.ALL,
        accessToken || undefined
      );
      setPlans(response.data);
      setFilteredPlans(response.data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = plans;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (plan) =>
          plan.destination.country
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          plan.destination.city
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((plan) => plan.status === statusFilter);
    }

    setFilteredPlans(filtered);
  }, [searchQuery, statusFilter, plans]);

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
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Travel Plans Management
          </h1>
          <p className='text-gray-600'>
            Manage all travel plans on the platform
          </p>
        </div>

        {/* Filters */}
        <Card className='mb-6'>
          <CardContent className='pt-6'>
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Search by destination...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Statuses</SelectItem>
                  <SelectItem value='planning'>Planning</SelectItem>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='completed'>Completed</SelectItem>
                  <SelectItem value='cancelled'>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className='grid md:grid-cols-4 gap-4 mb-6'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm text-gray-600'>
                Total Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{plans.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm text-gray-600'>Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {plans.filter((p) => p.status === "planning").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm text-gray-600'>Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {plans.filter((p) => p.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm text-gray-600'>Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {plans.filter((p) => p.status === "completed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plans Grid */}
        <Card>
          <CardHeader>
            <CardTitle>All Travel Plans</CardTitle>
            <CardDescription>
              {filteredPlans.length} plans found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPlans.length === 0 ? (
              <div className='text-center py-12'>
                <MapPin className='w-12 h-12 text-gray-300 mx-auto mb-3' />
                <p className='text-gray-500'>No travel plans found</p>
              </div>
            ) : (
              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filteredPlans.map((plan) => {
                  const user =
                    typeof plan.userId === "object" ? plan.userId : null;
                  return (
                    <Card
                      key={plan._id}
                      className='hover:shadow-md transition-shadow'
                    >
                      <CardHeader className='pb-3'>
                        <div className='flex justify-between items-start mb-2'>
                          <Badge
                            className={
                              plan.status === "active"
                                ? "bg-green-500"
                                : plan.status === "planning"
                                ? "bg-blue-500"
                                : plan.status === "completed"
                                ? "bg-gray-500"
                                : "bg-red-500"
                            }
                          >
                            {plan.status}
                          </Badge>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => deletePlan(plan._id)}
                          >
                            <Trash2 className='w-4 h-4 text-red-500' />
                          </Button>
                        </div>
                        <CardTitle className='text-lg'>
                          {plan.destination.city}, {plan.destination.country}
                        </CardTitle>
                        <CardDescription className='text-xs'>
                          by {user?.fullName || "Unknown User"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-2 text-sm text-gray-600'>
                          <p>
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
                          </p>
                          <p className='capitalize'>{plan.travelType} trip</p>
                          <p>{plan.currentTravelers.length} travelers joined</p>
                        </div>
                        <Button
                          size='sm'
                          variant='outline'
                          className='w-full mt-4'
                          onClick={() =>
                            router.push(`/travel-plans/${plan._id}`)
                          }
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
