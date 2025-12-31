"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setUser } from "@/lib/redux/slices/authSlice";
import type { User, ApiResponse } from "@/lib/types";
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
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

export default function EditProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    currentLocation: "",
    profileImage: "",
    travelInterests: [] as string[],
    visitedCountries: [] as string[],
  });

  const [newInterest, setNewInterest] = useState("");
  const [newCountry, setNewCountry] = useState("");

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    setForm({
      fullName: currentUser.fullName,
      bio: currentUser.bio || "",
      currentLocation: currentUser.currentLocation || "",
      profileImage: currentUser.profileImage || "",
      travelInterests: currentUser.travelInterests || [],
      visitedCountries: currentUser.visitedCountries || [],
    });
  }, [currentUser, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload to Cloudinary via backend API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        setForm({ ...form, profileImage: data.data.url });
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast("Failed to upload image", "Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  const addInterest = () => {
    if (
      newInterest.trim() &&
      !form.travelInterests.includes(newInterest.trim())
    ) {
      setForm({
        ...form,
        travelInterests: [...form.travelInterests, newInterest.trim()],
      });
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setForm({
      ...form,
      travelInterests: form.travelInterests.filter((i) => i !== interest),
    });
  };

  const addCountry = () => {
    if (
      newCountry.trim() &&
      !form.visitedCountries.includes(newCountry.trim())
    ) {
      setForm({
        ...form,
        visitedCountries: [...form.visitedCountries, newCountry.trim()],
      });
      setNewCountry("");
    }
  };

  const removeCountry = (country: string) => {
    setForm({
      ...form,
      visitedCountries: form.visitedCountries.filter((c) => c !== country),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      const response: ApiResponse<User> = await apiClient.patch(
        API_ENDPOINTS.USERS.UPDATE(currentUser._id),
        form,
        accessToken || undefined
      );

      dispatch(setUser(response.data));
      router.push(`/profile/${currentUser._id}`);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast("Failed to update profile", "Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 py-8'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl'>
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your information and travel preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Profile Image */}
              <div>
                <Label>Profile Image</Label>
                <div className='mt-2 flex items-center gap-4'>
                  <div className='relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200'>
                    {form.profileImage ? (
                      <Image
                        src={form.profileImage}
                        alt='Profile'
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <div className='w-full h-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold'>
                        {form.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor='image-upload'>
                      <Button
                        type='button'
                        variant='outline'
                        disabled={uploading}
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                      >
                        <Upload className='w-4 h-4 mr-2' />
                        {uploading ? "Uploading..." : "Upload Image"}
                      </Button>
                    </label>
                    <input
                      id='image-upload'
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={handleImageUpload}
                    />
                    <p className='text-xs text-gray-500 mt-1'>
                      JPG, PNG or GIF (max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <Label htmlFor='fullName'>Full Name</Label>
                <Input
                  id='fullName'
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor='bio'>Bio</Label>
                <Textarea
                  id='bio'
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={4}
                  placeholder='Tell others about yourself and your travel style...'
                />
              </div>

              {/* Current Location */}
              <div>
                <Label htmlFor='currentLocation'>Current Location</Label>
                <Input
                  id='currentLocation'
                  value={form.currentLocation}
                  onChange={(e) =>
                    setForm({ ...form, currentLocation: e.target.value })
                  }
                  placeholder='e.g., New York, USA'
                />
              </div>

              {/* Travel Interests */}
              <div>
                <Label>Travel Interests</Label>
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
                  {form.travelInterests.map((interest) => (
                    <Badge key={interest} variant='secondary' className='gap-1'>
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

              {/* Visited Countries */}
              <div>
                <Label>Visited Countries</Label>
                <div className='flex gap-2 mt-2'>
                  <Input
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addCountry())
                    }
                    placeholder='Add a country'
                  />
                  <Button type='button' onClick={addCountry} variant='outline'>
                    <Plus className='w-4 h-4' />
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2 mt-3'>
                  {form.visitedCountries.map((country) => (
                    <Badge key={country} variant='secondary' className='gap-1'>
                      {country}
                      <button
                        type='button'
                        onClick={() => removeCountry(country)}
                        className='ml-1 hover:text-red-600'
                      >
                        <X className='w-3 h-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className='flex gap-3 pt-4'>
                <Button type='submit' disabled={loading} className='flex-1'>
                  {loading ? "Saving..." : "Save Changes"}
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
