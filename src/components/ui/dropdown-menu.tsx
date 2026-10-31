"use client";

import { cn } from "@/lib/utils";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

const DropdownMenu = PopoverPrimitive.Root;

const DropdownMenuTrigger = PopoverPrimitive.Trigger;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      className={cn(
        "animate-in fade-in-zoom w-60 min-w-[8rem] overflow-hidden rounded-md border border-slate-700 bg-slate-900 p-1 text-slate-200 shadow-xl",
        className,
      )}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
DropdownMenuContent.displayName = PopoverPrimitive.Content.displayName;

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps
>(({ className, children, disabled, ...props }, ref) => (
  <button
    ref={ref}
    disabled={disabled}
    type="button"
    className={cn(
      "relative flex w-full cursor-pointer items-center rounded-sm px-3 py-2 text-sm transition-colors outline-none select-none focus:bg-slate-800 focus:text-cyan-400 disabled:pointer-events-none disabled:opacity-50",
      disabled && "opacity-50",
      className,
    )}
    {...props}
  >
    {children}
  </button>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn("-mx-1 my-1 h-px border-t border-slate-700", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "px-3 py-1.5 text-xs font-semibold text-slate-500",
      className,
    )}
    {...props}
  >
    {children}
  </span>
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
