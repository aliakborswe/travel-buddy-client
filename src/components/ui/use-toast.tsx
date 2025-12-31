"use client";

import { useState } from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = (
    title: string,
    description?: string,
    type: ToastType = "info"
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const Toaster = () => (
    <ToastProvider>
      {toasts.map((item) => (
        <Toast
          key={item.id}
          className={
            item.type === "success"
              ? "bg-green-50 border-green-200"
              : item.type === "error"
              ? "bg-red-50 border-red-200"
              : "bg-blue-50 border-blue-200"
          }
        >
          <div className='grid gap-1'>
            <ToastTitle>{item.title}</ToastTitle>
            {item.description && (
              <ToastDescription>{item.description}</ToastDescription>
            )}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );

  return { toast, Toaster };
}
