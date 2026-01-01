"use client";

import { useEffect, useState } from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "@/components/ui/toast";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

// Global state for toasts
let toastsState: ToastItem[] = [];
const listeners = new Set<(toasts: ToastItem[]) => void>();

function emitChange() {
  listeners.forEach((listener) => listener(toastsState));
}

function addToast(
  title: string,
  description?: string,
  type: ToastType = "info"
) {
  const id = Math.random().toString(36).substr(2, 9);
  toastsState = [...toastsState, { id, title, description, type }];
  emitChange();

  setTimeout(() => {
    toastsState = toastsState.filter((t) => t.id !== id);
    emitChange();
  }, 5000);
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>(toastsState);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  const toast = (
    title: string,
    description?: string,
    type: ToastType = "info"
  ) => {
    addToast(title, description, type);
  };

  const Toaster = () => (
    <>
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
    </>
  );

  return { toast, Toaster };
}
