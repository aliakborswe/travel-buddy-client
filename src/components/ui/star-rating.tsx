"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({
  rating,
  onRatingChange,
  maxRating = 5,
  size = "md",
  readonly = false,
  showValue = false,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className='flex items-center'>
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= displayRating;
          const isHalfFilled =
            starValue - 0.5 <= displayRating && starValue > displayRating;

          return (
            <button
              key={i}
              type='button'
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={cn(
                "relative transition-all",
                !readonly && "cursor-pointer hover:scale-110",
                readonly && "cursor-default"
              )}
              aria-label={`Rate ${starValue} out of ${maxRating}`}
            >
              {isHalfFilled ? (
                <div className='relative'>
                  <Star
                    className={cn(
                      sizeClasses[size],
                      "text-gray-300 fill-gray-300"
                    )}
                  />
                  <div className='absolute inset-0 overflow-hidden w-1/2'>
                    <Star
                      className={cn(
                        sizeClasses[size],
                        "text-yellow-500 fill-yellow-500"
                      )}
                    />
                  </div>
                </div>
              ) : (
                <Star
                  className={cn(
                    sizeClasses[size],
                    isFilled
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300 fill-gray-300",
                    !readonly && "transition-colors"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className='text-sm font-medium text-gray-700 ml-1'>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export interface StarRatingDisplayProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  totalReviews?: number;
  className?: string;
}

export function StarRatingDisplay({
  rating,
  maxRating = 5,
  size = "md",
  showValue = true,
  totalReviews,
  className,
}: StarRatingDisplayProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <StarRating
        rating={rating}
        maxRating={maxRating}
        size={size}
        readonly
        showValue={false}
      />
      {showValue && (
        <span className='text-sm font-medium text-gray-700'>
          {rating.toFixed(1)}
          {totalReviews !== undefined && (
            <span className='text-gray-500 ml-1'>({totalReviews})</span>
          )}
        </span>
      )}
    </div>
  );
}
