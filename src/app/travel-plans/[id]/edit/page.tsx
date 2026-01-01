"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAppSelector } from "@/lib/redux/hooks";
import type { TravelPlan, ApiResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { showErrorAlert } from "@/lib/sweetalert";

export default function EditTravelPlanPage() {
  const params = useParams();
  const router = useRouter();
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    country: "",
    city: "",
    startDate: "",
    endDate: "",
    minBudget: "",
    maxBudget: "",
    currency: "USD",
    travelType: "solo" as "solo" | "family" | "friends" | "couple",
    description: "",
    itinerary: "",
    maxTravelers: "",
    interests: [] as string[],
    status: "planning" as "planning" | "active" | "completed" | "cancelled",
  });
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res: ApiResponse<TravelPlan> = await apiClient.get(
          API_ENDPOINTS.TRAVEL_PLANS.GET(params.id as string),
          accessToken || undefined
        );
        const p = res.data;
        setForm({
          country: p.destination.country,
          city: p.destination.city,
          startDate: p.startDate.substring(0, 10),
          endDate: p.endDate.substring(0, 10),
          minBudget: String(p.budgetRange.min),
          maxBudget: String(p.budgetRange.max),
          currency: p.budgetRange.currency,
          travelType: p.travelType,
          description: p.description || "",
          itinerary: p.itinerary || "",
          maxTravelers: p.maxTravelers ? String(p.maxTravelers) : "",
          interests: p.interests || [],
          status: p.status,
        });
      } catch {
        // fallback route if load fails
        router.replace(`/travel-plans/${params.id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [params.id, accessToken, router]);

  const addInterest = () => {
    if (newInterest.trim() && !form.interests.includes(newInterest.trim())) {
      setForm({ ...form, interests: [...form.interests, newInterest.trim()] });
      setNewInterest("");
    }
  };
  const removeInterest = (interest: string) => {
    setForm({
      ...form,
      interests: form.interests.filter((i) => i !== interest),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        destination: { country: form.country, city: form.city },
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        budgetRange: {
          min: Number(form.minBudget),
          max: Number(form.maxBudget),
          currency: form.currency,
        },
        travelType: form.travelType,
        description: form.description,
        itinerary: form.itinerary,
        maxTravelers: form.maxTravelers ? Number(form.maxTravelers) : undefined,
        interests: form.interests || [],
        status: form.status,
      };
      await apiClient.patch(
        API_ENDPOINTS.TRAVEL_PLANS.UPDATE(params.id as string),
        payload,
        accessToken || undefined
      );
      router.push(`/travel-plans/${params.id}`);
    } catch {
      showErrorAlert("Failed to save changes", "Please try again.");
    } finally {
      setSaving(false);
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
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl'>
        <Card>
          <CardHeader>
            <CardTitle>Edit Travel Plan</CardTitle>
            <CardDescription>
              Update details and keep your buddies in the loop
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='country'>Country *</Label>
                  <Input
                    id='country'
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='city'>City *</Label>
                  <Input
                    id='city'
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='startDate'>Start Date *</Label>
                  <Input
                    id='startDate'
                    type='date'
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='endDate'>End Date *</Label>
                  <Input
                    id='endDate'
                    type='date'
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className='grid md:grid-cols-3 gap-4'>
                <div>
                  <Label htmlFor='minBudget'>Min Budget *</Label>
                  <Input
                    id='minBudget'
                    type='number'
                    value={form.minBudget}
                    onChange={(e) =>
                      setForm({ ...form, minBudget: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='maxBudget'>Max Budget *</Label>
                  <Input
                    id='maxBudget'
                    type='number'
                    value={form.maxBudget}
                    onChange={(e) =>
                      setForm({ ...form, maxBudget: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='currency'>Currency</Label>
                  <Select
                    value={form.currency}
                    onValueChange={(v) => setForm({ ...form, currency: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='USD'>USD</SelectItem>
                      <SelectItem value='EUR'>EUR</SelectItem>
                      <SelectItem value='GBP'>GBP</SelectItem>
                      <SelectItem value='JPY'>JPY</SelectItem>
                      <SelectItem value='AUD'>AUD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor='travelType'>Travel Type *</Label>
                <Select
                  value={form.travelType}
                  onValueChange={(
                    v: "solo" | "family" | "friends" | "couple"
                  ) => setForm({ ...form, travelType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='solo'>Solo</SelectItem>
                    <SelectItem value='couple'>Couple</SelectItem>
                    <SelectItem value='family'>Family</SelectItem>
                    <SelectItem value='friends'>Friends</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='status'>Status *</Label>
                <Select
                  value={form.status}
                  onValueChange={(
                    v: "planning" | "active" | "completed" | "cancelled"
                  ) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='planning'>Planning</SelectItem>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='completed'>Completed</SelectItem>
                    <SelectItem value='cancelled'>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='maxTravelers'>Max Travelers (Optional)</Label>
                <Input
                  id='maxTravelers'
                  type='number'
                  value={form.maxTravelers}
                  onChange={(e) =>
                    setForm({ ...form, maxTravelers: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor='itinerary'>Itinerary (Optional)</Label>
                <Textarea
                  id='itinerary'
                  rows={5}
                  value={form.itinerary}
                  onChange={(e) =>
                    setForm({ ...form, itinerary: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Interests</Label>
                <div className='flex gap-2 mt-2'>
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addInterest())
                    }
                    placeholder='Add an interest'
                  />
                  <Button type='button' onClick={addInterest} variant='outline'>
                    <Plus className='w-4 h-4' />
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2 mt-3'>
                  {form.interests.map((interest) => (
                    <Badge key={interest} variant='secondary'>
                      {interest}
                      <button
                        type='button'
                        onClick={() => removeInterest(interest)}
                        className='ml-1 hover:text-red-600'
                      >
                        <X className='w-3 h-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className='flex gap-3 pt-4'>
                <Button type='submit' disabled={saving} className='flex-1'>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='flex-1'
                  onClick={() => router.push(`/travel-plans/${params.id}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
