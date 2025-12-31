"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAppSelector } from "@/lib/redux/hooks";
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
import { useToast } from "@/components/ui/use-toast";
import { X, Plus } from "lucide-react";

export default function AddTravelPlanPage() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { toast, Toaster } = useToast();

  const [loading, setLoading] = useState(false);
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
  });

  const [newInterest, setNewInterest] = useState("");

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
    if (!currentUser) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        destination: {
          country: form.country,
          city: form.city,
        },
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
        status: "planning" as const,
      };

      await apiClient.post(
        API_ENDPOINTS.TRAVEL_PLANS.CREATE,
        payload,
        accessToken || undefined
      );
      toast("Travel plan created", "Your plan has been published.", "success");
      router.push("/travel-plans");
    } catch (error) {
      console.error("Failed to create plan:", error);
      toast("Failed to create travel plan", "Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 py-8'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl'>
        <Card>
          <CardHeader>
            <CardTitle>Create Travel Plan</CardTitle>
            <CardDescription>
              Plan your trip and find travel companions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Destination */}
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='country'>Country *</Label>
                  <Input
                    id='country'
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    placeholder='e.g., Japan'
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='city'>City *</Label>
                  <Input
                    id='city'
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder='e.g., Tokyo'
                    required
                  />
                </div>
              </div>

              {/* Dates */}
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

              {/* Budget */}
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
                    placeholder='1000'
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
                    placeholder='5000'
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='currency'>Currency</Label>
                  <Select
                    value={form.currency}
                    onValueChange={(value) =>
                      setForm({ ...form, currency: value })
                    }
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

              {/* Travel Type */}
              <div>
                <Label htmlFor='travelType'>Travel Type *</Label>
                <Select
                  value={form.travelType}
                  onValueChange={(value: any) =>
                    setForm({ ...form, travelType: value })
                  }
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

              {/* Max Travelers */}
              <div>
                <Label htmlFor='maxTravelers'>Max Travelers (Optional)</Label>
                <Input
                  id='maxTravelers'
                  type='number'
                  value={form.maxTravelers}
                  onChange={(e) =>
                    setForm({ ...form, maxTravelers: e.target.value })
                  }
                  placeholder='Leave empty for unlimited'
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  placeholder='Brief description of your travel plan...'
                />
              </div>

              {/* Itinerary */}
              <div>
                <Label htmlFor='itinerary'>Itinerary (Optional)</Label>
                <Textarea
                  id='itinerary'
                  value={form.itinerary}
                  onChange={(e) =>
                    setForm({ ...form, itinerary: e.target.value })
                  }
                  rows={5}
                  placeholder='Day 1: Arrival and check-in&#10;Day 2: City tour...&#10;Day 3: Museum visit...'
                />
              </div>

              {/* Interests */}
              <div>
                <Label>Interests</Label>
                <div className='flex gap-2 mt-2'>
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addInterest())
                    }
                    placeholder='Add an interest (e.g., hiking, food)'
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

              {/* Submit */}
              <div className='flex gap-3 pt-4'>
                <Button type='submit' disabled={loading} className='flex-1'>
                  {loading ? "Creating..." : "Create Plan"}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.back()}
                  className='flex-1'
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
