"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import type { TravelPlan, ApiResponse, User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Search, Users } from "lucide-react";

type SearchResult = {
  travelPlans: (TravelPlan & {
    userId: string | Pick<User, "fullName" | "profileImage" | "email">;
  })[];
  pagination: { page: number; limit: number; total: number; totalPage: number };
};

function ExploreContent() {
  const router = useRouter();
  const qp = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult | null>(null);

  const [form, setForm] = useState({
    destination: qp.get("destination") ?? "",
    startDate: qp.get("startDate") ?? "",
    endDate: qp.get("endDate") ?? "",
    travelType: qp.get("travelType") ?? "",
    interests: qp.get("interests") ?? "",
    page: Number(qp.get("page") ?? 1),
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (form.destination) params.set("destination", form.destination);
    if (form.startDate) params.set("startDate", form.startDate);
    if (form.endDate) params.set("endDate", form.endDate);
    if (form.travelType) params.set("travelType", form.travelType);
    if (form.interests) params.set("interests", form.interests);
    if (form.page) params.set("page", String(form.page));
    params.set("limit", "9");
    return params.toString();
  }, [form]);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: ApiResponse<SearchResult["travelPlans"]> =
        await apiClient.get(
          `${API_ENDPOINTS.TRAVEL_PLANS.SEARCH}?${queryString}`
        );
      setResults({ travelPlans: data.data, pagination: data.meta as any });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to fetch";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    router.replace(`/explore?${queryString}`);
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForm((s) => ({ ...s, page: 1 }));
  };

  const changePage = (delta: number) => {
    setForm((s) => ({ ...s, page: Math.max(1, s.page + delta) }));
  };

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 py-10'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center mb-8'>
          <h1 className='text-3xl sm:text-4xl font-bold tracking-tight text-gray-900'>
            Explore Travel Plans
          </h1>
          <p className='mt-2 text-gray-600'>
            Filter by destination, dates, type, and interests to find your
            match.
          </p>
        </div>

        <Card className='mb-8'>
          <form onSubmit={onSubmit}>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Search className='h-5 w-5 text-blue-600' />
                Search Filters
              </CardTitle>
              <CardDescription>
                Enter a destination (city/country), optional dates, and
                preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4 sm:grid-cols-2 lg:grid-cols-6'>
              <div className='lg:col-span-2'>
                <Label htmlFor='destination'>Destination</Label>
                <Input
                  id='destination'
                  placeholder='e.g., Japan or Tokyo'
                  value={form.destination}
                  onChange={(e) =>
                    setForm({ ...form, destination: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor='startDate'>Start date</Label>
                <Input
                  id='startDate'
                  type='date'
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor='endDate'>End date</Label>
                <Input
                  id='endDate'
                  type='date'
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor='travelType'>Travel type</Label>
                <select
                  id='travelType'
                  className='w-full h-10 rounded-md border px-3 text-sm'
                  value={form.travelType}
                  onChange={(e) =>
                    setForm({ ...form, travelType: e.target.value })
                  }
                >
                  <option value=''>Any</option>
                  <option value='solo'>Solo</option>
                  <option value='family'>Family</option>
                  <option value='friends'>Friends</option>
                  <option value='couple'>Couple</option>
                </select>
              </div>
              <div className='lg:col-span-1'>
                <Label htmlFor='interests'>Interests (comma)</Label>
                <Input
                  id='interests'
                  placeholder='hiking, food'
                  value={form.interests}
                  onChange={(e) =>
                    setForm({ ...form, interests: e.target.value })
                  }
                />
              </div>
              <div className='flex items-end lg:col-span-1'>
                <Button type='submit' className='w-full'>
                  Apply
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>

        {error && (
          <div className='mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
            {error}
          </div>
        )}

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={`skeleton-${i}`} className='h-48 animate-pulse' />
            ))}

          {!loading && results?.travelPlans?.length === 0 && (
            <div className='col-span-full text-center text-gray-600'>
              No travel plans found. Try different filters.
            </div>
          )}

          {!loading &&
            results?.travelPlans?.map((plan) => {
              const owner =
                typeof plan.userId === "string" ? undefined : plan.userId;
              return (
                <Card key={plan._id}>
                  <CardHeader>
                    <div className='flex items-center justify-between mb-2'>
                      <Badge
                        className={
                          plan.status === "active"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }
                      >
                        {plan.status}
                      </Badge>
                    </div>
                    <CardTitle className='flex items-center gap-2'>
                      <MapPin className='h-5 w-5 text-red-500' />
                      {plan.destination.city}, {plan.destination.country}
                    </CardTitle>
                    <CardDescription className='flex items-center gap-4 text-gray-600'>
                      <span className='flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
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
                      </span>
                      <span className='flex items-center gap-1'>
                        <Users className='h-4 w-4' />
                        {plan.currentTravelers?.length ?? 1}
                        {plan.maxTravelers ? `/${plan.maxTravelers}` : ""}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='text-sm text-gray-700'>
                    <div className='mb-2 line-clamp-2'>
                      {plan.description ||
                        "Looking for companions to join this adventure."}
                    </div>
                    {owner && (
                      <div className='text-xs text-gray-500'>
                        By {owner.fullName}
                      </div>
                    )}
                    <div className='mt-4 flex items-center gap-2'>
                      <Button asChild size='sm'>
                        <a href={`/travel-plans/${plan._id}`}>View details</a>
                      </Button>
                      <Button variant='outline' size='sm' asChild>
                        <a
                          href={`/profile/${
                            typeof plan.userId === "string"
                              ? plan.userId
                              : (plan.userId as any)?._id ?? ""
                          }`}
                        >
                          View host
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {results && results.pagination && (
          <div className='mt-8 flex items-center justify-center gap-4'>
            <Button
              variant='outline'
              disabled={form.page <= 1}
              onClick={() => changePage(-1)}
            >
              Previous
            </Button>
            <div className='text-sm text-gray-600'>
              Page {form.page} of {results.pagination.totalPage}
            </div>
            <Button
              variant='outline'
              disabled={form.page >= (results.pagination.totalPage || 1)}
              onClick={() => changePage(1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className='container mx-auto px-4 py-10 text-gray-600'>
          Loading explore...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
