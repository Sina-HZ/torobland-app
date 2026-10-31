"use client";

import { cn } from "@/lib/utils";
import * as Checkbox from "@radix-ui/react-checkbox";
import React from "react";

const CheckboxComponent = React.forwardRef<
  React.ElementRef<typeof Checkbox.Root>,
  React.ComponentPropsWithoutRef<typeof Checkbox.Root>
>(({ className, ...props }, ref) => (
  <Checkbox.Root
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-slate-600 bg-slate-900 text-cyan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-cyan-600 data-[state=checked]:bg-cyan-600",
      className,
    )}
    {...props}
    ref={ref}
  >
    <Checkbox.Indicator className={cn("flex items-center justify-center")}>
      <span className="text-[10px]">✓</span>
    </Checkbox.Indicator>
  </Checkbox.Root>
));
CheckboxComponent.displayName = Checkbox.Root.displayName;

export { CheckboxComponent as Checkbox };
