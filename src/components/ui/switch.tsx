import React from "react";
import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const SwitchComponent = React.forwardRef<
  React.ElementRef<typeof Switch.Root>,
  React.ComponentPropsWithoutRef<typeof Switch.Root>
>(({ className, ...props }, ref) => (
  <Switch.Root
    className={cn(
      "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-b-transparent border-t-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <Switch.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </Switch.Root>
));
SwitchComponent.displayName = Switch.Root.displayName;

export { SwitchComponent as Switch };
