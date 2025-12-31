"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/constants";
import { useAppSelector } from "@/lib/redux/hooks";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";

interface ReviewFormProps {
  travelPlanId: string;
  reviewedUserId: string;
  reviewedUserName: string;
  existingReviewId?: string;
  existingRating?: number;
  existingComment?: string;
  onSuccess?: () => void;
}

export function ReviewForm({
  travelPlanId,
  reviewedUserId,
  reviewedUserName,
  existingReviewId,
  existingRating,
  existingComment,
  onSuccess,
}: ReviewFormProps) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { toast, Toaster } = useToast();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(existingRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingComment || "");
  const [loading, setLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(!!existingReviewId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast("Please select a rating", undefined, "error");
      return;
    }

    setLoading(true);
    try {
      if (existingReviewId) {
        // Update existing review
        await apiClient.patch(
          API_ENDPOINTS.REVIEWS.UPDATE(existingReviewId),
          {
            rating,
            comment: comment.trim() || undefined,
          },
          accessToken || undefined
        );
        toast("Review updated successfully!", undefined, "success");
      } else {
        // Create new review
        await apiClient.post(
          API_ENDPOINTS.REVIEWS.CREATE,
          {
            travelPlanId,
            reviewedUserId,
            rating,
            comment: comment.trim() || undefined,
          },
          accessToken || undefined
        );
        toast("Review submitted successfully!", undefined, "success");
      }

      setOpen(false);
      setHasReviewed(true);
      onSuccess?.();
    } catch (error: unknown) {
      console.error("Failed to submit review:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Please try again.";
      toast("Failed to submit review", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {hasReviewed && !existingReviewId ? (
        <div className='text-sm text-gray-500 italic'>
          You have already reviewed {reviewedUserName}
        </div>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant='outline' size='sm'>
              {existingReviewId ? "Edit Review" : "Add Review"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {existingReviewId ? "Edit" : "Review"} {reviewedUserName}
              </DialogTitle>
              <DialogDescription>
                Share your experience traveling with {reviewedUserName}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label>Rating *</Label>
                <div className='flex gap-2 mt-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type='button'
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className='transition-transform hover:scale-110'
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor='comment'>Comment (Optional)</Label>
                <Textarea
                  id='comment'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder='Share details about your travel experience...'
                />
              </div>

              <div className='flex gap-3'>
                <Button
                  type='submit'
                  disabled={loading || rating === 0}
                  className='flex-1'
                >
                  {loading ? "Submitting..." : "Submit Review"}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setOpen(false)}
                  className='flex-1'
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
      <Toaster />
    </>
  );
}
