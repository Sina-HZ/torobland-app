"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type AccordionValue = string | undefined;

type AccordionContextValue = {
  value: AccordionValue;
  setValue: (value: string) => void;
  collapsible: boolean;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single";
  value?: AccordionValue;
  defaultValue?: AccordionValue;
  collapsible?: boolean;
  onValueChange?: (value: AccordionValue) => void;
}

function Accordion({
  className,
  value: controlledValue,
  defaultValue,
  collapsible = false,
  onValueChange,
  children,
  ...props
}: AccordionProps) {
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState<AccordionValue>(defaultValue);
  const value = controlledValue === undefined ? uncontrolledValue : controlledValue;

  const setValue = (nextValue: string) => {
    const next = collapsible && value === nextValue ? undefined : nextValue;
    if (controlledValue === undefined) {
      setUncontrolledValue(next);
    }
    onValueChange?.(next);
  };

  return (
    <AccordionContext.Provider value={{ value, setValue, collapsible }}>
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  return (
    <div
      data-state={useAccordionItemState(value)}
      className={cn("border-b border-slate-800 last:border-b-0", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function useAccordionItemState(value: string) {
  const accordion = React.useContext(AccordionContext);
  return accordion?.value === value ? "open" : "closed";
}

interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ value, className, children, onClick, ...props }, ref) => {
    const accordion = React.useContext(AccordionContext);
    if (!accordion) {
      throw new Error("AccordionTrigger must be used inside Accordion");
    }

    const open = accordion.value === value;
    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between py-3 text-right text-sm font-medium transition-all hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500",
          className
        )}
        onClick={(event) => {
          accordion.setValue(value);
          onClick?.(event);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function AccordionContent({ value, className, children, ...props }: AccordionContentProps) {
  const accordion = React.useContext(AccordionContext);
  const open = accordion?.value === value;

  return (
    <div
      role="region"
      hidden={!open}
      className={cn("overflow-hidden text-sm", open && "pb-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
