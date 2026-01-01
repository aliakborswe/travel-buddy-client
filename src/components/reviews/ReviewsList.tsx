import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Review, User, ApiResponse } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ReviewsListProps {
  userId: string;
  title?: string;
}

export default function ReviewsList({
  userId,
  title = "Reviews",
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res: ApiResponse<Review[]> = await apiClient.get(
        API_ENDPOINTS.REVIEWS.BY_USER(userId)
      );
      setReviews(Array.isArray(res.data) ? res.data : []);
      if (res.meta?.averageRating) setAvg(res.meta.averageRating);
    } catch {
      // silently ignore for now
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='animate-pulse h-24 bg-gray-100 rounded-md' />
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-gray-500'>No reviews yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>{title}</CardTitle>
          {typeof avg === "number" && (
            <div className='flex items-center gap-1 text-sm text-gray-700'>
              <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
              <span className='font-semibold'>{avg.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {reviews.map((review) => {
            const reviewer =
              typeof review.reviewerId === "object"
                ? (review.reviewerId as User)
                : null;
            return (
              <div key={review._id} className='border-b pb-4 last:border-0'>
                <div className='flex items-start justify-between mb-2'>
                  <div className='flex-1'>
                    <p className='font-semibold text-gray-900'>
                      {reviewer?.fullName || "Anonymous"}
                    </p>
                    <div className='flex items-center gap-1 mt-1'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-gray-500'>
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                {review.comment && (
                  <p className='text-gray-700 text-sm'>{review.comment}</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
