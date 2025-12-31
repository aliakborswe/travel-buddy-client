"use client";

import { useToast } from "@/components/ui/use-toast";

export function ToasterProvider() {
  const { Toaster } = useToast();
  return <Toaster />;
}
