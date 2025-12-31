"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

export interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  className,
  maxSize = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"],
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      setError("Invalid file format. Please upload an image.");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary via API
      const formData = new FormData();
      formData.append("file", file);

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
        onChange?.(data.data.url);
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      setPreview(undefined);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type='file'
        accept={acceptedFormats.join(",")}
        onChange={handleFileSelect}
        className='hidden'
        disabled={disabled || uploading}
      />

      {preview ? (
        <Card className='relative overflow-hidden'>
          <CardContent className='p-0'>
            <div className='relative aspect-video w-full'>
              <Image
                src={preview}
                alt='Upload preview'
                className='h-full w-full object-cover'
                fill
              />
              {!disabled && (
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  className='absolute top-2 right-2'
                  onClick={handleRemove}
                >
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={cn(
            "border-2 border-dashed cursor-pointer hover:border-blue-500 transition-colors",
            uploading && "opacity-50 cursor-not-allowed",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onClick={handleClick}
        >
          <CardContent className='flex flex-col items-center justify-center p-8 text-center'>
            {uploading ? (
              <>
                <Loader2 className='h-10 w-10 text-blue-600 animate-spin mb-4' />
                <p className='text-sm text-gray-600'>Uploading...</p>
              </>
            ) : (
              <>
                <div className='rounded-full bg-blue-50 p-4 mb-4'>
                  <ImageIcon className='h-8 w-8 text-blue-600' />
                </div>
                <div className='flex items-center gap-2 mb-2'>
                  <Upload className='h-4 w-4 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    Click to upload or drag and drop
                  </span>
                </div>
                <p className='text-xs text-gray-500'>
                  PNG, JPG, WEBP up to {maxSize}MB
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {error && (
        <p className='text-sm text-red-600 flex items-center gap-1'>
          <X className='h-4 w-4' />
          {error}
        </p>
      )}
    </div>
  );
}

export interface MultiImageUploadProps {
  values?: string[];
  onChange?: (urls: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
  className?: string;
}

export function MultiImageUpload({
  values = [],
  onChange,
  maxImages = 5,
  disabled = false,
  className,
}: MultiImageUploadProps) {
  const handleAdd = (url: string) => {
    const newUrls = [...values, url];
    onChange?.(newUrls);
  };

  const handleRemove = (index: number) => {
    const newUrls = values.filter((_, i) => i !== index);
    onChange?.(newUrls);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        {values.map((url, index) => (
          <ImageUpload
            key={index}
            value={url}
            onRemove={() => handleRemove(index)}
            disabled={disabled}
          />
        ))}
        {values.length < maxImages && (
          <ImageUpload onChange={handleAdd} disabled={disabled} />
        )}
      </div>
      <p className='text-xs text-gray-500'>
        {values.length} of {maxImages} images uploaded
      </p>
    </div>
  );
}
