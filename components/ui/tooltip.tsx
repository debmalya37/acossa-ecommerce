/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

/* ---------------------------
   1️⃣ Global TooltipProvider
---------------------------- */
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => (
  <TooltipPrimitive.Provider delayDuration={200}>
    {children}
  </TooltipPrimitive.Provider>
);

/* ---------------------------
   2️⃣ Tooltip Root
---------------------------- */
export const Tooltip = TooltipPrimitive.Root;

/* ---------------------------
   3️⃣ Tooltip Trigger
---------------------------- */
export const TooltipTrigger = TooltipPrimitive.Trigger;

/* ----------------------------------------------------
   4️⃣ SAFE TooltipContent — prevents hydration errors!
------------------------------------------------------ */

export function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  
  // Try reading Tooltip root context
  const context = (TooltipPrimitive as any).__context;

  // ❗ If no TooltipRoot above → DO NOT render Portal
  if (!context || !context.Provider) {
    return null;
  }

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md",
          "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-foreground" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}
