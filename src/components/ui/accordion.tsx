"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemContextType {
  open: boolean;
  toggle: () => void;
}

const AccordionItemContext = React.createContext<AccordionItemContextType | undefined>(undefined);

export function Accordion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  type?: "single" | "multiple";
}) {
  return <div className={cn("divide-y divide-border rounded-xl border border-border bg-card", className)}>{children}</div>;
}

export function AccordionItem({
  children,
  className,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  className?: string;
  value?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <AccordionItemContext.Provider value={{ open, toggle: () => setOpen(!open) }}>
      <div className={cn("overflow-hidden px-4", className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) throw new Error("AccordionTrigger must be used inside AccordionItem");

  return (
    <button
      type="button"
      onClick={ctx.toggle}
      className={cn(
        "flex w-full items-center justify-between py-4 text-left font-medium text-foreground transition-all hover:text-primary",
        className
      )}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
          ctx.open && "rotate-180 text-primary"
        )}
      />
    </button>
  );
}

export function AccordionContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) throw new Error("AccordionContent must be used inside AccordionItem");

  if (!ctx.open) return null;

  return (
    <div className={cn("pb-4 pt-0 text-sm text-muted-foreground leading-relaxed animate-in fade-in-50 duration-200", className)}>
      {children}
    </div>
  );
}
