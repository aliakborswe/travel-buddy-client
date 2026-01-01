"use client";

import { useToast } from "@/components/ui/use-toast";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";

export function ToasterProvider() {
  const { Toaster } = useToast();

  return (
    <ToastProvider>
      <Toaster />
      <ToastViewport />
    </ToastProvider>
  );
}
